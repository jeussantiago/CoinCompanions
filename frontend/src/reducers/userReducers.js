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
    USER_FRIENDS_LIST_FAIL
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

export const userFriendsListReduces = (state = { userFriends: [] }, action) => {
    switch (action.type) {
        case USER_FRIENDS_LIST_REQUEST:
            return { loading: true, userFriends: [] };

        case USER_FRIENDS_LIST_SUCCESS:
            return { loading: false, userFriends: action.payload };

        case USER_FRIENDS_LIST_FAIL:
            return { loading: false, error: action.payload };

        default: 
            return state
    }
}