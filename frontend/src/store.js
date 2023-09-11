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
    usersGroupsTotalDebtCreditReducer,
    userCreditsReducer,
    userDebtsReducer,
    userFriendNotMemberGroupSearchReducer,
} from "./reducers/userReducers";
import {
    groupInviteDeclineReducer,
    groupCreateReducer,
    groupListsReducer,
    groupDetailsReducer,
    groupNameUpdateReducer,
    groupExpensesReducer,
    groupExpenseDetailUpdateReducer,
    groupExpenseCreateReducer,
    groupExpenseDeleteReducer,
    groupCreditsReducer,
    groupDebtsReducer,
    groupSettleCreateReducer,
    groupInviteSendReducer,
    groupUserSearchToInviteReducer,
    groupInviteAcceptReducer,
    groupNewUserInvitationReducer,
    groupNewUserAddToExistingExpensesReducer,
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
    usersGroupsTotalDebtCredit: usersGroupsTotalDebtCreditReducer,
    userCredits: userCreditsReducer,
    userDebts: userDebtsReducer,
    userFriendNotMemberGroupSearch: userFriendNotMemberGroupSearchReducer,

    groupInviteDecline: groupInviteDeclineReducer,
    groupInviteAccept: groupInviteAcceptReducer,
    groupCreate: groupCreateReducer,
    groupLists: groupListsReducer,
    groupDetails: groupDetailsReducer,
    groupNameUpdate: groupNameUpdateReducer,
    groupExpenses: groupExpensesReducer,
    groupExpenseDetailUpdate: groupExpenseDetailUpdateReducer,
    groupExpenseCreate: groupExpenseCreateReducer,
    groupExpenseDelete: groupExpenseDeleteReducer,
    groupCredits: groupCreditsReducer,
    groupDebts: groupDebtsReducer,
    groupSettleCreate: groupSettleCreateReducer,
    groupInviteSend: groupInviteSendReducer,
    groupUserSearchToInvite: groupUserSearchToInviteReducer,
    groupNewUserInvitation: groupNewUserInvitationReducer,
    groupNewUserAddToExistingExpenses: groupNewUserAddToExistingExpensesReducer,
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
