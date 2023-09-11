import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import { getUserCredits, getUserDebts } from "../../actions/userActions";

function FriendsSummary() {
    const dispatch = useDispatch();

    // User's total credit breakdown
    const userCredits = useSelector((state) => state.userCredits);
    const {
        error: userCreditsError,
        loading: userCreditsLoading,
        userCredit,
    } = userCredits;
    // User's total debt breakdown
    const userDebts = useSelector((state) => state.userDebts);
    const {
        error: userDebtsError,
        loading: userDebtsLoading,
        userDebt,
    } = userDebts;

    console.log("userCredit: ", userCredit);
    console.log("userDebt: ", userDebt);

    useEffect(() => {
        dispatch(getUserCredits());
        dispatch(getUserDebts());
    }, [dispatch]);

    return (
        <div className="border border-primary">
            <div>FriendsSummary</div>
        </div>
    );
}

export default FriendsSummary;
