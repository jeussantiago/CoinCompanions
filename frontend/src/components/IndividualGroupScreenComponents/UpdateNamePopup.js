import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import AlertMessage from "../AlertMessage";
import { GROUP_NAME_UPDATE_RESET } from "../../constants/groupConstants";
import { updateGroupName } from "../../actions/groupActions";

function UpdateNamePopup({
    show,
    onClose,
    groupNameIsUpdated,
    currentGroupName,
    groupId,
}) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [groupName, setGroupName] = useState(currentGroupName);

    const groupNameUpdate = useSelector((state) => state.groupNameUpdate);
    const { success: groupNameUpdateSuccess } = groupNameUpdate;

    const handleClose = () => {
        setGroupName(currentGroupName);
        onClose();
        dispatch({ type: GROUP_NAME_UPDATE_RESET });
    };

    const handleSubmit = () => {
        dispatch(updateGroupName(groupId, groupName));
        groupNameIsUpdated();
        handleClose(); // Now handleClose is defined before use
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
        if (groupNameUpdateSuccess) {
            handleShowAlert("Updated group name", "success");
        } else if (groupNameUpdateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to update group name",
                "danger"
            );
        }
    }, [groupNameUpdateSuccess, handleShowAlert]);

    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header>
                    <Modal.Title>Edit Group Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        type="text"
                        placeholder="Enter new group name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </div>
    );
}

export default UpdateNamePopup;
