import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, FormControl, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
    getGroupUserSearchToInvite,
    sendGroupInvite,
} from "../../actions/groupActions";
import { GROUP_INVITE_SEND_RESET } from "../../constants/groupConstants";
import AlertMessage from "../AlertMessage";

function InviteUsersPopup({ show, onClose, groupId }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // search users by keyword
    const groupUserSearchToInvite = useSelector(
        (state) => state.groupUserSearchToInvite
    );
    const { userFriendNotMemberGroupSearchResults: searchResults } =
        groupUserSearchToInvite;

    // invite sent to user
    const groupInviteSend = useSelector((state) => state.groupInviteSend);
    const { success: groupInviteSendSuccess } = groupInviteSend;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClose = () => {
        setSearchTerm("");
        onClose();
    };

    const handleInviteToGroup = (userInviteId) => {
        dispatch(sendGroupInvite(groupId, userInviteId));
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
        dispatch(getGroupUserSearchToInvite(groupId, searchTerm));
    }, [dispatch, groupId, searchTerm, groupInviteSendSuccess]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Search Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-3"
                />
                <ListGroup className="search-results-container">
                    {searchResults &&
                        searchResults.map((user) => (
                            <ListGroup.Item key={user.id}>
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="d-flex align-items-center">
                                        {user.email}
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleInviteToGroup(user.id)
                                        }
                                    >
                                        Invite to group
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </Modal>
    );
}

export default InviteUsersPopup;
