import React, { useState } from "react";
import { Col, Row, Button } from "react-bootstrap";

import "../styles/screens/GroupsScreens.css";
import CreateGroupPopup from "../components/GroupsScreenComponents/CreateGroupPopup";
import GroupsList from "../components/GroupsScreenComponents/GroupsList";

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

    return (
        <div className="route-container screen-container">
            <Row>
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <h1>Groups</h1>
                    <Button onClick={openCreateGroupPopup}>Create Group</Button>
                </div>
                <Row className="p-0 m-0">
                    <GroupsList />
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
