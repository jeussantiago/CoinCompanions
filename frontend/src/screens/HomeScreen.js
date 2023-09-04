import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import LoginForm from "../components/HomeScreenComponents/LoginForm";
import RegistrationForm from "../components/HomeScreenComponents/RegistrationForm";
import divingImage from "../images/friends-diving.png";
import "../styles/screens/HomeScreen.css";

function HomeScreen() {
    const [isHomeBoxOnRight, setIsHomeBoxOnRight] = useState(true);

    const toggleHomeBoxPosition = () => {
        setIsHomeBoxOnRight(!isHomeBoxOnRight);
    };

    return (
        <div className="screen-container home-screen">
            <div
                className={`home-box ${
                    isHomeBoxOnRight ? "home-box-right" : "home-box-left"
                } bg-primary`}
            >
                <div className="home-box-container">
                    <div className="home-box-text-container">
                        <p>
                            Travel, have fun and spend your hard earned money
                            with friends and family.
                            <br />
                            Don't waste time trying to figure out who owes who.
                            Let us do the work while you enjoy your trip.
                        </p>
                    </div>
                    <div className="home-box-image-container">
                        <img
                            src={divingImage}
                            alt="friends diving"
                            style={{
                                transform: isHomeBoxOnRight
                                    ? "scale(0.7, 0.7) translate(-15%, -40%)"
                                    : "scale(-0.7, 0.7) translate(-17%, -40%)",
                                position: "absolute",
                                top: 0,
                                [isHomeBoxOnRight ? "left" : "right"]: 0,
                            }}
                            className="home-box-image"
                        />
                    </div>
                </div>
            </div>
            <div className="view-content h-100">
                <Row
                    className={`forms-container d-flex ${
                        isHomeBoxOnRight
                            ? "justify-content-start"
                            : "justify-content-end"
                    } align-items-center`}
                >
                    {isHomeBoxOnRight ? (
                        <Col xs={12} md={5}>
                            <LoginForm
                                toggleHomeComponentOnRight={
                                    toggleHomeBoxPosition
                                }
                            />
                        </Col>
                    ) : (
                        <Col xs={12} md={5}>
                            <RegistrationForm
                                toggleHomeComponentOnRight={
                                    toggleHomeBoxPosition
                                }
                            />
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    );
}

export default HomeScreen;
