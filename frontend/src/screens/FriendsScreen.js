import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Col, Row, Button, Container } from "react-bootstrap";

import "../styles/screens/FriendsScreen.css";
// import Message from "../components/Message";
// import { getUsersFriends } from "../actions/userActions";
// import FriendOptionsPopup from "../components/FriendOptionsPopup";
import FriendList from "../components/FriendList";

/**
 * Pending Friend Request
 *      if there is a pending friend request, then a red dot appears on the sidebar
 *
 * mid: 2 boxes
 * left box is who owes you in green
 * right box are the people who owe you in red
 *
 * pending friend request
 *
 * list of friends: below spreads 100% width
 *
 * button at top to search for people to add as friends
 * - each person in search results will have the option to "send friend request" or "already friends"(unclickable)
 *
 * each friend has 3 dots
 * if you click the 3 dots, 2 options
 * a. delete friend => pop up will show if you want to confirm deleting friend
 * b. add friend to group => pop up will show what groups you are in  (on right side of pop up will be
 * "send invite" or "friend already part of group"(unclickable))
 *
 */

function FriendsScreen() {
    return (
        <div className="screen-container d-flex flex-column">
            {/* <div>who owes</div> */}
            <FriendList />
            {/* <div className="flex-grow-1">
            </div> */}
        </div>
    );
}

export default FriendsScreen;
