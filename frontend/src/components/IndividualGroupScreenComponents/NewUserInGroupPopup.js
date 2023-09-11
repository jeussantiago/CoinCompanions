import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addNewUserToGroupExpenses } from "../../actions/groupActions";

/**
 * when you enter the individualGrup Screen, call api to check if user has an invitation to the group, with accepted=bool
 * not having one means false
 *
 * call api with action. call reducer.
 * if True, open popup modal
 *
 * modal calling api will delete the the invitation so shouldnt be an issue
 * if accept: pass into action group_id and True
 * if decline: pass into action group_id and False
 */

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
