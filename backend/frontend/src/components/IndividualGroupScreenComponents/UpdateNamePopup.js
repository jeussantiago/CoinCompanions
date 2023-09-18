import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { updateGroupName } from "../../actions/groupActions";

function UpdateNamePopup({ show, onClose, currentGroupName, groupId }) {
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState(currentGroupName);

    const handleClose = () => {
        setGroupName(currentGroupName);
        onClose();
    };

    const handleSubmit = () => {
        dispatch(updateGroupName(groupId, groupName));
        handleClose();
    };

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
        </div>
    );
}

export default UpdateNamePopup;
