import React, { useState, useEffect } from "react";
import { Row, Col, Accordion, Button } from "react-bootstrap";

import "../../styles/screens/FriendsScreen.css";
import SettlePopup from "../IndividualGroupScreenComponents/SettlePopup";

const creditsData = [
    {
        id: 11,
        name: "david",
        email: "david@email.com",
        total_amount: 703.32,
        credits_group_breakdown: [
            {
                amount: 100.0,
                group_id: 7,
                group_name: "second",
            },
            {
                amount: 603.32,
                group_id: 6,
                group_name: "another group ",
            },
        ],
    },
    {
        id: 10,
        name: "charlie",
        email: "charlie@email.com",
        total_amount: 286.36,
        credits_group_breakdown: [
            {
                amount: 286.36,
                group_id: 6,
                group_name: "another group ",
            },
        ],
    },
];
// const creditsData = [];

const debtsData = [
    {
        id: 1,
        name: "Jeus",
        email: "jeus@email.com",
        total_amount: 286.36,
        debts_group_breakdown: [
            {
                amount: 286.36,
                group_id: 6,
                group_name: "another group ",
            },
            {
                amount: 100.0,
                group_id: 7,
                group_name: "second",
            },
        ],
    },
    {
        id: 3,
        name: "tim",
        email: "tim@email.com",
        total_amount: 124.96,
        debts_group_breakdown: [
            {
                amount: 124.96,
                group_id: 6,
                group_name: "another group ",
            },
        ],
    },
];

// const debtsData = [];

/**
 *
 * create action and reducers to get data of creditsData and debtsData
 * /api/users/credit and /api/users/debt respectively
 *
 * Then when successful, watch for the state(which I have commented out
 * and throw a successful alert message)
 *
 * once alert message finished, RESET the redux constant
 *
 */

const FriendsCreditDebt = () => {
    const [showSettlePopup, setShowSettlePopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    console.log(selectedUser);
    console.log(selectedGroupId);

    // settle expenses
    // const groupSettleCreate = useSelector((state) => state.groupSettleCreate);
    // const { success: groupSettleCreateSuccess } = groupSettleCreate;

    const handleCloseSettlePopup = () => {
        setShowSettlePopup(false);
        setSelectedUser(null);
        setSelectedGroupId(null);
    };

    const handleOpenSettlePopup = (
        recevingUserId,
        receivingUserName,
        groupId
    ) => {
        // setShowSettlePopup(true);
        const receivingUser = {
            id: recevingUserId,
            name: receivingUserName,
        };

        setSelectedUser(receivingUser);
        setSelectedGroupId(groupId);
        setShowSettlePopup(true);
    };

    return (
        <div className="owe-component-container">
            {/* Left Box - Users you owe */}
            <Row className="owe-container ">
                <Col md={6} className="p-0">
                    <div className="left-container">
                        <div className="text-center">
                            <h5>Users you owe</h5>
                        </div>
                        {debtsData.length === 0 ? (
                            <div>No one owes you money</div>
                        ) : (
                            <Accordion className="m-0">
                                {debtsData.map((user) => (
                                    <Accordion.Item
                                        key={user.id}
                                        eventKey={user.id}
                                    >
                                        <Accordion.Header className="">
                                            <div className="w-100 d-flex justify-content-between ">
                                                <div>{user.name}</div>
                                                <div className="px-3">
                                                    Total Amount:{" "}
                                                    <span className="text-secondary">
                                                        ${user.total_amount}
                                                    </span>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {user.debts_group_breakdown.map(
                                                (debt, index) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex justify-content-between  mb-3"
                                                    >
                                                        <div>
                                                            {debt.group_name}
                                                        </div>
                                                        <div>
                                                            Amount:{" "}
                                                            <span className="text-secondary">
                                                                ${debt.amount}
                                                            </span>
                                                            <Button
                                                                className="btn btn-secondary"
                                                                onClick={() =>
                                                                    handleOpenSettlePopup(
                                                                        user.id,
                                                                        user.name,
                                                                        debt.group_id
                                                                    )
                                                                }
                                                            >
                                                                Settle
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </Col>

                {/* Right Box - Users owe you */}
                <Col md={6} className="p-0">
                    <div className="right-container">
                        <div className="text-center">
                            <h5>Users owe you</h5>
                        </div>
                        {creditsData.length === 0 ? (
                            <div>You don't owe anyone</div>
                        ) : (
                            <Accordion>
                                {creditsData.map((user) => (
                                    <Accordion.Item
                                        key={user.id}
                                        eventKey={user.id}
                                    >
                                        <Accordion.Header>
                                            <div className="w-100 d-flex justify-content-between">
                                                <div>{user.name}</div>
                                                <div className="px-3">
                                                    Total Amount:{" "}
                                                    <span className="text-primary">
                                                        ${user.total_amount}
                                                    </span>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {user.credits_group_breakdown.map(
                                                (credit, index) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex justify-content-between mb-3"
                                                    >
                                                        <div>
                                                            {credit.group_name}
                                                        </div>
                                                        <div>
                                                            Amount:{" "}
                                                            <span className="text-primary">
                                                                ${credit.amount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </Col>
            </Row>
            {selectedUser && selectedGroupId && (
                <SettlePopup
                    groupId={selectedGroupId}
                    receivingUser={selectedUser}
                    show={showSettlePopup}
                    handleClose={handleCloseSettlePopup}
                />
            )}
        </div>
    );
};

export default FriendsCreditDebt;
