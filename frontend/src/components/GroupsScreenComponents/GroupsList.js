import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../../styles/screens/GroupsScreens.css";
import { getGroupsList } from "../../actions/groupActions";
import Message from "../Message";

function GroupsList() {
    const dispatch = useDispatch();

    const groupLists = useSelector((state) => state.groupLists);
    const { error, loading, groupList } = groupLists;

    useEffect(() => {
        dispatch(getGroupsList());
    }, [dispatch]);
    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : groupList.length === 0 ? (
                <p>No groups joined</p>
            ) : (
                <div>
                    {groupList.map((group) => (
                        <div className="border border-primary" key={group.id}>
                            <Link
                                to={`/groups/${group.id}`}
                                className="text-decoration-none"
                            >
                                <Card
                                    className="mb-3"
                                    style={{ cursor: "pointer" }}
                                >
                                    <Card.Body>
                                        <h5>{group.name}</h5>
                                        <div className="card-body-most-recent-expense">
                                            {group.most_recent_expense
                                                .length === 0 ? (
                                                <div>No expenses yet</div>
                                            ) : (
                                                <ul className="p-0">
                                                    <strong>
                                                        Most Recent
                                                        Transactions:
                                                    </strong>
                                                    {group.most_recent_expense.map(
                                                        (expense) => (
                                                            <li
                                                                key={expense.id}
                                                                className="card-body-most-recent-expense-row"
                                                            >
                                                                <div className="list-wrapper">
                                                                    <div className="red-line"></div>

                                                                    <div className="list-item-wrapper">
                                                                        <div className="list-bullet"></div>
                                                                        <div className="list-item">
                                                                            <div className="list-title">
                                                                                {
                                                                                    expense
                                                                                        .payer
                                                                                        .name
                                                                                }{" "}
                                                                                added
                                                                                an
                                                                                expense
                                                                                for
                                                                                $
                                                                                {
                                                                                    expense.amount
                                                                                }
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
                                        </div>
                                        <div>
                                            <strong>
                                                You are owed this money
                                                {/* {group.oweYou > 0
                                                                        ? `You are owed: $${group.oweYou}`
                                                                        : `You owe: $${-group.youOwe}`} */}
                                            </strong>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GroupsList;
