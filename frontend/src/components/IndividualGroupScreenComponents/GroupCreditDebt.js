import React, { useState, useEffect } from "react";
import { Accordion, ListGroup, Button, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Message from "../Message";
import { getGroupCredits, getGroupDebts } from "../../actions/groupActions";

function GroupCreditDebt({ groupDetails }) {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const groupCredits = useSelector((state) => state.groupCredits);
    const {
        error: groupCreditError,
        loading: groupCreditLoading,
        groupCredit,
    } = groupCredits;

    const groupDebts = useSelector((state) => state.groupDebts);
    const {
        error: groupDebtError,
        loading: groupDebtLoading,
        groupDebt,
    } = groupDebts;

    const handleSettle = (receivingUserId) => {
        console.log("hello: ", receivingUserId);
    };

    useEffect(() => {
        dispatch(getGroupCredits(groupDetails.id));
        dispatch(getGroupDebts(groupDetails.id));
    }, [dispatch, groupDetails]);

    return (
        <div>
            {groupCreditLoading || groupDebtLoading ? (
                <div>Loading...</div>
            ) : groupCreditError || groupDebtError ? (
                <Message variant="danger">
                    {groupCreditError || groupDebtError}
                </Message>
            ) : (
                <div>
                    <h4>Members</h4>

                    <Accordion defaultActiveKey={null}>
                        {groupDetails.members.map((member) => (
                            <Accordion.Item
                                eventKey={member.id}
                                key={member.id}
                            >
                                <Accordion.Header>
                                    {member.name}
                                </Accordion.Header>
                                <Accordion.Body>
                                    {groupCredit?.credits_per_user?.[
                                        member.id
                                    ] && (
                                        <div>
                                            <ListGroup>
                                                {groupCredit.credits_per_user[
                                                    member.id
                                                ].map((user, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <span className="text-primary">
                                                            ${user.amount}{" "}
                                                        </span>
                                                        from {user.debtor.name}
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    )}
                                    {groupDebt?.debts_per_user?.[member.id] && (
                                        <div>
                                            <ListGroup>
                                                {groupDebt.debts_per_user[
                                                    member.id
                                                ].map((user, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <span className="text-secondary">
                                                            ${user.amount}{" "}
                                                        </span>
                                                        to {user.creditor.name}
                                                        {userInfo &&
                                                            member.id ===
                                                                userInfo.id && (
                                                                <Row className="mt-3">
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={() =>
                                                                            handleSettle(
                                                                                user
                                                                                    .creditor
                                                                                    .id
                                                                            )
                                                                        }
                                                                    >
                                                                        Settle
                                                                    </Button>
                                                                </Row>
                                                            )}
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    );
}

export default GroupCreditDebt;
