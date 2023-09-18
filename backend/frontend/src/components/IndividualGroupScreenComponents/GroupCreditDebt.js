import React, { useState, useEffect } from "react";
import { Accordion, ListGroup, Button, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Message from "../Message";
import { getGroupCredits, getGroupDebts } from "../../actions/groupActions";
import SettlePopup from "./SettlePopup";

function GroupCreditDebt({ groupDetails }) {
    const dispatch = useDispatch();
    const [showSettlePopup, setShowSettlePopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

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

    // group User Credits (owed money)
    const groupCredits = useSelector((state) => state.groupCredits);
    const {
        error: groupCreditError,
        loading: groupCreditLoading,
        groupCredit,
    } = groupCredits;
    // group User Debts (owe money)
    const groupDebts = useSelector((state) => state.groupDebts);
    const {
        error: groupDebtError,
        loading: groupDebtLoading,
        groupDebt,
    } = groupDebts;

    const handleCloseSettlePopup = () => {
        setShowSettlePopup(false);
        setSelectedUser(null);
    };

    const handleOpenSettlePopup = (receivingUser) => {
        setSelectedUser(receivingUser);
        setShowSettlePopup(true);
    };

    useEffect(() => {
        dispatch(getGroupCredits(groupDetails.id));
        dispatch(getGroupDebts(groupDetails.id));
    }, [
        dispatch,
        groupDetails,
        groupSettleCreateSuccess,
        groupExpenseDetailUpdateSuccess,
        groupExpenseDeleteSuccess,
        groupExpenseCreateSuccess,
    ]);

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
                                                                            handleOpenSettlePopup(
                                                                                user.creditor
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
            {selectedUser && (
                <SettlePopup
                    groupId={groupDetails.id}
                    receivingUser={selectedUser}
                    show={showSettlePopup}
                    handleClose={handleCloseSettlePopup}
                />
            )}
        </div>
    );
}

export default GroupCreditDebt;
