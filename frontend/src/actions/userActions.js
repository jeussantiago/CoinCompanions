import axios from "axios";
import {
    // USER_LIST_FAIL,
    // USER_LIST_REQUEST,
    // USER_LIST_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
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

// DELETE THIS ACTIONS
// export const getAllUsers = () => async (dispatch) => {
//     try {
//         dispatch({ type: USER_LIST_REQUEST });

//         const { data } = await axios.get("/api/users/allusers");

//         dispatch({
//             type: USER_LIST_SUCCESS,
//             payload: data,
//         });
//     } catch (err) {
//         dispatch({
//             type: USER_LIST_FAIL,
//             payload:
//                 // was previously data.message since thats the default message
//                 // but in the backend, we named it 'detail' now its data.detail
//                 // example can be found in base/views/user_views unser registerUser function in except block
//                 err.response && err.response.data.detail
//                     ? err.response.data.detail
//                     : err.message,
//         });
//     }
// };
