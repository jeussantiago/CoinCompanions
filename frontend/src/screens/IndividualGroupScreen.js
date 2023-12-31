import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button } from "react-bootstrap";

import "../styles/screens/GroupsScreens.css";
import Message from "../components/Message";
import AlertMessage from "../components/AlertMessage";
import {
    getGroupDetails,
    getGroupNewUserInvitation,
} from "../actions/groupActions";
import UpdateNamePopup from "../components/IndividualGroupScreenComponents/UpdateNamePopup";
import ExpenseList from "../components/IndividualGroupScreenComponents/ExpenseList";
import GroupCreditDebt from "../components/IndividualGroupScreenComponents/GroupCreditDebt";
import InviteUsersPopup from "../components/IndividualGroupScreenComponents/InviteUsersPopup";
import NewUserInGroupPopup from "../components/IndividualGroupScreenComponents/NewUserInGroupPopup";
import {
    GROUP_DETAILS_RESET,
    GROUP_NAME_UPDATE_RESET,
    GROUP_USER_NEW_NVITATION_RESET,
} from "../constants/groupConstants";

function IndividualGroupScreen() {
    // group id
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [showInviteUserPopup, setShowInviteUserPopup] = useState(false);
    const [showUpdateNamePopup, setShowUpdateNamePopup] = useState(false);
    const [showNewUserPopup, setShowNewUserPopup] = useState(false);

    // get the current user details
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // get the members of the group
    const groupDetails = useSelector((state) => state.groupDetails);
    const {
        error: groupDetailsError,
        loading: groupDetailsLoading,
        groupDetail,
    } = groupDetails;

    // group name update
    const groupNameUpdate = useSelector((state) => state.groupNameUpdate);
    const { success: groupNameUpdateSuccess } = groupNameUpdate;

    // new user in group
    const groupNewUserInvitation = useSelector(
        (state) => state.groupNewUserInvitation
    );
    const { newUserInvitation } = groupNewUserInvitation;

    // update name popup
    const openShowUpdateNamePopup = () => {
        setShowUpdateNamePopup(true);
    };
    const closeShowUpdateNamePopup = () => {
        setShowUpdateNamePopup(false);
    };

    // Function to open the inviting users popup
    const openInviteUserPopup = () => {
        setShowInviteUserPopup(true);
    };
    // Function to close the inviting users popup
    const closeInviteUserPopup = () => {
        setShowInviteUserPopup(false);
    };

    // new user popup
    const openNewUserPopup = () => {
        setShowNewUserPopup(true);
    };
    const closeNewUserPopup = () => {
        setShowNewUserPopup(false);
    };

    const handleShowAlert = useCallback((message, variant) => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, []);

    // NAVIGATE THE USER AWAY IF THEY ARE NOT PART OF THIS GROUP
    useEffect(() => {
        // finished getting data and group id doesn't exist
        // user not a member
        if (
            !groupDetailsLoading &&
            (groupDetailsError ||
                (groupDetail &&
                    !groupDetail.members.some(
                        (member) => member.id === userInfo.id
                    )))
        ) {
            navigate("/groups");
            dispatch({ type: GROUP_DETAILS_RESET });
        }
    }, [
        navigate,
        userInfo,
        groupDetailsError,
        groupDetailsLoading,
        groupDetail,
        dispatch,
    ]);

    // Updated Group Name
    useEffect(() => {
        if (groupNameUpdateSuccess) {
            handleShowAlert("Updated group name", "success");
            dispatch({ type: GROUP_NAME_UPDATE_RESET });
        } else if (groupNameUpdateSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to update group name",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, groupNameUpdateSuccess]);

    useEffect(() => {
        if (newUserInvitation && newUserInvitation.hasAcceptedInvitation) {
            openNewUserPopup();
            dispatch({ type: GROUP_USER_NEW_NVITATION_RESET });
        }
    }, [dispatch, newUserInvitation]);

    useEffect(() => {
        dispatch(getGroupDetails(id));
    }, [dispatch, id, groupNameUpdateSuccess]);

    useEffect(() => {
        dispatch(getGroupNewUserInvitation(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        userInfo && (
            <div className="route-container screen-container  py-4">
                <div>
                    {groupDetailsLoading ? (
                        <div>Loading...</div>
                    ) : groupDetailsError ? (
                        <Message variant="danger">{groupDetailsError}</Message>
                    ) : (
                        groupDetail && (
                            <div>
                                <div className="group-name-container mb-4">
                                    <div className="d-flex flex-row justify-content-between align-items-center ">
                                        <div className="d-flex flex-row">
                                            <div
                                                className="clickable"
                                                onClick={
                                                    openShowUpdateNamePopup
                                                }
                                            >
                                                <h1 className="pr-2">
                                                    {groupDetail.name}
                                                </h1>
                                            </div>
                                            <div
                                                className="clickable"
                                                onClick={
                                                    openShowUpdateNamePopup
                                                }
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                openInviteUserPopup()
                                            }
                                        >
                                            Invite User
                                        </Button>
                                    </div>
                                    <UpdateNamePopup
                                        show={showUpdateNamePopup}
                                        onClose={closeShowUpdateNamePopup}
                                        currentGroupName={groupDetail.name}
                                        groupId={id}
                                    />
                                </div>
                                <div className="group-body">
                                    <Row>
                                        <Col md={12} lg={9} className="">
                                            <ExpenseList
                                                groupDetails={groupDetail}
                                            />
                                        </Col>
                                        <Col md={12} lg={3} className="">
                                            <GroupCreditDebt
                                                groupDetails={groupDetail}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <InviteUsersPopup
                    show={showInviteUserPopup}
                    onClose={closeInviteUserPopup}
                    groupId={id}
                />
                <NewUserInGroupPopup
                    show={showNewUserPopup}
                    onClose={closeNewUserPopup}
                    groupId={id}
                />
                {showAlert && (
                    <AlertMessage
                        message={alertMessage}
                        variant={alertVariant}
                    />
                )}
            </div>
        )
    );
}

export default IndividualGroupScreen;
