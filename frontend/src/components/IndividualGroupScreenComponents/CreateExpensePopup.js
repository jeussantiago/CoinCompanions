import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Row, Col, FormControl, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../../styles/screens/GroupsScreens.css";
import AlertMessage from "../AlertMessage";
import { createGroupExpense } from "../../actions/groupActions";

//handleExpenseCreate,
function CreateExpensePopup({ show, onClose, groupDetails }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedAmountPaid, setUpdatedAmountPaid] = useState(0);
    const [userAmounts, setUserAmounts] = useState({});
    const [isEvenlySplit, setIsEvenlySplit] = useState(false);
    const members = groupDetails.members;

    const groupExpenseCreate = useSelector((state) => state.groupExpenseCreate);
    const { success: groupExpenseCreateSuccess } = groupExpenseCreate;

    // Function to handle changes in user amount inputs
    const handleUserAmountChange = (userId, amount) => {
        setUserAmounts((prevAmounts) => ({
            ...prevAmounts,
            [userId]: amount,
        }));
    };

    const evenlySplitAmount = (mostRecentUpdatedAmount) => {
        const numberOfUsers = Object.keys(userAmounts).length;
        var perUserAmount;
        if (mostRecentUpdatedAmount === 0) {
            perUserAmount = 0;
        } else {
            perUserAmount = mostRecentUpdatedAmount / numberOfUsers;
        }

        const evenlySplitUserAmounts = {};

        for (const userId in userAmounts) {
            evenlySplitUserAmounts[userId] = perUserAmount;
        }

        setUserAmounts(evenlySplitUserAmounts);
    };

    const handleIsEvenlySplitChange = (e) => {
        setIsEvenlySplit(e.target.checked);
        if (e.target.checked) {
            evenlySplitAmount(updatedAmountPaid);
        }
    };

    const handleAmountPaidChange = (e) => {
        const newValue = parseFloat(e.target.value);
        var mostRecentAmount;
        if (!isNaN(newValue)) {
            setUpdatedAmountPaid(newValue);
            mostRecentAmount = newValue;
        } else {
            setUpdatedAmountPaid(0);
            mostRecentAmount = 0;
        }

        if (isEvenlySplit) {
            evenlySplitAmount(mostRecentAmount);
        }
    };

    const handleSubmit = () => {
        // Calculate the total amount from userAmounts
        const totalAmount = Object.values(userAmounts).reduce(
            (total, amount) => total + parseFloat(amount || 0),
            0
        );

        // Check if the total amount is not equal to the expense amount
        if (
            parseFloat(totalAmount).toFixed(2) !==
            parseFloat(updatedAmountPaid).toFixed(2)
        ) {
            handleShowAlert(
                "Expense distribution doesn't add up to expense amount",
                "danger"
            );
        } else {
            // Create an array of expense_details based on userAmounts
            const expenseDetails = Object.keys(userAmounts).map((userId) => ({
                user: Number(userId),
                amount_owed: parseFloat(
                    parseFloat(userAmounts[userId]).toFixed(2)
                ),
            }));

            // Create the data object to be logged
            const updatedData = {
                description: updatedDescription,
                amount: parseFloat(parseFloat(updatedAmountPaid).toFixed(2)),
                expense_details: expenseDetails,
                isEvenlySplit: isEvenlySplit,
            };

            dispatch(createGroupExpense(groupDetails.id, updatedData));

            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
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
        // reset the values if a user creates an expense
        // Initialize userAmounts with initial data from members
        const initialUserAmounts = {};
        members.forEach((user) => {
            initialUserAmounts[user.id] = 0;
        });
        setUserAmounts(initialUserAmounts);
        setIsEvenlySplit(false);
        setUpdatedDescription("");
        setUpdatedAmountPaid(0);
    }, [members, groupExpenseCreateSuccess]);

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <Row className="expense-detail-popout py-3">
                        <Col className="left-col">
                            <h5>Expense Details</h5>
                            <div className="d-flex flex-row my-2">
                                <h6 className="my-0 me-2">Amount Paid</h6>
                                <FormControl
                                    type="number"
                                    value={updatedAmountPaid}
                                    onChange={handleAmountPaidChange}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            </div>
                            <div className="d-flex flex-column my-2">
                                <h6 className="my-2">Description:</h6>
                                <FormControl
                                    as="textarea"
                                    rows={4}
                                    value={updatedDescription}
                                    onChange={(e) => {
                                        setUpdatedDescription(e.target.value);
                                    }}
                                />
                            </div>
                        </Col>
                        <Col className="right-col border-primary">
                            <h5>Expense Distribution</h5>
                            <div className="d-flex flex-row align-items-center my-2">
                                <Form.Check
                                    type="checkbox"
                                    id="evenlySplitCheckbox"
                                    label="Evenly Split"
                                    checked={isEvenlySplit}
                                    onChange={handleIsEvenlySplitChange}
                                />
                            </div>
                            <div
                                className={`${isEvenlySplit ? "disabled" : ""}`}
                            >
                                {members.map((user) => (
                                    <div key={user.id}>
                                        <div
                                            className={`detail d-flex flex-row align-items-center my-2`}
                                        >
                                            <strong>{user.name}</strong>
                                            's&nbsp;split&nbsp;is&nbsp;$
                                            <FormControl
                                                type="number"
                                                value={userAmounts[user.id]}
                                                onChange={(e) =>
                                                    handleUserAmountChange(
                                                        user.id,
                                                        e.target.value
                                                    )
                                                }
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                disabled={isEvenlySplit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
                {showAlert && (
                    <AlertMessage
                        message={alertMessage}
                        variant={alertVariant}
                    />
                )}
            </Modal>
            {/* {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )} */}
        </div>
    );
}

export default CreateExpensePopup;
