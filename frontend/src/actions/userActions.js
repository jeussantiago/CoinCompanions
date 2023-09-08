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
    USER_FRIENDS_LIST_FAIL,
    USER_FRIENDS_SEARCH_REQUEST,
    USER_FRIENDS_SEARCH_SUCCESS,
    USER_FRIENDS_SEARCH_FAIL,
    USER_FRIENDS_DELETE_REQUEST,
    USER_FRIENDS_DELETE_SUCCESS,
    USER_FRIENDS_DELETE_FAIL,
    USER_FRIENDS_REQUEST_LIST_REQUEST,
    USER_FRIENDS_REQUEST_LIST_SUCCESS,
    USER_FRIENDS_REQUEST_LIST_FAIL,
    USER_GROUP_REQUEST_LIST_REQUEST,
    USER_GROUP_REQUEST_LIST_SUCCESS,
    USER_GROUP_REQUEST_LIST_FAIL,
    USER_FRIENDS_REQUEST_DECLINE_REQUEST,
    USER_FRIENDS_REQUEST_DECLINE_SUCCESS,
    USER_FRIENDS_REQUEST_DECLINE_FAIL,
    USER_FRIENDS_REQUEST_ACCEPT_REQUEST,
    USER_FRIENDS_REQUEST_ACCEPT_SUCCESS,
    USER_FRIENDS_REQUEST_ACCEPT_FAIL,
    USER_GROUP_CREDIT_DEBT_REQUEST,
    USER_GROUP_CREDIT_DEBT_SUCCESS,
    USER_GROUP_CREDIT_DEBT_FAIL,
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

export const getUserFriendSearch =
    (keyword = "") =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: USER_FRIENDS_SEARCH_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(
                `/api/users/search-users/?query=${keyword}`,
                config
            );

            dispatch({ type: USER_FRIENDS_SEARCH_SUCCESS, payload: data });
        } catch (err) {
            dispatch({
                type: USER_FRIENDS_SEARCH_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const deleteFriend = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_FRIENDS_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/users/remove-friend/${id}/`, config);

        dispatch({ type: USER_FRIENDS_DELETE_SUCCESS });
    } catch (err) {
        dispatch({
            type: USER_FRIENDS_DELETE_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getPendingFriendRequest = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_FRIENDS_REQUEST_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(
            `/api/users/friend-requests/received/`,
            config
        );

        dispatch({ type: USER_FRIENDS_REQUEST_LIST_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: USER_FRIENDS_REQUEST_LIST_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getPendingGroupRequest = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_GROUP_REQUEST_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/groups/invitations`, config);

        dispatch({ type: USER_GROUP_REQUEST_LIST_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: USER_GROUP_REQUEST_LIST_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const deleteFriendRequest = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_FRIENDS_REQUEST_DECLINE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/users/friend-requests/delete/${id}/`, config);

        dispatch({ type: USER_FRIENDS_REQUEST_DECLINE_SUCCESS });
    } catch (err) {
        dispatch({
            type: USER_FRIENDS_REQUEST_DECLINE_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const acceptFriendRequest = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_FRIENDS_REQUEST_ACCEPT_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.post(
            `/api/users/friend-requests/accept/${id}/`,
            {},
            config
        );

        dispatch({ type: USER_FRIENDS_REQUEST_ACCEPT_SUCCESS });
    } catch (err) {
        dispatch({
            type: USER_FRIENDS_REQUEST_ACCEPT_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getUsersGroupsTotalCreditDebit =
    () => async (dispatch, getState) => {
        try {
            dispatch({ type: USER_GROUP_CREDIT_DEBT_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(
                `/api/users/groups-debt-credit/`,
                config
            );

            dispatch({ type: USER_GROUP_CREDIT_DEBT_SUCCESS, payload: data });
        } catch (err) {
            dispatch({
                type: USER_GROUP_CREDIT_DEBT_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };
