import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";

// import AlertMessage from "../AlertMessage";
// import { GROUP_CREATE_RESET } from "../../constants/groupConstants";
import { createGroup } from "../../actions/groupActions";

function CreateGroupPopup({ show, onClose }) {
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        title: "",
    });

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        dispatch(createGroup(form.title));
        closePopup();
    };

    const closePopup = () => {
        // Clear the title input
        setForm({
            ...form,
            title: "",
        });
        // Close the popup
        onClose();
    };

    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header>
                    <Modal.Title>Create New Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter group title"
                                name="title"
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex flex-row justify-content-between">
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => closePopup()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateGroupPopup;
