import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import AlertMessage from "../AlertMessage";
import { sendGroupInvite } from "../../actions/groupActions";
import { GROUP_INVITE_SEND_RESET } from "../../constants/groupConstants";
import Message from "../Message";
import {
    deleteFriend,
    getUserFriendNotMemberGroupSearch,
} from "../../actions/userActions";

function FriendOptionsPopup({ show, onClose, selectedFriend }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");

    const userFriendNotMemberGroupSearch = useSelector(
        (state) => state.userFriendNotMemberGroupSearch
    );
    const {
        error: notMemberError,
        loading: notMemberLoading,
        userFriendNotMemberGroupSearchResults,
    } = userFriendNotMemberGroupSearch;

    const groupInviteSend = useSelector((state) => state.groupInviteSend);
    const { success: groupInviteSendSuccess } = groupInviteSend;

    const handleDeleteFriend = (id) => {
        dispatch(deleteFriend(id));
        onClose();
    };

    const handleAddToGroup = (groupId) => {
        dispatch(sendGroupInvite(groupId, selectedFriend.id));
    };

    const handleShowAlert = useCallback((message, variant) => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, []);

    useEffect(() => {
        if (groupInviteSendSuccess) {
            handleShowAlert("Sent user group invite", "success");
            dispatch({ type: GROUP_INVITE_SEND_RESET });
        } else if (groupInviteSendSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to send user group invite",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, groupInviteSendSuccess]);

    useEffect(() => {
        if (selectedFriend) {
            dispatch(getUserFriendNotMemberGroupSearch(selectedFriend.id));
        }
    }, [dispatch, selectedFriend, groupInviteSendSuccess]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title className="w-100">
                    <div className="d-flex flex-row justify-content-between">
                        <div>{selectedFriend.name.toUpperCase()}</div>
                        <div>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    handleDeleteFriend(selectedFriend.id)
                                }
                                className="mx-1"
                            >
                                Delete Friend
                            </Button>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {notMemberLoading ? (
                    <div>Loading...</div>
                ) : notMemberError ? (
                    <Message variant="danger">{notMemberError}</Message>
                ) : userFriendNotMemberGroupSearchResults.length === 0 ? (
                    <div>No Groups to add</div>
                ) : (
                    userFriendNotMemberGroupSearchResults.map((group) => (
                        <div
                            key={group.id}
                            className="d-flex justify-content-between align-items-center mb-2"
                        >
                            <span>{group.name}</span>
                            <Button
                                variant="primary"
                                onClick={() => handleAddToGroup(group.id)}
                                className="mx-1"
                            >
                                Invite to Group
                            </Button>
                        </div>
                    ))
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </Modal>
    );
}

export default FriendOptionsPopup;
