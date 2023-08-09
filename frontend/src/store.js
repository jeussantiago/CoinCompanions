import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import { userListReducer } from "./reducers/userReducers";

const reducer = combineReducers({
    userList: userListReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
