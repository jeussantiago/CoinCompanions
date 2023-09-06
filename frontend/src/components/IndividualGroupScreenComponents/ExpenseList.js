import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Row, Col, Button } from "react-bootstrap";

import "../../styles/screens/GroupsScreens.css";
import Message from "../Message";
import AlertMessage from "../AlertMessage";
import { getGroupExpenses } from "../../actions/groupActions";
import ExpenseDetailPopup from "./ExpenseDetailPopup";
import CreateExpensePopup from "./CreateExpensePopup";

function ExpenseList({ groupDetails }) {
    // group id
    const { id } = useParams();
    const dispatch = useDispatch();

    const groupExpenses = useSelector((state) => state.groupExpenses);
    const {
        error: groupExpensesError,
        loading: groupExpensesLoading,
        groupExpensesList,
    } = groupExpenses;

    // State to manage the visibility of the ExpenseDetailPopup
    const [showExpenseDetail, setShowExpenseDetail] = useState(false);
    // State to store the currently expanded expense
    const [expandedExpense, setExpandedExpense] = useState(null);
    // State to store the create expense popup
    const [showCreateExpensePopup, setShowCreateExpensePopup] = useState(null);
    // handle popup closing
    const [didExpenseUpdate, setDidExpenseUpdate] = useState(false);

    // Function to toggle the visibility of the ExpenseDetailPopup
    const toggleExpensePopup = (expense) => {
        if (expense.isTypeSettle === false) {
            setExpandedExpense(expense);
            setShowExpenseDetail(true); // Show the popup when an expense is clicked
        }
    };

    const openCreateExpensePopup = () => {
        setShowCreateExpensePopup(true);
    };

    // Function to close the ExpenseDetailPopup
    const closeExpensePopup = () => {
        setShowExpenseDetail(false);
        setDidExpenseUpdate(false);
    };

    const closeCreateExpensePopup = () => {
        setShowCreateExpensePopup(false);
        setDidExpenseUpdate(false);
    };

    const handleExpenseUpdate = () => {
        setDidExpenseUpdate(true);
    };

    useEffect(() => {
        dispatch(getGroupExpenses(id));
    }, [dispatch, id, didExpenseUpdate]);

    return (
        <div className="expense-list">
            <Row>
                <Button onClick={openCreateExpensePopup}>Add Expense</Button>
            </Row>

            {groupExpensesLoading ? (
                <div>Loading...</div>
            ) : groupExpensesError ? (
                <Message variant="danger">{groupExpensesError}</Message>
            ) : groupExpensesList.length === 0 ? (
                <p>No expenses</p>
            ) : (
                <div className="">
                    <Row className="d-flex flex-row justify-content-center py-3">
                        <Col
                            xs={2}
                            sm={2}
                            md={1}
                            className="expense-list-col d-flex flex-row align-items-center justify-content-center"
                        >
                            Type
                        </Col>
                        <Col
                            xs={2}
                            sm={2}
                            md={1}
                            className="expense-list-col d-flex flex-row align-items-center"
                        >
                            <span>Payer</span>
                        </Col>
                        <Col
                            xs={3}
                            sm={4}
                            md={5}
                            className="expense-list-col d-flex flex-row align-items-center"
                        >
                            <span>Description</span>
                        </Col>
                        <Col
                            xs={2}
                            sm={2}
                            md={2}
                            className="expense-list-col d-flex flex-row align-items-center "
                        >
                            <span>Amount</span>
                        </Col>
                        <Col
                            xs={3}
                            sm={1}
                            md={2}
                            className="expense-list-col d-flex flex-row align-items-center "
                        >
                            <span>Date</span>
                        </Col>
                        <Col
                            xs={4}
                            sm={1}
                            md={1}
                            className="expense-list-col d-flex flex-row align-items-center justify-content-center py-2"
                        >
                            <div></div>
                        </Col>
                    </Row>
                    {groupExpensesList.map((expense) => (
                        <div key={expense.id} className="expense-row">
                            <Row
                                onClick={() => toggleExpensePopup(expense)}
                                style={{
                                    cursor: expense.isTypeSettle
                                        ? "default"
                                        : "pointer",
                                }}
                                className="d-flex flex-row justify-content-center p-0 border-top border-primary py-2"
                            >
                                <Col
                                    xs={2}
                                    sm={2}
                                    md={1}
                                    className="expense-list-col d-flex flex-row align-items-center justify-content-center"
                                >
                                    {expense.isTypeSettle ? (
                                        <Badge pill bg="secondary">
                                            Settle
                                        </Badge>
                                    ) : (
                                        <Badge pill bg="primary">
                                            Expense
                                        </Badge>
                                    )}
                                </Col>
                                <Col
                                    xs={2}
                                    sm={2}
                                    md={1}
                                    className="expense-list-col d-flex flex-row align-items-center"
                                >
                                    <span>{expense.payer.name}</span>
                                </Col>
                                <Col
                                    xs={3}
                                    sm={4}
                                    md={5}
                                    className="expense-list-col d-flex flex-row align-items-center"
                                >
                                    <span>{expense.description}</span>
                                </Col>
                                <Col
                                    xs={2}
                                    sm={2}
                                    md={2}
                                    className="expense-list-col d-flex flex-row align-items-center "
                                >
                                    <span>${expense.amount}</span>
                                </Col>
                                <Col
                                    xs={3}
                                    sm={1}
                                    md={2}
                                    className="expense-list-col d-flex flex-row align-items-center "
                                >
                                    <span>
                                        {new Date(
                                            expense.date
                                        ).toLocaleDateString()}
                                    </span>
                                </Col>
                                <Col
                                    xs={4}
                                    sm={1}
                                    md={1}
                                    className="expense-list-col d-flex flex-row align-items-center justify-content-center py-2"
                                >
                                    {expense.isTypeSettle ? (
                                        <div></div>
                                    ) : (
                                        <i className="fa-solid fa-angles-down"></i>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    ))}
                    {expandedExpense && (
                        <ExpenseDetailPopup
                            show={showExpenseDetail}
                            onClose={closeExpensePopup}
                            expense={expandedExpense}
                            handleExpenseUpdate={handleExpenseUpdate}
                        />
                    )}
                </div>
            )}
            <CreateExpensePopup
                show={showCreateExpensePopup}
                onClose={closeCreateExpensePopup}
                handleExpenseUpdate={handleExpenseUpdate}
                groupDetails={groupDetails}
            />
        </div>
    );
}

export default ExpenseList;
