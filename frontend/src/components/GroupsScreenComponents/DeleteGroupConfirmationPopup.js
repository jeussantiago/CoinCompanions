import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { deleteGroup } from "../../actions/groupActions";

function DeleteGroupConfirmationPopup({ show, onClose, groupName, groupId }) {
    const dispatch = useDispatch();

    const handleConfirmDelete = () => {
        dispatch(deleteGroup(groupId));
        onClose();
    };

    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header>
                    <Modal.Title>Delete Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="text-center mb-4">
                        Are you sure you want to delete "
                        <strong>{groupName}</strong>"?
                    </h5>
                    <div className="d-flex flex-row justify-content-between">
                        <Button variant="primary" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={() => onClose()}>
                            Cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DeleteGroupConfirmationPopup;
