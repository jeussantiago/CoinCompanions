import {
    GROUP_INVITE_DECLINE_REQUEST,
    GROUP_INVITE_DECLINE_SUCCESS,
    GROUP_INVITE_DECLINE_FAIL,
    GROUP_INVITE_DECLINE_RESET,
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
