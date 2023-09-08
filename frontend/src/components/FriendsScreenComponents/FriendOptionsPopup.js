import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { deleteFriend } from "../../actions/userActions";

function FriendOptionsPopup({ show, onClose, selectedFriend }) {
    const dispatch = useDispatch();

    const handleDeleteFriend = (id) => {
        dispatch(deleteFriend(id));
        onClose();
    };

    const handleAddToGroup = () => {
        console.log("add user to group");
        onClose();
    };

    if (!show || selectedFriend === null) {
        // If show is false or selectedFriend is null, return null or handle accordingly
        return null;
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{selectedFriend.name.toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button
                    variant="danger"
                    onClick={() => handleDeleteFriend(selectedFriend.id)}
                    className="mx-1"
                >
                    Delete Friend
                </Button>
                <Button
                    variant="primary"
                    onClick={() => handleAddToGroup()}
                    className="mx-1"
                >
                    Add to Group
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FriendOptionsPopup;
