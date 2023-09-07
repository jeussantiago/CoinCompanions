import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import "../styles/screens/GroupsScreens.css";
import { GROUP_DETAILS_RESET } from "../constants/groupConstants";
import Message from "../components/Message";
import AlertMessage from "../components/AlertMessage";
import { getGroupDetails } from "../actions/groupActions";
import UpdateNamePopup from "../components/IndividualGroupScreenComponents/UpdateNamePopup";
import ExpenseList from "../components/IndividualGroupScreenComponents/ExpenseList";
import GroupCreditDebt from "../components/IndividualGroupScreenComponents/GroupCreditDebt";

/**
 * if the user is not logged in. navigate to home page
 *
 * if the user is not part of the group. navigate to the groups page <<<<<<<<
 *
 * modify group name <<<<<<<<<<
 *
 *
 * expense chart <<<<<<<
 * list expenses
 *      type='expense' or 'settle'
 *      who paid
 *      description
 *      how_much
 *      date_added
 *      (edit button)
 *
 * add expense
 *      (will use the same form as edit expense. will have conditional to differentiate between adding expense and updating)
 *
 * (when you click an expense, it expands to show the specifics)
 *      how much each person owes the payer
 *
 * Expense Edit <<<<<<<
 *      able to see how much each person paid
 *      decide to split it by:
 *          - raw numbers
 *          - percentage
 *          - evenly split
 * - [ ] add a feature to evenly split expense
 *
 * RIGHT SIDE:
 * list all the users and their debt to each person or how much they are owed from certain people
 *
 * search bar to invite other users to group
 *
 *
 */
function IndividualGroupScreen() {
    const dispatch = useDispatch();
    // group id
    const { id } = useParams();
    const navigate = useNavigate();

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

    const [showUpdateNamePopup, setShowUpdateNamePopup] = useState(false);
    const [isGroupNameUpdated, setIsGroupNameUpdated] = useState(false);

    const openShowUpdateNamePopup = () => {
        setShowUpdateNamePopup(true);
    };

    const closeShowUpdateNamePopup = () => {
        setShowUpdateNamePopup(false);
    };

    const groupNameIsUpdated = () => {
        setIsGroupNameUpdated(!isGroupNameUpdated);
    };

    // NAVIGATE THE USER AWAY IF THEY ARE NOT PART OF THIS GROUP
    useEffect(() => {
        // finished getting data and group id doesn't exist
        //user not a member
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

    useEffect(() => {
        dispatch(getGroupDetails(id));
    }, [dispatch, id, isGroupNameUpdated]);

    return (
        <div className="route-container screen-container">
            <div>
                {groupDetailsLoading ? (
                    <div>Loading...</div>
                ) : groupDetailsError ? (
                    <Message variant="danger">{groupDetailsError}</Message>
                ) : (
                    groupDetail && (
                        <div>
                            <div className="group-name-container">
                                <div className="d-flex flex-row">
                                    <div
                                        className="clickable"
                                        onClick={openShowUpdateNamePopup}
                                    >
                                        <h1 className="pr-2">
                                            {groupDetail.name}
                                        </h1>
                                    </div>
                                    <div
                                        className="clickable"
                                        onClick={openShowUpdateNamePopup}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </div>
                                </div>
                                <UpdateNamePopup
                                    show={showUpdateNamePopup}
                                    onClose={closeShowUpdateNamePopup}
                                    groupNameIsUpdated={groupNameIsUpdated}
                                    currentGroupName={groupDetail.name}
                                    groupId={id}
                                />
                            </div>
                            <div className="group-body">
                                <Row className="mb-4">
                                    <Col
                                        md={8}
                                        className="border border-primary"
                                    >
                                        chart
                                    </Col>
                                    <Col
                                        md={4}
                                        className="border border-primary"
                                    >
                                        Members Debt
                                    </Col>
                                </Row>
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
        </div>
    );
}

export default IndividualGroupScreen;
