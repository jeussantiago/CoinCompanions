import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import "../../styles/screens/DashboardScreen.css";
import Message from "../Message";

/**
 * Data dispatch from DashboardScreenComponents/GroupSummary.js
 */
function TotalSummary() {
    const [userDebtTotal, setUserDebtTotal] = useState(0);
    const [userCreditTotal, setUserCreditTotal] = useState(0);

    const usersGroupsTotalDebtCredit = useSelector(
        (state) => state.usersGroupsTotalDebtCredit
    );
    const {
        error: userGroupsTotalCreditDebitError,
        loading: userGroupsTotalCreditDebitLoading,
        userGroupsTotalCreditDebit,
    } = usersGroupsTotalDebtCredit;

    useEffect(() => {
        if (userGroupsTotalCreditDebit) {
            var updatedUserDebtTotal = 0;
            var updatedUserCreditTotal = 0;

            for (const groupId in userGroupsTotalCreditDebit) {
                const groupData = userGroupsTotalCreditDebit[groupId];
                const { total_credit, total_debt } = groupData;

                // Check if total_credit exists and add it to the list
                if (total_credit !== null) {
                    updatedUserCreditTotal += total_credit;
                }

                // Check if total_debt exists and add it to the list
                if (total_debt !== null) {
                    updatedUserDebtTotal += total_debt;
                }
            }

            // Update the state with values that have 2 decimal places
            setUserCreditTotal(updatedUserCreditTotal.toFixed(2));
            setUserDebtTotal(updatedUserDebtTotal.toFixed(2));
        }
    }, [userGroupsTotalCreditDebit]);

    return (
        <div className="dashboard-section-container">
            <h4>Total Summary</h4>
            <Row className="dashboard-section-box-container">
                <Col md={6} className="dashboard-section-box-container-col">
                    <div>
                        <h6>Total you owe</h6>
                    </div>
                    <div className="summary-box">
                        {userGroupsTotalCreditDebitLoading ? (
                            <div>Loading...</div>
                        ) : userGroupsTotalCreditDebitError ? (
                            <Message variant="danger">
                                {userGroupsTotalCreditDebitError}
                            </Message>
                        ) : (
                            <div className="m-0">
                                <h4 className="text-secondary">
                                    ${userDebtTotal}
                                </h4>
                            </div>
                        )}
                    </div>
                </Col>

                <Col md={6} className="dashboard-section-box-container-col">
                    <div>
                        <h6>Friends owe to you</h6>
                    </div>
                    <div className="summary-box">
                        {userGroupsTotalCreditDebitLoading ? (
                            <div>Loading...</div>
                        ) : userGroupsTotalCreditDebitError ? (
                            <Message variant="danger">
                                {userGroupsTotalCreditDebitError}
                            </Message>
                        ) : (
                            <div className="m-0">
                                <h4 className="text-primary">
                                    ${userCreditTotal}
                                </h4>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default TotalSummary;
