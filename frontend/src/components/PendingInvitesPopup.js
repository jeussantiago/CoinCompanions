import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Tab, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../styles/screens/DashboardScreen.css";
import Message from "./Message";
import {
    getPendingFriendRequest,
    getPendingGroupRequest,
    deleteFriendRequest,
    acceptFriendRequest,
} from "../actions/userActions";
import { deleteGroupInvite } from "../actions/groupActions";
import {
    USER_FRIENDS_REQUEST_DECLINE_RESET,
    USER_FRIENDS_REQUEST_ACCEPT_RESET,
} from "../constants/userConstants";
import { GROUP_INVITE_DECLINE_RESET } from "../constants/groupConstants";
import AlertMessage from "./AlertMessage";

function PendingInvitesPopup({ show, onClose }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");

    const [activeTab, setActiveTab] = useState("pendingFriendRequests");

    // list of user's pending friend request
    const userFriendRequestList = useSelector(
        (state) => state.userFriendRequestList
    );
    const {
        error: friendRequestError,
        loading: friendRequestLoading,
        friendRequestList,
    } = userFriendRequestList;

    // list of user's pending group invites
    const userGroupRequestList = useSelector(
        (state) => state.userGroupRequestList
    );
    const {
        error: groupRequestError,
        loading: groupRequestLoading,
        groupRequestList,
    } = userGroupRequestList;

    const userFriendRequestDecline = useSelector(
        (state) => state.userFriendRequestDecline
    );
    const { success: userFriendRequestDeclineSuccess } =
        userFriendRequestDecline;

    const userFriendRequestAccept = useSelector(
        (state) => state.userFriendRequestAccept
    );
    const { success: userFriendRequestAcceptSuccess } = userFriendRequestAccept;

    const groupInviteDecline = useSelector((state) => state.groupInviteDecline);
    const { success: groupInviteDeclineSuccess } = groupInviteDecline;

    const switchTab = (tabName) => {
        setActiveTab(tabName);
    };

    const handleFriendRequestAccept = (id) => {
        dispatch(acceptFriendRequest(id));
    };

    const handleFriendRequestDecline = (id) => {
        dispatch(deleteFriendRequest(id));
    };

    const handleGroupRequestAccept = (id) => {
        // add user to group {id}
        console.log("accepting group invite: ", id);
    };

    const handleGroupRequestDecline = (id) => {
        dispatch(deleteGroupInvite(id));
    };

    const handleShowAlert = useCallback(
        (message, variant) => {
            setAlertMessage(message);
            setAlertVariant(variant);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                dispatch({ type: USER_FRIENDS_REQUEST_DECLINE_RESET });
                dispatch({ type: USER_FRIENDS_REQUEST_ACCEPT_RESET });
                dispatch({ type: GROUP_INVITE_DECLINE_RESET });
            }, 3000); // Hide the alert after 3 seconds
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(getPendingFriendRequest());
        dispatch(getPendingGroupRequest());
    }, [
        dispatch,
        userFriendRequestDeclineSuccess,
        userFriendRequestAcceptSuccess,
        groupInviteDeclineSuccess,
    ]);

    useEffect(() => {
        if (userFriendRequestDeclineSuccess) {
            handleShowAlert("Deleted user from friends list", "success");
        } else if (userFriendRequestDeclineSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to delete user from friends list",
                "danger"
            );
        }
    }, [userFriendRequestDeclineSuccess, handleShowAlert]);

    useEffect(() => {
        if (userFriendRequestAcceptSuccess) {
            handleShowAlert("Deleted user from friends list", "success");
        } else if (userFriendRequestAcceptSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to delete user from friends list",
                "danger"
            );
        }
    }, [userFriendRequestAcceptSuccess, handleShowAlert]);

    useEffect(() => {
        if (groupInviteDeclineSuccess) {
            handleShowAlert("Declined group invite", "success");
        } else if (groupInviteDeclineSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to delete group invite",
                "danger"
            );
        }
    }, [groupInviteDeclineSuccess, handleShowAlert]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Body className="pending-invites-popup">
                <Tab.Container id="pending-invites-tabs" activeKey={activeTab}>
                    <Nav variant="tabs" className="mb-3">
                        <Nav.Item>
                            <Nav.Link
                                eventKey="pendingFriendRequests"
                                onClick={() =>
                                    switchTab("pendingFriendRequests")
                                }
                            >
                                Pending Friend Requests
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                eventKey="pendingGroupRequests"
                                onClick={() =>
                                    switchTab("pendingGroupRequests")
                                }
                            >
                                Pending Group Requests
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="pendingFriendRequests">
                            <div className="scrollable-list">
                                {friendRequestLoading ? (
                                    <div>Loading...</div>
                                ) : friendRequestError ? (
                                    <Message variant="danger">
                                        {friendRequestError}
                                    </Message>
                                ) : friendRequestList.length === 0 ? (
                                    <p>No pending friend requests</p>
                                ) : (
                                    <ul className="list-group">
                                        {friendRequestList.map((request) => (
                                            <li
                                                key={request.id}
                                                className="list-group-item"
                                            >
                                                <div className="d-flex flex-row justify-content-between">
                                                    <span className="d-flex align-items-center">
                                                        {request.from_user.name}
                                                    </span>
                                                    <div>
                                                        <Button
                                                            variant="success"
                                                            className="mx-1"
                                                            onClick={() =>
                                                                handleFriendRequestAccept(
                                                                    request.id
                                                                )
                                                            }
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() =>
                                                                handleFriendRequestDecline(
                                                                    request.id
                                                                )
                                                            }
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="pendingGroupRequests">
                            <div className="scrollable-list">
                                {groupRequestLoading ? (
                                    <div>Loading...</div>
                                ) : groupRequestError ? (
                                    <Message variant="danger">
                                        {groupRequestError}
                                    </Message>
                                ) : groupRequestList.length === 0 ? (
                                    <p>No pending group requests</p>
                                ) : (
                                    <ul className="list-group">
                                        {groupRequestList.map((request) => (
                                            <li
                                                key={request.id}
                                                className="list-group-item"
                                            >
                                                <div className="d-flex flex-row justify-content-between">
                                                    <span className="d-flex align-items-center">
                                                        {request.group.name}
                                                    </span>
                                                    <div>
                                                        <Button
                                                            variant="success"
                                                            className="mx-1"
                                                            onClick={() =>
                                                                handleGroupRequestAccept(
                                                                    request.id
                                                                )
                                                            }
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() =>
                                                                handleGroupRequestDecline(
                                                                    request.id
                                                                )
                                                            }
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose}>Close</Button>
            </Modal.Footer>
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </Modal>
    );
}

export default PendingInvitesPopup;
