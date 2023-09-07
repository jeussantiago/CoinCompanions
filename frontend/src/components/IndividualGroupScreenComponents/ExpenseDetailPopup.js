import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Row, Col, FormControl, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../../styles/screens/GroupsScreens.css";
import AlertMessage from "../AlertMessage";
import { updateGroupExpense } from "../../actions/groupActions";
import { deleteGroupExpense } from "../../actions/groupActions";

function ExpenseDetailPopup({ show, onClose, expense, handleExpenseUpdate }) {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedAmountPaid, setUpdatedAmountPaid] = useState(0);
    const [userAmounts, setUserAmounts] = useState({});
    const [isEvenlySplit, setIsEvenlySplit] = useState(expense.isEvenlySplit);

    const groupExpenseDetailUpdate = useSelector(
        (state) => state.groupExpenseDetailUpdate
    );
    const { success: groupExpenseDetailUpdateSuccess } =
        groupExpenseDetailUpdate;

    const groupExpenseDelete = useSelector((state) => state.groupExpenseDelete);
    const { success: groupExpenseDeleteSuccess } = groupExpenseDelete;

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
            setUpdatedAmountPaid(0); // You can set it to an empty string or some other default value.
            mostRecentAmount = 0;
        }

        if (isEvenlySplit) {
            evenlySplitAmount(mostRecentAmount);
        }
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
                isEvenlySplit: isEvenlySplit,
            };

            dispatch(
                updateGroupExpense(expense.group, expense.id, updatedData)
            );
            handleClose();
        }
    };

    const handleDelete = () => {
        dispatch(deleteGroupExpense(expense.group, expense.id));
        handleClose();
    };

    const handleClose = () => {
        // dispatch({ type: GROUP_EXPENSES_DETAILS_UPDATE_RESET });
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
        if (groupExpenseDetailUpdateSuccess) {
            // tells ExpenseList.js to update the list
            handleExpenseUpdate();
            handleShowAlert("Successfully updated expense", "success");
        } else if (groupExpenseDetailUpdateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to update expense",
                "danger"
            );
        }
    }, [groupExpenseDetailUpdateSuccess, handleShowAlert, handleExpenseUpdate]);

    useEffect(() => {
        if (groupExpenseDeleteSuccess) {
            // tells ExpenseList.js to update the list
            handleExpenseUpdate();
            handleShowAlert("Successfully deleted expense", "success");
        } else if (groupExpenseDeleteSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to deleted expense",
                "danger"
            );
        }
    }, [groupExpenseDeleteSuccess, handleShowAlert, handleExpenseUpdate]);

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
            setIsEvenlySplit(expense.isEvenlySplit);
        }
    }, [expense]);

    if (!expense) {
        return null;
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
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
                                <h6 className="my-0 me-2">Amount Paid</h6>
                                <FormControl
                                    type="number"
                                    value={updatedAmountPaid}
                                    onChange={handleAmountPaidChange}
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
                                {expense.expense_details.map((detail) => (
                                    <div key={detail.user.id}>
                                        <div
                                            className={`detail d-flex flex-row align-items-center my-2`}
                                        >
                                            <strong>{detail.user.name}</strong>
                                            's&nbsp;split&nbsp;is&nbsp;$
                                            <FormControl
                                                type="number"
                                                value={
                                                    userAmounts[
                                                        detail.user.id
                                                    ] || detail.amount_owed
                                                }
                                                onChange={(e) =>
                                                    handleUserAmountChange(
                                                        detail.user.id,
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
                    <div className="w-100 d-flex flex-row justify-content-between ">
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                        <div>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                className="me-1"
                            >
                                Save Changes
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </div>
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
