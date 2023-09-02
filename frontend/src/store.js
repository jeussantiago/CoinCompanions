import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import {
    userLoginReducer,
    userRegisterReducer,
    userFriendsListReducer,
    userFriendSearchReducer,
    userFriendDeleteReducer,
    userFriendRequestListReducer,
    userGroupRequestListReducer,
    userFriendRequestDeclineReducer,
    userFriendRequestAcceptReducer,
} from "./reducers/userReducers";
import {
    groupInviteDeclineReducer,
    groupCreateReducer,
    groupListsReducer,
} from "./reducers/groupReducers";

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userFriendsList: userFriendsListReducer,
    userFriendSearch: userFriendSearchReducer,
    userFriendDelete: userFriendDeleteReducer,
    userFriendRequestList: userFriendRequestListReducer,
    userGroupRequestList: userGroupRequestListReducer,
    userFriendRequestDecline: userFriendRequestDeclineReducer,
    userFriendRequestAccept: userFriendRequestAcceptReducer,

    groupInviteDecline: groupInviteDeclineReducer,
    groupCreate: groupCreateReducer,
    groupLists: groupListsReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
