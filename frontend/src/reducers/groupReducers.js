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
