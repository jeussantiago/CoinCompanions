import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Button } from "react-bootstrap";

import "../styles/screens/GroupsScreens.css";
import CreateGroupPopup from "../components/GroupsScreenComponents/CreateGroupPopup";
import GroupsList from "../components/GroupsScreenComponents/GroupsList";

function GroupsScreen() {
    const navigate = useNavigate();

    const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Function to open the PendingInvitesPopup
    const openCreateGroupPopup = () => {
        setShowCreateGroupPopup(true);
    };

    // Function to close the PendingInvitesPopup
    const closeCreateGroupPopup = () => {
        setShowCreateGroupPopup(false);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        userInfo && (
            <div className="route-container screen-container py-4">
                <Row>
                    <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                        <h3>Groups</h3>
                        <Button onClick={openCreateGroupPopup}>
                            Create Group
                        </Button>
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
        )
    );
}

export default GroupsScreen;
