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
    GROUP_EXPENSES_CREATE_REQUEST,
    GROUP_EXPENSES_CREATE_SUCCESS,
    GROUP_EXPENSES_CREATE_FAIL,
    GROUP_EXPENSES_CREATE_RESET,
    GROUP_EXPENSES_DELETE_REQUEST,
    GROUP_EXPENSES_DELETE_SUCCESS,
    GROUP_EXPENSES_DELETE_FAIL,
    GROUP_EXPENSES_DELETE_RESET,
    GROUP_CREDIT_REQUEST,
    GROUP_CREDIT_SUCCESS,
    GROUP_CREDIT_FAIL,
    GROUP_DEBT_REQUEST,
    GROUP_DEBT_SUCCESS,
    GROUP_DEBT_FAIL,
    GROUP_SETTLE_CREATE_REQUEST,
    GROUP_SETTLE_CREATE_SUCCESS,
    GROUP_SETTLE_CREATE_FAIL,
    GROUP_SETTLE_CREATE_RESET,
    GROUP_INVITE_SEND_REQUEST,
    GROUP_INVITE_SEND_SUCCESS,
    GROUP_INVITE_SEND_FAIL,
    GROUP_INVITE_SEND_RESET,
    GROUP_INVITE_USERS_SEARCH_REQUEST,
    GROUP_INVITE_USERS_SEARCH_SUCCESS,
    GROUP_INVITE_USERS_SEARCH_FAIL,
    GROUP_INVITE_ACCEPT_REQUEST,
    GROUP_INVITE_ACCEPT_SUCCESS,
    GROUP_INVITE_ACCEPT_FAIL,
    GROUP_INVITE_ACCEPT_RESET,
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

export const groupExpenseCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_EXPENSES_CREATE_REQUEST:
            return { loading: true };

        case GROUP_EXPENSES_CREATE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_EXPENSES_CREATE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_EXPENSES_CREATE_RESET:
            return {};

        default:
            return state;
    }
};

export const groupExpenseDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_EXPENSES_DELETE_REQUEST:
            return { loading: true };

        case GROUP_EXPENSES_DELETE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_EXPENSES_DELETE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_EXPENSES_DELETE_RESET:
            return {};

        default:
            return state;
    }
};

export const groupCreditsReducer = (state = { groupCredit: {} }, action) => {
    switch (action.type) {
        case GROUP_CREDIT_REQUEST:
            return { loading: true, groupCredit: {} };

        case GROUP_CREDIT_SUCCESS:
            return { loading: false, groupCredit: action.payload };

        case GROUP_CREDIT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const groupDebtsReducer = (state = { groupDebt: {} }, action) => {
    switch (action.type) {
        case GROUP_DEBT_REQUEST:
            return { loading: true, groupDebt: {} };

        case GROUP_DEBT_SUCCESS:
            return { loading: false, groupDebt: action.payload };

        case GROUP_DEBT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const groupSettleCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_SETTLE_CREATE_REQUEST:
            return { loading: true };

        case GROUP_SETTLE_CREATE_SUCCESS:
            return { loading: false, success: true };

        case GROUP_SETTLE_CREATE_FAIL:
            return { loading: false, success: false, error: action.payload };

        case GROUP_SETTLE_CREATE_RESET:
            return {};

        default:
            return state;
    }
};

export const groupInviteSendReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_INVITE_SEND_REQUEST:
            return { loading: true };

        case GROUP_INVITE_SEND_SUCCESS:
            return { loading: false, success: true };

        case GROUP_INVITE_SEND_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_INVITE_SEND_RESET:
            return {};

        default:
            return state;
    }
};

export const groupUserSearchToInviteReducer = (
    state = { userFriendNotMemberGroupSearchResults: [] },
    action
) => {
    switch (action.type) {
        case GROUP_INVITE_USERS_SEARCH_REQUEST:
            return { loading: true, userFriendNotMemberGroupSearchResults: [] };

        case GROUP_INVITE_USERS_SEARCH_SUCCESS:
            return {
                loading: false,
                userFriendNotMemberGroupSearchResults: action.payload,
            };

        case GROUP_INVITE_USERS_SEARCH_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const groupInviteAcceptReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_INVITE_ACCEPT_REQUEST:
            return { loading: true };

        case GROUP_INVITE_ACCEPT_SUCCESS:
            return { loading: false, success: true };

        case GROUP_INVITE_ACCEPT_FAIL:
            return { loading: false, error: action.payload, success: false };

        case GROUP_INVITE_ACCEPT_RESET:
            return {};

        default:
            return state;
    }
};
