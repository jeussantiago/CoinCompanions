import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import "../styles/screens/DashboardScreen.css";
import PendingInvitesPopup from "../components/DashboardScreenComponents/PendingInvitesPopup";

function DashboardScreen() {
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [showPendingInvitesPopup, setShowPendingInvitesPopup] =
        useState(false);

    // Function to open the PendingInvitesPopup
    const openPendingInvitesPopup = () => {
        setShowPendingInvitesPopup(true);
    };

    // Function to close the PendingInvitesPopup
    const closePendingInvitesPopup = () => {
        setShowPendingInvitesPopup(false);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        <div className="route-container screen-container">
            <div className="d-flex flex-row justify-content-between align-items-center">
                <h1>{userInfo.name}</h1>
                <Button onClick={openPendingInvitesPopup}>
                    Pending Invites
                </Button>
            </div>
            <PendingInvitesPopup
                show={showPendingInvitesPopup}
                onClose={closePendingInvitesPopup}
            />
        </div>
    );
}

export default DashboardScreen;
