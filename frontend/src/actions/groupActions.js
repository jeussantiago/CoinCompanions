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
    GROUP_EXPENSES_CREATE_REQUEST,
    GROUP_EXPENSES_CREATE_SUCCESS,
    GROUP_EXPENSES_CREATE_FAIL,
    GROUP_EXPENSES_DELETE_REQUEST,
    GROUP_EXPENSES_DELETE_SUCCESS,
    GROUP_EXPENSES_DELETE_FAIL,
    GROUP_CREDIT_REQUEST,
    GROUP_CREDIT_SUCCESS,
    GROUP_CREDIT_FAIL,
    GROUP_DEBT_REQUEST,
    GROUP_DEBT_SUCCESS,
    GROUP_DEBT_FAIL,
    GROUP_SETTLE_CREATE_REQUEST,
    GROUP_SETTLE_CREATE_SUCCESS,
    GROUP_SETTLE_CREATE_FAIL,
    GROUP_INVITE_SEND_REQUEST,
    GROUP_INVITE_SEND_SUCCESS,
    GROUP_INVITE_SEND_FAIL,
    GROUP_INVITE_USERS_SEARCH_REQUEST,
    GROUP_INVITE_USERS_SEARCH_SUCCESS,
    GROUP_INVITE_USERS_SEARCH_FAIL,
    GROUP_INVITE_ACCEPT_REQUEST,
    GROUP_INVITE_ACCEPT_SUCCESS,
    GROUP_INVITE_ACCEPT_FAIL,
    GROUP_USER_NEW_INVITATION_REQUEST,
    GROUP_USER_NEW_NVITATION_SUCCESS,
    GROUP_USER_NEW_NVITATION_FAIL,
    GROUP_USER_NEW_ADD_TO_EXPENSES_REQUEST,
    GROUP_USER_NEW_ADD_TO_EXPENSES_SUCCESS,
    GROUP_USER_NEW_ADD_TO_EXPENSES_FAIL,
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

export const getGroupExpenses =
    (groupId, page, itemsPerPage) => async (dispatch, getState) => {
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

            const { data } = await axios.get(
                `/api/groups/${groupId}/expenses/?page=${page}&itemsPerPage=${itemsPerPage}`,
                config
            );

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

export const createGroupExpense =
    (groupId, newGroupExpense) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_EXPENSES_CREATE_REQUEST });

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
                `/api/groups/${groupId}/create-expense/`,
                newGroupExpense,
                config
            );

            dispatch({ type: GROUP_EXPENSES_CREATE_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_EXPENSES_CREATE_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const deleteGroupExpense =
    (groupId, expenseId) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_EXPENSES_DELETE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.delete(
                `/api/groups/${groupId}/expenses/${expenseId}/delete/`,
                config
            );

            dispatch({ type: GROUP_EXPENSES_DELETE_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_EXPENSES_DELETE_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const getGroupCredits = (groupId) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_CREDIT_REQUEST });

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
            `/api/groups/${groupId}/credits/`,
            config
        );

        dispatch({ type: GROUP_CREDIT_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: GROUP_CREDIT_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getGroupDebts = (groupId) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_DEBT_REQUEST });

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
            `/api/groups/${groupId}/debts/`,
            config
        );

        dispatch({ type: GROUP_DEBT_SUCCESS, payload: data });
    } catch (err) {
        dispatch({
            type: GROUP_DEBT_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const createGroupSettle =
    (groupId, receivingUserId, amount) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_SETTLE_CREATE_REQUEST });

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
                `/api/groups/${groupId}/record-payment/`,
                {
                    receiving_user_id: receivingUserId,
                    amount: amount,
                },
                config
            );

            dispatch({ type: GROUP_SETTLE_CREATE_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_SETTLE_CREATE_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const sendGroupInvite =
    (groupId, friendId) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_INVITE_SEND_REQUEST });

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
                `/api/groups/${groupId}/invite/${friendId}/`,
                {},
                config
            );

            dispatch({ type: GROUP_INVITE_SEND_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_INVITE_SEND_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const getGroupUserSearchToInvite =
    (groupId, keyword) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_INVITE_USERS_SEARCH_REQUEST });

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
                `/api/groups/${groupId}/user-search/?keyword=${keyword}`,
                config
            );

            dispatch({
                type: GROUP_INVITE_USERS_SEARCH_SUCCESS,
                payload: data,
            });
        } catch (err) {
            dispatch({
                type: GROUP_INVITE_USERS_SEARCH_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const acceptGroupInvite = (groupId) => async (dispatch, getState) => {
    try {
        dispatch({ type: GROUP_INVITE_ACCEPT_REQUEST });

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
            `/api/groups/invitations/${groupId}/accept/`,
            {},
            config
        );

        dispatch({ type: GROUP_INVITE_ACCEPT_SUCCESS });
    } catch (err) {
        dispatch({
            type: GROUP_INVITE_ACCEPT_FAIL,
            payload:
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message,
        });
    }
};

export const getGroupNewUserInvitation =
    (groupId) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_USER_NEW_INVITATION_REQUEST });

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
                `/api/groups/${groupId}/has-accepted-invitation/`,
                config
            );

            dispatch({ type: GROUP_USER_NEW_NVITATION_SUCCESS, payload: data });
        } catch (err) {
            dispatch({
                type: GROUP_USER_NEW_NVITATION_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };

export const addNewUserToGroupExpenses =
    (groupId, decision) => async (dispatch, getState) => {
        try {
            dispatch({ type: GROUP_USER_NEW_ADD_TO_EXPENSES_REQUEST });

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
                `/api/groups/${groupId}/update-expenses-for-new-user/`,
                {
                    addNewUserToAllEvenlySplitExpenses: decision,
                },
                config
            );

            dispatch({ type: GROUP_USER_NEW_ADD_TO_EXPENSES_SUCCESS });
        } catch (err) {
            dispatch({
                type: GROUP_USER_NEW_ADD_TO_EXPENSES_FAIL,
                payload:
                    err.response && err.response.data.detail
                        ? err.response.data.detail
                        : err.message,
            });
        }
    };
