import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../../styles/screens/GroupsScreens.css";
import AlertMessage from "../AlertMessage";
import Message from "../Message";
import DeleteGroupConfirmationPopup from "./DeleteGroupConfirmationPopup";
import {
    GROUP_CREATE_RESET,
    GROUP_DELETE_RESET,
} from "../../constants/groupConstants";
import { getGroupsList } from "../../actions/groupActions";
import { getUsersGroupsTotalCreditDebit } from "../../actions/userActions";

function GroupsList() {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [showDeleteGroupConfirmation, setShowDeleteGroupConfirmation] =
        useState(false);
    const [seletectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const groupLists = useSelector((state) => state.groupLists);
    const {
        error: groupListError,
        loading: groupListLoading,
        groupList,
    } = groupLists;
    const usersGroupsTotalDebtCredit = useSelector(
        (state) => state.usersGroupsTotalDebtCredit
    );
    const {
        error: userGroupsTotalCreditDebitError,
        loading: userGroupsTotalCreditDebitLoading,
        userGroupsTotalCreditDebit,
    } = usersGroupsTotalDebtCredit;

    // created new group
    const groupCreate = useSelector((state) => state.groupCreate);
    const { success: groupCreateSuccess } = groupCreate;

    // delete group
    const groupDelete = useSelector((state) => state.groupDelete);
    const { success: groupDeleteSuccess } = groupDelete;

    const openDeletegroupConfirmationPopup = (groupId, groupName) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setShowDeleteGroupConfirmation(true);
    };

    const closeDeletegroupConfirmationPopup = () => {
        setShowDeleteGroupConfirmation(false);
        setSelectedGroupId(null);
        setSelectedGroupName(null);
    };

    const handleShowAlert = useCallback((message, variant) => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, []);

    // group create
    useEffect(() => {
        if (groupCreateSuccess) {
            handleShowAlert("Created new group", "success");
            dispatch({ type: GROUP_CREATE_RESET });
        } else if (groupCreateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to create a new group",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, groupCreateSuccess]);
    //group delete
    useEffect(() => {
        if (groupDeleteSuccess) {
            handleShowAlert("Deleted group", "success");
            dispatch({ type: GROUP_DELETE_RESET });
        } else if (groupDeleteSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to delete group",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, groupDeleteSuccess]);

    useEffect(() => {
        dispatch(getGroupsList());
        dispatch(getUsersGroupsTotalCreditDebit());
    }, [dispatch, groupCreateSuccess, groupDeleteSuccess]);

    return (
        <div>
            {groupListLoading || userGroupsTotalCreditDebitLoading ? (
                <div>Loading...</div>
            ) : groupListError ? (
                <Message variant="danger">{groupListError}</Message>
            ) : userGroupsTotalCreditDebitError ? (
                <Message variant="danger">
                    {userGroupsTotalCreditDebitError}
                </Message>
            ) : groupList.length === 0 ? (
                <p>No groups joined</p>
            ) : (
                <div>
                    {groupList.map((group) => (
                        <div className="group-container" key={group.id}>
                            <Link
                                to={`/groups/${group.id}`}
                                className="text-decoration-none"
                            >
                                <Card
                                    className="mb-3 pb-2"
                                    style={{ cursor: "pointer" }}
                                >
                                    <Card.Body>
                                        <div className="d-flex flex-row justify-content-between align-items-center ">
                                            <div>
                                                <h3 className="text-capitalize mb-3">
                                                    {group.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="card-body-most-recent-expense">
                                            <Row>
                                                <Col md={8} className="">
                                                    {group.most_recent_expense
                                                        .length === 0 ? (
                                                        <div className="mb-3">
                                                            No expenses yet
                                                        </div>
                                                    ) : (
                                                        <ul className="p-0">
                                                            <h6>
                                                                Most Recent
                                                                Transactions:
                                                            </h6>
                                                            {group.most_recent_expense.map(
                                                                (expense) => (
                                                                    <li
                                                                        key={
                                                                            expense.id
                                                                        }
                                                                        className="card-body-most-recent-expense-row"
                                                                    >
                                                                        <div className="list-wrapper">
                                                                            <div className="red-line"></div>

                                                                            <div className="list-item-wrapper">
                                                                                <div className="list-bullet"></div>
                                                                                <div className="list-item">
                                                                                    <div className="list-title">
                                                                                        <strong>
                                                                                            {
                                                                                                expense
                                                                                                    .payer
                                                                                                    .name
                                                                                            }{" "}
                                                                                        </strong>
                                                                                        added
                                                                                        an
                                                                                        expense
                                                                                        for{" "}
                                                                                        <strong>
                                                                                            $
                                                                                            {
                                                                                                expense.amount
                                                                                            }
                                                                                        </strong>
                                                                                    </div>
                                                                                    <div className="list-text">
                                                                                        description:{" "}
                                                                                        {
                                                                                            expense.description
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                </Col>
                                                {group.most_recent_expense
                                                    .length !== 0 ? (
                                                    <Col
                                                        md={4}
                                                        className="mt-0 mt-md-4"
                                                    >
                                                        <Row>
                                                            <Col
                                                                sm={6}
                                                                md={12}
                                                                className="text-primary mb-2"
                                                            >
                                                                <div className="owed-box border border-primary d-flex flex-column justify-content-between px-2 py-1">
                                                                    <h6>
                                                                        You are
                                                                        owed
                                                                        this
                                                                        much:
                                                                    </h6>
                                                                    <div>
                                                                        <strong>
                                                                            ${" "}
                                                                            {userGroupsTotalCreditDebit[
                                                                                group
                                                                                    .id
                                                                            ] &&
                                                                            userGroupsTotalCreditDebit[
                                                                                group
                                                                                    .id
                                                                            ]
                                                                                .total_credit
                                                                                ? userGroupsTotalCreditDebit[
                                                                                      group
                                                                                          .id
                                                                                  ].total_credit.toFixed(
                                                                                      2
                                                                                  )
                                                                                : 0}
                                                                        </strong>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col
                                                                sm={6}
                                                                md={12}
                                                                className="text-secondary mb-2"
                                                            >
                                                                <div className="owed-box border border-secondary d-flex flex-column justify-content-between px-2 py-1">
                                                                    <h6>
                                                                        {" "}
                                                                        You owe
                                                                        this
                                                                        much:{" "}
                                                                    </h6>
                                                                    <div>
                                                                        <strong>
                                                                            ${" "}
                                                                            {userGroupsTotalCreditDebit[
                                                                                group
                                                                                    .id
                                                                            ] &&
                                                                            userGroupsTotalCreditDebit[
                                                                                group
                                                                                    .id
                                                                            ]
                                                                                .total_debt
                                                                                ? userGroupsTotalCreditDebit[
                                                                                      group
                                                                                          .id
                                                                                  ].total_debt.toFixed(
                                                                                      2
                                                                                  )
                                                                                : 0}
                                                                        </strong>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <h6 className="">
                                                    See More {">>"}
                                                </h6>
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                            {/* Delete group button is not directly within Link because it conflicts with the attributes of Link. So we made it look like its position was there */}
                            {userInfo && userInfo.id === group.creator && (
                                <Button
                                    onClick={() =>
                                        openDeletegroupConfirmationPopup(
                                            group.id,
                                            group.name
                                        )
                                    }
                                    className="delete-button bg-secondary border-secondary"
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {selectedGroupName && seletectedGroupId && (
                <DeleteGroupConfirmationPopup
                    show={showDeleteGroupConfirmation}
                    onClose={closeDeletegroupConfirmationPopup}
                    groupName={selectedGroupName}
                    groupId={seletectedGroupId}
                />
            )}
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </div>
    );
}

export default GroupsList;
