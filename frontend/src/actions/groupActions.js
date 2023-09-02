import axios from "axios";
import {
    GROUP_INVITE_DECLINE_REQUEST,
    GROUP_INVITE_DECLINE_SUCCESS,
    GROUP_INVITE_DECLINE_FAIL,
    GROUP_CREATE_REQUEST,
    GROUP_CREATE_SUCCESS,
    GROUP_CREATE_FAIL,
    GROUP_LIST_REQUEST,
    GROUP_LIST_SUCCESS,
    GROUP_LIST_FAIL,
} from "../constants/groupConstants";

export const deleteGroupInvite = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_INVITE_DECLINE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/groups/invitations/${id}/decline/`, config);

        dispatch({ type: GROUP_INVITE_DECLINE_SUCCESS });
    } catch (err) {
        dispatch({
            type: GROUP_INVITE_DECLINE_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const createGroup = (title) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.post(`/api/groups/create/`, { name: title }, config);

        dispatch({ type: GROUP_CREATE_SUCCESS });
    } catch (err) {
        dispatch({
            type: GROUP_CREATE_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getGroupsList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/users/groups/`, config);

        dispatch({ type: GROUP_LIST_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: GROUP_LIST_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};
