import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { createGroupSettle } from "../../actions/groupActions";

function SettlePopup({ groupId, receivingUser, show, handleClose }) {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const handleSubmit = () => {
        dispatch(createGroupSettle(groupId, receivingUser.id, amount));
        handleClose(); // Close the modal
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Settle Debt</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-4">
                    <h3>
                        {userInfo.name}{" "}
                        <i className="fa-solid fa-angles-right"></i>{" "}
                        {receivingUser.name}
                    </h3>
                </div>
                <Form.Group controlId="formAmount">
                    <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <div className="w-100 d-flex flex-row justify-content-between">
                    <Button variant="primary" onClick={handleSubmit}>
                        Settle
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default SettlePopup;
