import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import AlertMessage from "../AlertMessage";
import { GROUP_CREATE_RESET } from "../../constants/groupConstants";
import { createGroup } from "../../actions/groupActions";

function CreateGroupPopup({ show, onClose }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");

    const [form, setForm] = useState({
        title: "",
    });

    const groupCreate = useSelector((state) => state.groupCreate);
    const { success: groupCreateSuccess } = groupCreate;

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
        dispatch({ type: GROUP_CREATE_RESET });
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
        if (groupCreateSuccess) {
            handleShowAlert("Created new group", "success");
        } else if (groupCreateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to create a new group",
                "danger"
            );
        }
    }, [groupCreateSuccess, handleShowAlert]);

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
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </div>
    );
}

export default CreateGroupPopup;
