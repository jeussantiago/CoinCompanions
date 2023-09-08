import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Row, Col, Button, Pagination } from "react-bootstrap";

import "../../styles/screens/GroupsScreens.css";
import Message from "../Message";
import AlertMessage from "../AlertMessage";
import { getGroupExpenses } from "../../actions/groupActions";
import ExpenseDetailPopup from "./ExpenseDetailPopup";
import CreateExpensePopup from "./CreateExpensePopup";
import {
    GROUP_EXPENSES_CREATE_RESET,
    GROUP_EXPENSES_DELETE_RESET,
    GROUP_SETTLE_CREATE_RESET,
    GROUP_EXPENSES_DETAILS_UPDATE_RESET,
} from "../../constants/groupConstants";

function ExpenseList({ groupDetails }) {
    // group id
    const { id } = useParams();
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");

    const groupExpenses = useSelector((state) => state.groupExpenses);
    const {
        error: groupExpensesError,
        loading: groupExpensesLoading,
        groupExpensesList,
    } = groupExpenses;

    // State variables for infinite scrolling
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // State to manage the visibility of the ExpenseDetailPopup
    const [showExpenseDetail, setShowExpenseDetail] = useState(false);
    // State to store the currently expanded expense
    const [expandedExpense, setExpandedExpense] = useState(null);
    // State to store the create expense popup
    const [showCreateExpensePopup, setShowCreateExpensePopup] = useState(null);

    // settle expenses
    const groupSettleCreate = useSelector((state) => state.groupSettleCreate);
    const { success: groupSettleCreateSuccess } = groupSettleCreate;
    // expense update
    const groupExpenseDetailUpdate = useSelector(
        (state) => state.groupExpenseDetailUpdate
    );
    const { success: groupExpenseDetailUpdateSuccess } =
        groupExpenseDetailUpdate;
    // expense delete
    const groupExpenseDelete = useSelector((state) => state.groupExpenseDelete);
    const { success: groupExpenseDeleteSuccess } = groupExpenseDelete;
    // group expense created
    const groupExpenseCreate = useSelector((state) => state.groupExpenseCreate);
    const { success: groupExpenseCreateSuccess } = groupExpenseCreate;

    // Function to toggle the visibility of the ExpenseDetailPopup
    const openExpensePopup = (expense) => {
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
    };

    const closeCreateExpensePopup = () => {
        setShowCreateExpensePopup(false);
    };

    const updatePage = (nextPage) => {
        setCurrentPage(nextPage);
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
        if (groupSettleCreateSuccess) {
            handleShowAlert("Successfully settled with user", "success");
            dispatch({ type: GROUP_SETTLE_CREATE_RESET });
        } else if (groupSettleCreateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to settled with user",
                "danger"
            );
        }
    }, [groupSettleCreateSuccess, handleShowAlert, dispatch]);

    // added Group expense
    useEffect(() => {
        if (groupExpenseCreateSuccess) {
            handleShowAlert("Successfully created expense", "success");
            dispatch({ type: GROUP_EXPENSES_CREATE_RESET });
        } else if (groupExpenseCreateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to create success",
                "danger"
            );
        }
    }, [handleShowAlert, dispatch, groupExpenseCreateSuccess]);

    //expense update
    useEffect(() => {
        if (groupExpenseDetailUpdateSuccess) {
            handleShowAlert("Successfully updated expense", "success");
            dispatch({ type: GROUP_EXPENSES_DETAILS_UPDATE_RESET });
        } else if (groupExpenseDetailUpdateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to update expense",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, groupExpenseDetailUpdateSuccess]);

    // delete group expense
    useEffect(() => {
        if (groupExpenseDeleteSuccess) {
            handleShowAlert("Successfully deleted expense", "success");
            dispatch({ type: GROUP_EXPENSES_DELETE_RESET });
        } else if (groupExpenseDeleteSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to deleted expense",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, groupExpenseDeleteSuccess]);

    useEffect(() => {
        dispatch(getGroupExpenses(id, currentPage, itemsPerPage));
    }, [
        dispatch,
        id,
        currentPage,
        itemsPerPage,
        groupSettleCreateSuccess,
        groupExpenseCreateSuccess,
        groupExpenseDetailUpdateSuccess,
        groupExpenseDeleteSuccess,
    ]);

    return (
        <div className="expense-list">
            <Row>
                <Button onClick={openCreateExpensePopup}>Add Expense</Button>
            </Row>

            {groupExpensesLoading ? (
                <div>Loading...</div>
            ) : groupExpensesError ? (
                <Message variant="danger">{groupExpensesError}</Message>
            ) : groupExpensesList &&
              groupExpensesList.expenses &&
              groupExpensesList.expenses.length === 0 ? (
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
                    {groupExpensesList &&
                        groupExpensesList.expenses &&
                        groupExpensesList.expenses.map((expense) => (
                            <div key={expense.id} className="expense-row">
                                <Row
                                    onClick={() => openExpensePopup(expense)}
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
                    <Pagination className="justify-content-center mt-2">
                        {[...Array(groupExpensesList.pages).keys()].map((i) => (
                            <div
                                onClick={() => updatePage(i + 1)}
                                key={i + 1}
                                className="mx-1"
                            >
                                <Pagination.Item
                                    active={i + 1 === groupExpensesList.page}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            </div>
                        ))}
                    </Pagination>

                    {expandedExpense && (
                        <ExpenseDetailPopup
                            show={showExpenseDetail}
                            onClose={closeExpensePopup}
                            expense={expandedExpense}
                        />
                    )}
                </div>
            )}
            <CreateExpensePopup
                show={showCreateExpensePopup}
                onClose={closeCreateExpensePopup}
                groupDetails={groupDetails}
            />
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </div>
    );
}

export default ExpenseList;
