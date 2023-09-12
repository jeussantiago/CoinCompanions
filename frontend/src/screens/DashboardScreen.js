import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import "../styles/screens/DashboardScreen.css";
import PendingInvitesPopup from "../components/DashboardScreenComponents/PendingInvitesPopup";
import TotalSummary from "../components/DashboardScreenComponents/TotalSummary";
import FriendsSummary from "../components/DashboardScreenComponents/FriendsSummary";
import GroupSummary from "../components/DashboardScreenComponents/GroupSummary";

function DashboardScreen() {
    const navigate = useNavigate();
    const [showPendingInvitesPopup, setShowPendingInvitesPopup] =
        useState(false);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // list of user's pending friend request
    const userFriendRequestList = useSelector(
        (state) => state.userFriendRequestList
    );
    const { friendRequestList } = userFriendRequestList;

    // list of user's pending group invites
    const userGroupRequestList = useSelector(
        (state) => state.userGroupRequestList
    );
    const { groupRequestList } = userGroupRequestList;

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
            <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                <h1>Hello, {userInfo.name}</h1>
                <Button onClick={openPendingInvitesPopup}>
                    {((groupRequestList && groupRequestList.length > 0) ||
                        (friendRequestList &&
                            friendRequestList.length > 0)) && (
                        <span className="notification-red-dot text-secondary me-1">
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </span>
                    )}
                    Pending Invites
                </Button>
            </div>
            <TotalSummary />
            <FriendsSummary />
            <GroupSummary />
            <PendingInvitesPopup
                show={showPendingInvitesPopup}
                onClose={closePendingInvitesPopup}
            />
        </div>
    );
}

export default DashboardScreen;
