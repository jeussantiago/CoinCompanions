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
    GROUP_DETAILS_REQUEST,
    GROUP_DETAILS_SUCCESS,
    GROUP_DETAILS_FAIL,
    GROUP_NAME_UPDATE_REQUEST,
    GROUP_NAME_UPDATE_SUCCESS,
    GROUP_NAME_UPDATE_FAIL,
    GROUP_EXPENSES_LIST_REQUEST,
    GROUP_EXPENSES_LIST_SUCCESS,
    GROUP_EXPENSES_LIST_FAIL,
    GROUP_EXPENSES_DETAILS_UPDATE_REQUEST,
    GROUP_EXPENSES_DETAILS_UPDATE_SUCCESS,
    GROUP_EXPENSES_DETAILS_UPDATE_FAIL,
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

export const getGroupDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/groups/${id}/details/`, config);

        dispatch({ type: GROUP_DETAILS_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: GROUP_DETAILS_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const updateGroupName =
    (groupId, newGroupName) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_NAME_UPDATE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/groups/${groupId}/update-name/`,
                { name: newGroupName },
                config
            );

            dispatch({ type: GROUP_NAME_UPDATE_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_NAME_UPDATE_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const getGroupExpenses = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_EXPENSES_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/groups/${id}/expenses/`, config);

        dispatch({ type: GROUP_EXPENSES_LIST_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: GROUP_EXPENSES_LIST_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const updateGroupExpense =
    (groupId, expenseId, newGroupExpense) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_EXPENSES_DETAILS_UPDATE_REQUEST });
            console.log(`/api/groups/${groupId}/expenses/${expenseId}/update`);
            console.log("data: ", newGroupExpense);

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/groups/${groupId}/expenses/${expenseId}/update/`,
                newGroupExpense,
                config
            );

            dispatch({ type: GROUP_EXPENSES_DETAILS_UPDATE_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_EXPENSES_DETAILS_UPDATE_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };
