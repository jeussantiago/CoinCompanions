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
    USER_FRIENDS_DELETE_RESET,
    USER_FRIENDS_REQUEST_LIST_REQUEST,
    USER_FRIENDS_REQUEST_LIST_SUCCESS,
    USER_FRIENDS_REQUEST_LIST_FAIL,
    USER_GROUP_REQUEST_LIST_REQUEST,
    USER_GROUP_REQUEST_LIST_SUCCESS,
    USER_GROUP_REQUEST_LIST_FAIL,
    USER_FRIENDS_REQUEST_DECLINE_REQUEST,
    USER_FRIENDS_REQUEST_DECLINE_SUCCESS,
    USER_FRIENDS_REQUEST_DECLINE_FAIL,
    USER_FRIENDS_REQUEST_DECLINE_RESET,
    USER_FRIENDS_REQUEST_ACCEPT_REQUEST,
    USER_FRIENDS_REQUEST_ACCEPT_SUCCESS,
    USER_FRIENDS_REQUEST_ACCEPT_FAIL,
    USER_FRIENDS_REQUEST_ACCEPT_RESET,
    USER_GROUP_CREDIT_DEBT_REQUEST,
    USER_GROUP_CREDIT_DEBT_SUCCESS,
    USER_GROUP_CREDIT_DEBT_FAIL,
    USER_CREDIT_REQUEST,
    USER_CREDIT_SUCCESS,
    USER_CREDIT_FAIL,
    USER_DEBT_REQUEST,
    USER_DEBT_SUCCESS,
    USER_DEBT_FAIL,
    USER_FRIEND_NOT_MEMBER_GROUP_SEARCH_REQUEST,
    USER_FRIEND_NOT_MEMBER_GROUP_SEARCH_SUCCESS,
    USER_FRIEND_NOT_MEMBER_GROUP_SEARCH_FAIL,
    USER_PROFILE_UPDATE_REQUEST,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_FAIL,
    USER_PROFILE_UPDATE_RESET,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };

        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };

        case USER_LOGOUT:
            return {};

        default:
            return state;
    }
};

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };

        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };

        case USER_LOGOUT:
            return {};

        default:
            return state;
    }
};

export const userFriendsListReducer = (state = { userFriends: [] }, action) => {
    switch (action.type) {
        case USER_FRIENDS_LIST_REQUEST:
            return { loading: true, userFriends: [] };

        case USER_FRIENDS_LIST_SUCCESS:
            return { loading: false, userFriends: action.payload };

        case USER_FRIENDS_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userFriendSearchReducer = (
    state = { userFriendSearch: [] },
    action
) => {
    switch (action.type) {
        case USER_FRIENDS_SEARCH_REQUEST:
            return { loading: true, userFriendSearch: [] };

        case USER_FRIENDS_SEARCH_SUCCESS:
            return { loading: false, userFriendSearch: action.payload };

        case USER_FRIENDS_SEARCH_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userFriendDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FRIENDS_DELETE_REQUEST:
            return { loading: true };

        case USER_FRIENDS_DELETE_SUCCESS:
            return { loading: false, success: true };

        case USER_FRIENDS_DELETE_FAIL:
            return { loading: false, success: false, error: action.payload };

        case USER_FRIENDS_DELETE_RESET:
            return {};

        default:
            return state;
    }
};

export const userFriendRequestListReducer = (
    state = { friendRequestList: [] },
    action
) => {
    switch (action.type) {
        case USER_FRIENDS_REQUEST_LIST_REQUEST:
            return { loading: true };

        case USER_FRIENDS_REQUEST_LIST_SUCCESS:
            return { loading: false, friendRequestList: action.payload };

        case USER_FRIENDS_REQUEST_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userGroupRequestListReducer = (
    state = { groupRequestList: [] },
    action
) => {
    switch (action.type) {
        case USER_GROUP_REQUEST_LIST_REQUEST:
            return { loading: true };

        case USER_GROUP_REQUEST_LIST_SUCCESS:
            return { loading: false, groupRequestList: action.payload };

        case USER_GROUP_REQUEST_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userFriendRequestDeclineReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FRIENDS_REQUEST_DECLINE_REQUEST:
            return { loading: true };

        case USER_FRIENDS_REQUEST_DECLINE_SUCCESS:
            return { loading: false, success: true };

        case USER_FRIENDS_REQUEST_DECLINE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case USER_FRIENDS_REQUEST_DECLINE_RESET:
            return {};

        default:
            return state;
    }
};

export const userFriendRequestAcceptReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FRIENDS_REQUEST_ACCEPT_REQUEST:
            return { loading: true };

        case USER_FRIENDS_REQUEST_ACCEPT_SUCCESS:
            return { loading: false, success: true };

        case USER_FRIENDS_REQUEST_ACCEPT_FAIL:
            return { loading: false, error: action.payload, success: false };

        case USER_FRIENDS_REQUEST_ACCEPT_RESET:
            return {};

        default:
            return state;
    }
};

export const usersGroupsTotalDebtCreditReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_GROUP_CREDIT_DEBT_REQUEST:
            return { loading: true };

        case USER_GROUP_CREDIT_DEBT_SUCCESS:
            return {
                loading: false,
                userGroupsTotalCreditDebit: action.payload,
            };

        case USER_GROUP_CREDIT_DEBT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userCreditsReducer = (state = { userCredit: [] }, action) => {
    switch (action.type) {
        case USER_CREDIT_REQUEST:
            return { loading: true, userCredit: [] };

        case USER_CREDIT_SUCCESS:
            return { loading: false, userCredit: action.payload };

        case USER_CREDIT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userDebtsReducer = (state = { userDebt: [] }, action) => {
    switch (action.type) {
        case USER_DEBT_REQUEST:
            return { loading: true, userDebt: [] };

        case USER_DEBT_SUCCESS:
            return { loading: false, userDebt: action.payload };

        case USER_DEBT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userFriendNotMemberGroupSearchReducer = (
    state = { userFriendNotMemberGroupSearchResults: [] },
    action
) => {
    switch (action.type) {
        case USER_FRIEND_NOT_MEMBER_GROUP_SEARCH_REQUEST:
            return { loading: true, userFriendNotMemberGroupSearchResults: [] };

        case USER_FRIEND_NOT_MEMBER_GROUP_SEARCH_SUCCESS:
            return {
                loading: false,
                userFriendNotMemberGroupSearchResults: action.payload,
            };

        case USER_FRIEND_NOT_MEMBER_GROUP_SEARCH_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_UPDATE_REQUEST:
            return { loading: true };

        case USER_PROFILE_UPDATE_SUCCESS:
            return { loading: false, success: true };

        case USER_PROFILE_UPDATE_FAIL:
            return { loading: false, error: action.payload, success: false };

        case USER_PROFILE_UPDATE_RESET:
            return {};

        default:
            return state;
    }
};
