import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import "../styles/screens/HomeScreen.css";

function HomeScreen() {
    const [homeComponentOnRight, setHomeComponentOnRight] = useState(true);
    const [homeComponentClass, setHomeComponentClass] = useState(
        "home position-absolute top-0 end-0 bg-primary"
    );

    const toggleHomeComponentOnRight = () => {
        if (homeComponentOnRight) {
            setHomeComponentClass(
                "home position-absolute top-0 start-0 bg-primary"
            );
        } else {
            setHomeComponentClass(
                "home position-absolute top-0 end-0 bg-primary"
            );
        }

        setHomeComponentOnRight(!homeComponentOnRight);
    };

    // const [homeComponentClass, setHomeComponentClass] = useState(
    //     "home unclicked bg-primary"
    // );

    // const toggleHomeComponentOnRight = () => {
    //     if (homeComponentOnRight) {
    //         setHomeComponentClass("home clicked bg-primary");
    //     } else {
    //         setHomeComponentClass("home unclicked bg-primary");
    //     }

    //     setHomeComponentOnRight(!homeComponentOnRight);
    // };

    return (
        <div>
            <div className="d-none d-md-inline">
                <div className={homeComponentClass}>
                    <p>
                        Home Page <br />
                        Info Section <br />
                        logo/image
                    </p>
                </div>
            </div>
            <Row className="justify-content-between min-vw-100 min-vh-100">
                <Col
                    xs={12}
                    md={5}
                    className="home-form mt-3 border border-primary"
                >
                    <LoginForm
                        toggleHomeComponentOnRight={toggleHomeComponentOnRight}
                    />
                </Col>
                <Col
                    xs={12}
                    md={5}
                    className="home-form mt-3 border border-primary"
                >
                    <RegistrationForm
                        toggleHomeComponentOnRight={toggleHomeComponentOnRight}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default HomeScreen;
