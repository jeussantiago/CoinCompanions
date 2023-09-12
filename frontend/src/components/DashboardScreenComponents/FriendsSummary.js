import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import "../../styles/screens/DashboardScreen.css";
import Message from "../Message";
import { getUserCredits, getUserDebts } from "../../actions/userActions";

function FriendsSummary() {
    const dispatch = useDispatch();
    const collapseSize = 4;
    const [showAll, setShowAll] = useState(false);

    // User's total credit breakdown
    const userCredits = useSelector((state) => state.userCredits);
    const {
        error: userCreditsError,
        loading: userCreditsLoading,
        userCredit,
    } = userCredits;
    // User's total debt breakdown
    const userDebts = useSelector((state) => state.userDebts);
    const {
        error: userDebtsError,
        loading: userDebtsLoading,
        userDebt,
    } = userDebts;

    const handleShowMore = () => {
        setShowAll(!showAll);
    };

    useEffect(() => {
        dispatch(getUserCredits());
        dispatch(getUserDebts());
    }, [dispatch]);

    return (
        <div className="dashboard-section-container">
            <h4>Friends Summary</h4>
            <Row className="dashboard-section-box-container">
                <Col md={6} className="dashboard-section-box-container-col">
                    <div>
                        <h6>Friends you owe</h6>
                    </div>
                    <div className="summary-box">
                        {userDebtsLoading ? (
                            <div>Loading...</div>
                        ) : userDebtsError ? (
                            <Message variant="danger">{userDebtsError}</Message>
                        ) : userDebt.length === 0 ? (
                            <div>You don't owe anyone money</div>
                        ) : (
                            <div className="m-0">
                                {userDebt
                                    .slice(
                                        0,
                                        showAll ? userDebt.length : collapseSize
                                    )
                                    .map((user) => (
                                        <div
                                            key={user.id}
                                            className="summary-box-item d-flex flex-row justify-content-between"
                                        >
                                            <div>{user.name}</div>
                                            <div className="text-secondary">
                                                ${user.total_amount.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </Col>

                <Col md={6} className="dashboard-section-box-container-col">
                    <div>
                        <h6>Friends owe to you</h6>
                    </div>
                    <div className="summary-box">
                        {userCreditsLoading ? (
                            <div>Loading...</div>
                        ) : userCreditsError ? (
                            <Message variant="danger">
                                {userCreditsError}
                            </Message>
                        ) : userCredit.length === 0 ? (
                            <div>No one owes you</div>
                        ) : (
                            <div className="m-0">
                                {userCredit
                                    .slice(
                                        0,
                                        showAll
                                            ? userCredit.length
                                            : collapseSize
                                    )
                                    .map((user) => (
                                        <div
                                            key={user.id}
                                            className="summary-box-item d-flex flex-row justify-content-between"
                                        >
                                            <div>{user.name}</div>
                                            <div className="text-primary">
                                                ${user.total_amount.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </Col>

                {(userDebt.length > collapseSize ||
                    userCredit.length > collapseSize) && (
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

export default FriendsSummary;
