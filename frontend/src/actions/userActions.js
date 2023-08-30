import axios from "axios";
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_FRIENDS_LIST_REQUEST,
    USER_FRIENDS_LIST_SUCCESS,
    USER_FRIENDS_LIST_FAIL
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        // get auth token when login
        // because of our rondabout way of setting the email to be our username
        // we pass in the the email as the username login credential
        const { data } = await axios.post(
            "/api/users/login",
            {
                username: email,
                password: password,
            },
            config
        );
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
};

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        // get auth token when login
        // because of our rondabout way of setting the email to be our username
        // we pass in the the email as the username login credential
        const { data } = await axios.post(
            "/api/users/register",
            {
                name: name,
                email: email,
                password: password,
            },
            config
        );

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getUsersFriends = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_FRIENDS_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/users/friends/`, config);

        dispatch({ type: USER_FRIENDS_LIST_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: USER_FRIENDS_LIST_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};
