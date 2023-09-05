import {
    GROUP_INVITE_DECLINE_REQUEST,
    GROUP_INVITE_DECLINE_SUCCESS,
    GROUP_INVITE_DECLINE_FAIL,
    GROUP_INVITE_DECLINE_RESET,
    GROUP_CREATE_REQUEST,
    GROUP_CREATE_SUCCESS,
    GROUP_CREATE_FAIL,
    GROUP_CREATE_RESET,
    GROUP_LIST_REQUEST,
    GROUP_LIST_SUCCESS,
    GROUP_LIST_FAIL,
    GROUP_DETAILS_REQUEST,
    GROUP_DETAILS_SUCCESS,
    GROUP_DETAILS_FAIL,
    GROUP_DETAILS_RESET,
    GROUP_NAME_UPDATE_REQUEST,
    GROUP_NAME_UPDATE_SUCCESS,
    GROUP_NAME_UPDATE_FAIL,
    GROUP_NAME_UPDATE_RESET,
    GROUP_EXPENSES_LIST_REQUEST,
    GROUP_EXPENSES_LIST_SUCCESS,
    GROUP_EXPENSES_LIST_FAIL,
    GROUP_EXPENSES_DETAILS_UPDATE_REQUEST,
    GROUP_EXPENSES_DETAILS_UPDATE_SUCCESS,
    GROUP_EXPENSES_DETAILS_UPDATE_FAIL,
    GROUP_EXPENSES_DETAILS_UPDATE_RESET,
} from "../constants/groupConstants";

export const groupInviteDeclineReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_INVITE_DECLINE_REQUEST:
            return { loading: true };

        case GROUP_INVITE_DECLINE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_INVITE_DECLINE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_INVITE_DECLINE_RESET:
            return {};

        default:
            return state;
    }
};

export const groupCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_CREATE_REQUEST:
            return { loading: true };

        case GROUP_CREATE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_CREATE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_CREATE_RESET:
            return {};

        default:
            return state;
    }
};

export const groupListsReducer = (state = { groupList: [] }, action) => {
    switch (action.type) {
        case GROUP_LIST_REQUEST:
            return { loading: true, groupList: [] };

        case GROUP_LIST_SUCCESS:
            return { loading: false, groupList: action.payload };

        case GROUP_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const groupDetailsReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_DETAILS_REQUEST:
            return { loading: true };

        case GROUP_DETAILS_SUCCESS:
            return { loading: false, groupDetail: action.payload };

        case GROUP_DETAILS_FAIL:
            return { loading: false, error: action.payload };

        case GROUP_DETAILS_RESET:
            return {};

        default:
            return state;
    }
};

export const groupNameUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_NAME_UPDATE_REQUEST:
            return { loading: true };

        case GROUP_NAME_UPDATE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_NAME_UPDATE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_NAME_UPDATE_RESET:
            return {};

        default:
            return state;
    }
};

export const groupExpensesReducer = (
    state = { groupExpensesList: [] },
    action
) => {
    switch (action.type) {
        case GROUP_EXPENSES_LIST_REQUEST:
            return { loading: true, groupExpensesList: [] };

        case GROUP_EXPENSES_LIST_SUCCESS:
            return { loading: false, groupExpensesList: action.payload };

        case GROUP_EXPENSES_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const groupExpenseDetailUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_EXPENSES_DETAILS_UPDATE_REQUEST:
            return { loading: true };

        case GROUP_EXPENSES_DETAILS_UPDATE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_EXPENSES_DETAILS_UPDATE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_EXPENSES_DETAILS_UPDATE_RESET:
            return {};

        default:
            return state;
    }
};
