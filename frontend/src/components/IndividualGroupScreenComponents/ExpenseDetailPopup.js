import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Row, Col, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../../styles/screens/GroupsScreens.css";
import AlertMessage from "../AlertMessage";
import { updateGroupExpense } from "../../actions/groupActions";

function ExpenseDetailPopup({ show, onClose, expense, handleExpenseUpdate }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedAmountPaid, setUpdatedAmountPaid] = useState(0);
    const [userAmounts, setUserAmounts] = useState({});

    const groupExpenseDetailUpdate = useSelector(
        (state) => state.groupExpenseDetailUpdate
    );
    const { success: groupExpenseDetailUpdateSuccess } =
        groupExpenseDetailUpdate;

    // Function to handle changes in user amount inputs
    const handleUserAmountChange = (userId, amount) => {
        setUserAmounts((prevAmounts) => ({
            ...prevAmounts,
            [userId]: amount,
        }));
    };

    // Function to submit the updated data
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
            };

            dispatch(
                updateGroupExpense(expense.group, expense.id, updatedData)
            );
            onClose();
        }
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
        if (groupExpenseDetailUpdateSuccess) {
            // tells ExpenseList.js to update the list
            handleExpenseUpdate();
            handleShowAlert("Successfully updated expense", "success");
        } else if (groupExpenseDetailUpdateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to update success",
                "danger"
            );
        }
    }, [groupExpenseDetailUpdateSuccess, handleShowAlert, handleExpenseUpdate]);

    // Initialize userAmounts when the expense prop changes
    useEffect(() => {
        if (expense) {
            // Initialize userAmounts with the initial data
            const initialUserAmounts = {};
            expense.expense_details.forEach((detail) => {
                initialUserAmounts[detail.user.id] = detail.amount_owed;
            });
            setUserAmounts(initialUserAmounts);

            // Initialize other state variables as needed
            setUpdatedDescription(expense.description);
            setUpdatedAmountPaid(expense.amount);
        }
    }, [expense]);

    if (!expense) {
        return null;
    }

    return (
        <div>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Body>
                    <Row className="expense-detail-popout py-3">
                        <Col className="left-col">
                            <h5>Expense Details</h5>
                            <div className="d-flex flex-row">
                                <h6 className="d-flex align-items-center my-0 me-2">
                                    Payer:
                                </h6>

                                <p className="p-0 m-0">{expense.payer.name}</p>
                            </div>
                            <div className="d-flex flex-row">
                                <h6 className="my-0 me-2">Amount Paid:</h6>
                                <FormControl
                                    type="number"
                                    value={updatedAmountPaid}
                                    onChange={(e) => {
                                        setUpdatedAmountPaid(e.target.value);
                                    }}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            </div>
                            <div className="d-flex flex-row">
                                <h6 className="d-flex align-items-center my-0 me-2">
                                    Date:
                                </h6>

                                <p className="p-0 m-0">{expense.date}</p>
                            </div>
                            <div className="d-flex flex-column">
                                <h6 className="mb-2">Description:</h6>
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
                        <Col className="right-col border-primary ">
                            <h5>Expense Distribution</h5>
                            {expense.expense_details.map((detail) => (
                                <div key={detail.user.id}>
                                    <div className="detail d-flex flex-row align-items-center my-2">
                                        <strong>{detail.user.name}</strong>
                                        's&nbsp;split&nbsp;is&nbsp;$
                                        <FormControl
                                            type="number"
                                            value={
                                                userAmounts[detail.user.id] ||
                                                detail.amount_owed
                                            }
                                            onChange={(e) =>
                                                handleUserAmountChange(
                                                    detail.user.id,
                                                    e.target.value
                                                )
                                            }
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
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
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </div>
    );
}

export default ExpenseDetailPopup;
