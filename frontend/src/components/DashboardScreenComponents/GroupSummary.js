import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import "../../styles/screens/DashboardScreen.css";
import Message from "../Message";
import { getUsersGroupsTotalCreditDebit } from "../../actions/userActions";

/**
 * I could have created APIs that give me the data I want (group total credit and group
 * total debt) similar to DashboardScreenComponents/FriendsSummary.js, and simply just call
 * thos APIs and use the data using actions and reducers. However, I wanted to try out having
 * not ideal data and requiring formatting. This is why in this component I used existing
 * actions and reducers and formatted it to fit the structure I desired.
 *
 */
function GroupSummary() {
    const dispatch = useDispatch();
    const collapseSize = 4;
    const [userDebtList, setUserDebtList] = useState([]);
    const [userCreditList, setUserCreditList] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const usersGroupsTotalDebtCredit = useSelector(
        (state) => state.usersGroupsTotalDebtCredit
    );
    const {
        error: userGroupsTotalCreditDebitError,
        loading: userGroupsTotalCreditDebitLoading,
        userGroupsTotalCreditDebit,
    } = usersGroupsTotalDebtCredit;

    const handleShowMore = () => {
        setShowAll(!showAll);
    };

    useEffect(() => {
        if (userGroupsTotalCreditDebit) {
            const updatedUserDebtList = [];
            const updatedUserCreditList = [];

            for (const groupId in userGroupsTotalCreditDebit) {
                const groupData = userGroupsTotalCreditDebit[groupId];
                const { group_name, total_credit, total_debt } = groupData;
                // Create unique keys based on groupId and data type
                const creditKey = `${groupId}_credit`;
                const debtKey = `${groupId}_debt`;

                // Check if total_credit exists and add it to the list
                if (total_credit !== null) {
                    updatedUserCreditList.push({
                        groupId: groupId,
                        groupName: group_name,
                        totalCredit: total_credit.toFixed(2),
                        key: creditKey,
                    });
                }

                // Check if total_debt exists and add it to the list
                if (total_debt !== null) {
                    updatedUserDebtList.push({
                        groupId: groupId,
                        groupName: group_name,
                        totalDebt: total_debt.toFixed(2),
                        key: debtKey,
                    });
                }
            }

            // Update the state with the new arrays
            setUserCreditList(updatedUserCreditList);
            setUserDebtList(updatedUserDebtList);
        }
    }, [userGroupsTotalCreditDebit]);

    useEffect(() => {
        dispatch(getUsersGroupsTotalCreditDebit());
    }, [dispatch]);

    return (
        <div className="dashboard-section-container">
            <h4>Groups Summary</h4>
            <Row className="dashboard-section-box-container">
                <Col md={6} className="dashboard-section-box-container-col ">
                    <div>
                        <h6>Groups you owe</h6>
                    </div>
                    <div className="summary-box">
                        {userGroupsTotalCreditDebitLoading ? (
                            <div>Loading...</div>
                        ) : userGroupsTotalCreditDebitError ? (
                            <Message variant="danger">
                                {userGroupsTotalCreditDebitError}
                            </Message>
                        ) : userDebtList.length === 0 ? (
                            <h6 className="py-3 text-center">
                                You don't owe any group money
                            </h6>
                        ) : (
                            <div className="m-0">
                                {userDebtList
                                    .slice(
                                        0,
                                        showAll
                                            ? userDebtList.length
                                            : collapseSize
                                    )
                                    .map((group) => (
                                        <div
                                            key={group.key}
                                            className="summary-box-item d-flex flex-row justify-content-between"
                                        >
                                            <div>{group.groupName}</div>
                                            <div className="text-secondary">
                                                ${group.totalDebt}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </Col>

                <Col md={6} className="dashboard-section-box-container-col">
                    <div>
                        <h6>Groups owe to you</h6>
                    </div>
                    <div className="summary-box">
                        {userGroupsTotalCreditDebitLoading ? (
                            <div>Loading...</div>
                        ) : userGroupsTotalCreditDebitError ? (
                            <Message variant="danger">
                                {userGroupsTotalCreditDebitError}
                            </Message>
                        ) : userCreditList.length === 0 ? (
                            <h6 className="py-3 text-center">
                                No group owes you
                            </h6>
                        ) : (
                            <div className="m-0 ">
                                {userCreditList
                                    .slice(
                                        0,
                                        showAll
                                            ? userCreditList.length
                                            : collapseSize
                                    )
                                    .map((group) => (
                                        <div
                                            key={group.key}
                                            className="summary-box-item d-flex flex-row justify-content-between"
                                        >
                                            <div>{group.groupName}</div>
                                            <div className="text-primary">
                                                ${group.totalCredit}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </Col>

                {(userDebtList.length > collapseSize ||
                    userCreditList.length > collapseSize) && (
                    <div
                        onClick={() => handleShowMore()}
                        className="show-more-button mt-4"
                    >
                        {showAll ? (
                            <div>
                                Show less{" "}
                                <i className="fa-solid fa-angles-up"></i>
                            </div>
                        ) : (
                            <div>
                                Show all{" "}
                                <i className="fa-solid fa-angles-down"></i>
                            </div>
                        )}
                    </div>
                )}
            </Row>
        </div>
    );
}

export default GroupSummary;
