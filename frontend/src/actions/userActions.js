import axios from "axios";
import {
    USER_LIST_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
} from "../constants/userConstants";

export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: USER_LIST_REQUEST });

        const { data } = await axios.get("/api/users/allusers");

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (err) {
        dispatch({
            type: USER_LIST_FAIL,
            payload:
                // was previously data.message since thats the default message
                // but in the backend, we named it 'detail' now its data.detail
                // example can be found in base/views/user_views unser registerUser function in except block
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};
