import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../../actions/userActions";
import Message from "../Message";
import logo from "../../images/small-logo.png";
import "../../styles/components/LoginRegistrationForm.css";

function LoginForm({ toggleHomeComponentOnRight }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [navigate, userInfo]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleGuestLogin = (e) => {
        e.preventDefault();
        dispatch(
            login(
                process.env.REACT_APP_GUEST_EMAIL,
                process.env.REACT_APP_GUEST_PASS
            )
        );
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(form.email, form.password));
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div>
                <img src={logo} alt="Logo" className="home-screen-logo-image" />
            </div>
            <div className="login-registration-header text-dark-emphasis">
                <h1>Welcome!</h1>
                Don't have an account yet?{" "}
                <span
                    onClick={toggleHomeComponentOnRight}
                    className="move-home-box-link text-dark fw-bolder border-bottom border-dark"
                >
                    Register
                </span>
            </div>
            <div className="other-sign-in-options-container">
                <p className="text-center text-dark-emphasis">
                    Don't feel like creating a new account? Try out our app with
                    a guest account
                </p>
                <Button
                    type="submit"
                    variant="dark"
                    onClick={handleGuestLogin}
                    className="w-100 rounded-pill mt-2 fw-bold"
                >
                    Guest login
                </Button>
            </div>
            <div className="separator-container">
                <div className="line left-line"></div>
                <div className="text">Or sign in with</div>
                <div className="line right-line"></div>
            </div>
            <div className="login-registration-form">
                <Form onSubmit={submitHandler} id="login-form">
                    <Form.Group controlId="email" className="form-group-c">
                        <Form.Label className="fw-bold mb-1">Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="E.g. yourname@email.com"
                            name="email"
                            onChange={handleChange}
                            autoComplete="off"
                            className="rounded-pill"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" className="form-group-c">
                        <Form.Label className="fw-bold mb-1">
                            Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            onChange={handleChange}
                            className="rounded-pill"
                        ></Form.Control>
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100 rounded-pill mt-2"
                    >
                        Sign in
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        {error && (
                            <div className="d-flex flex-row">
                                <Message variant="danger">
                                    {"User not found"}
                                </Message>
                            </div>
                        )}
                    </Col>
                </Row>
                <Row className="py-3">
                    <Col>{loading && <h3>Loading ...</h3>}</Col>
                </Row>
            </div>
        </div>
    );
}

export default LoginForm;
