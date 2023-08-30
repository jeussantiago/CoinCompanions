import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";

import "../styles/screens/FriendsScreen.css";
import Message from "../components/Message";
import { getUsersFriends } from "../actions/userActions";
/**
 * Pending Friend Request
 *      if there is a pending friend request, then a red dot appears on the sidebar
 *
 * mid: 2 boxes
 * left box is who owes you in green
 * right box are the people who owe you in red
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
    const dispatch = useDispatch();

    const userFriendsList = useSelector((state) => state.userFriendsList);
    const { error, loading, userFriends } = userFriendsList;

    useEffect(() => {
        dispatch(getUsersFriends());
    }, [dispatch]);

    return (
        <div className="screen-container">
            <h1>Friends List</h1>
            <div className="friend-list-container">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <div>
                        <Row>
                            {userFriends.map((friend) => (
                                <Col
                                    key={friend.id}
                                    sm={6}
                                    md={4}
                                    lr={4}
                                    xl={3}
                                    className="friend-list-friend-box-container"
                                >
                                    <div className="friend-list-friend-box">
                                        <div className="d-flex flex-row justify-content-between bd-highlight mb-3">
                                            <div className="p-2 bd-highlight">
                                                {friend.name} ({friend.email})
                                            </div>
                                            <div className="p-2 bd-highlight">
                                                dots
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FriendsScreen;
