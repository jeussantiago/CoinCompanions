import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import "../styles/screens/FriendsScreen.css";
import FriendList from "../components/FriendsScreenComponents/FriendList";
import FriendsCreditDebt from "../components/FriendsScreenComponents/FriendsCreditDebt";

function FriendsScreen() {
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        userInfo && (
            <div className="route-container screen-container d-flex flex-column py-4">
                <Row>
                    <Col>
                        <FriendsCreditDebt />
                    </Col>
                    <Col sm={12} md={3}>
                        <FriendList />
                    </Col>
                </Row>
            </div>
        )
    );
}

export default FriendsScreen;
