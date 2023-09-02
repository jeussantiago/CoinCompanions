import React, { useState } from "react";
import { Col, Row, Button } from "react-bootstrap";

import "../styles/screens/GroupsScreens.css";
import CreateGroupPopup from "../components/GroupsScreenComponents/CreateGroupPopup";
import GroupsList from "../components/GroupsScreenComponents/GroupsList";
import GroupsOweUser from "../components/GroupsScreenComponents/GroupsOweUser";

/**
 * can see what group owe you and what groups you owe
 *
 * Create a group button
 * List groups the user is part of
 *      can see the last two recent activites from a group
 * Select a group and be send to the /groups/:id
 *
 */
function GroupsScreen() {
    const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);

    // Function to open the PendingInvitesPopup
    const openCreateGroupPopup = () => {
        setShowCreateGroupPopup(true);
    };

    // Function to close the PendingInvitesPopup
    const closeCreateGroupPopup = () => {
        setShowCreateGroupPopup(false);
    };

    const groups = [
        {
            id: 1,
            name: "Group A",
            transactions: [
                { id: 1, description: "Pizza", amount: -20 },
                { id: 2, description: "Movie", amount: -15 },
            ],
            oweYou: 10,
            youOwe: 25,
        },
        {
            id: 2,
            name: "Group B",
            transactions: [
                { id: 3, description: "Groceries", amount: -50 },
                { id: 4, description: "Gas", amount: -30 },
            ],
            oweYou: 15,
            youOwe: 40,
        },
        {
            id: 3,
            name: "Group C",
            transactions: [
                { id: 5, description: "Dinner", amount: -35 },
                { id: 6, description: "Concert", amount: -60 },
            ],
            oweYou: 20,
            youOwe: 50,
        },
    ];

    return (
        <div className="screen-container">
            <Row>
                <div className="border border-primary d-flex flex-row justify-content-between align-items-center">
                    <h1>Groups</h1>
                    <Button onClick={openCreateGroupPopup}>Create Group</Button>
                </div>
                <Row className="border border-secondary p-0 m-0">
                    <Col sm={8} className="p-0 m-0">
                        <GroupsList />
                    </Col>
                    <Col sm={4}>
                        <GroupsOweUser groups={groups} />
                    </Col>
                </Row>
            </Row>
            <CreateGroupPopup
                show={showCreateGroupPopup}
                onClose={closeCreateGroupPopup}
            />
        </div>
    );
}

export default GroupsScreen;
