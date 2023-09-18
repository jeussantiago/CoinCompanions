import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addNewUserToGroupExpenses } from "../../actions/groupActions";

function NewUserInGroupPopup({ show, onClose, groupId }) {
    const dispatch = useDispatch();

    const handleAddToExpenses = () => {
        dispatch(addNewUserToGroupExpenses(groupId, true));
        onClose();
    };

    const handleDontAddToExpenses = () => {
        dispatch(addNewUserToGroupExpenses(groupId, false));
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Welcome to the Group!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Expenses might already be present in the group that you
                    joined. Some expenses may be set manually to specify how
                    much each user owes. However, some expenses are noted to be
                    evenly split between members. Do you want to be added to the
                    expenses that are set as evenly split?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAddToExpenses}>
                    Yes, add me
                </Button>
                <Button variant="secondary" onClick={handleDontAddToExpenses}>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NewUserInGroupPopup;
