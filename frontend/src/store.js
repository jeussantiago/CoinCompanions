import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import {
    userLoginReducer,
    userRegisterReducer,
    userFriendsListReducer,
    userFriendSearchReducer,
    userFriendDeleteReducer,
} from "./reducers/userReducers";

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userFriendsList: userFriendsListReducer,
    userFriendSearch: userFriendSearchReducer,
    userFriendDelete: userFriendDeleteReducer,
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
