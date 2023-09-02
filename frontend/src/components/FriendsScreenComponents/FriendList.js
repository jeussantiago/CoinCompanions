import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Button } from "react-bootstrap";

import "../../styles/screens/FriendsScreen.css";
import Message from "../Message";
import { getUsersFriends } from "../../actions/userActions";
import FriendOptionsPopup from "./FriendOptionsPopup";
import SearchFriendPopup from "./SearchFriendPopup";

function FriendList() {
    const dispatch = useDispatch();

    const [showSearchFriendsPopup, setShowSearchFriendsPopup] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [updateFriendsList, setupdateFriendsList] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [numFriendsToShow, setNumFriendsToShow] = useState(8);

    const userFriendsList = useSelector((state) => state.userFriendsList);
    const { error, loading, userFriends } = userFriendsList;

    const openSearchFriendPopup = () => {
        setShowSearchFriendsPopup(true);
    };

    const closeSearchFriendPopup = () => {
        setShowSearchFriendsPopup(false);
    };

    const openFriendOptions = (friend) => {
        setSelectedFriend(friend);
        setShowOptions(true);
    };

    // Functions to handle actions when options are clicked
    const closeFriendOptions = () => {
        setShowOptions(false);
    };

    const handleViewAll = () => {
        // Set the number of friends to show to the total number of friends
        setNumFriendsToShow(userFriends.length);
    };

    useEffect(() => {
        dispatch(getUsersFriends());
    }, [dispatch, updateFriendsList]);

    return (
        <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <h1>Friends List</h1>

                <div>
                    <Button onClick={openSearchFriendPopup}>Add friend</Button>
                </div>
            </div>
            <div className="friend-list-container">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <div>
                        <Row className="d-flex flex-row">
                            {userFriends
                                .slice(0, numFriendsToShow)
                                .map((friend) => (
                                    <Col
                                        key={friend.id}
                                        sm={6}
                                        md={4}
                                        lr={3}
                                        xl={3}
                                        className="friend-list-friend-box-container"
                                    >
                                        <div className="friend-list-friend-box rounded-pill mb-1">
                                            <div className="d-flex flex-row justify-content-between bd-highlight">
                                                <div className="friend-box-name d-flex align-items-center">
                                                    {friend.name}
                                                </div>
                                                <div className="friend-option-button-container d-flex align-items-center">
                                                    <div
                                                        onClick={() =>
                                                            openFriendOptions(
                                                                friend
                                                            )
                                                        }
                                                        className="friend-option-button"
                                                    >
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                        </Row>
                        <div className="d-flex flex-row justify-content-center">
                            {numFriendsToShow < userFriends.length && (
                                <div
                                    onClick={handleViewAll}
                                    className="view-all-button"
                                >
                                    View all
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <FriendOptionsPopup
                show={showOptions}
                onClose={() => setShowOptions(false)}
                onCloseFriendOptions={closeFriendOptions}
                selectedFriend={selectedFriend}
                onFriendsUpdate={() => setupdateFriendsList(!updateFriendsList)}
            />
            <SearchFriendPopup
                show={showSearchFriendsPopup}
                onClose={closeSearchFriendPopup}
            />
        </div>
    );
}

export default FriendList;
