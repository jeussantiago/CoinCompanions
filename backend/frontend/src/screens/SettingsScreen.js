import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Message from "../components/Message";
import AlertMessage from "../components/AlertMessage";
import { updateUserProfile } from "../actions/userActions";
import { USER_PROFILE_UPDATE_RESET } from "../constants/userConstants";

function SettingsScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success: userUpdateProfileSuccess } = userUpdateProfile;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setMessage("");

        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            const updateUserData = {
                name: form.name,
                email: form.email,
                password: form.password,
            };
            dispatch(updateUserProfile(updateUserData));
        }
    };

    const handleShowAlert = useCallback((message, variant) => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, []);

    useEffect(() => {
        if (userUpdateProfileSuccess) {
            handleShowAlert("Successfully updated user profile", "success");
            dispatch({ type: USER_PROFILE_UPDATE_RESET });
        } else if (userUpdateProfileSuccess === false) {
            handleShowAlert(
                "Error occurred while trying to update user profile",
                "danger"
            );
        }
    }, [dispatch, handleShowAlert, userUpdateProfileSuccess]);

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                name: userInfo.name,
                email: userInfo.email,
            }));
        }
    }, [navigate, userInfo]);

    return (
        userInfo && (
            <div className="route-container screen-container d-flex flex-column justify-content-center align-items-center h-100">
                <div className="login-registration-header">
                    <h1>Hello {userInfo.name}!</h1>
                    Thanks for trying us out!{" "}
                    {userInfo && userInfo.is_staff && (
                        <div className="text-danger mt-2">
                            Guest users aren't allowed to update profile data
                        </div>
                    )}
                </div>
                <div className="separator-container mt-4">
                    <div className="line left-line"></div>
                </div>
                <div className="login-registration-form">
                    <Form onSubmit={submitHandler} id="login-form">
                        <Form.Group controlId="name" className="form-group-c">
                            <Form.Label className="fw-bold mb-1">
                                Name
                            </Form.Label>
                            <Form.Control
                                required
                                type="name"
                                placeholder="John Smith"
                                value={form.name}
                                name="name"
                                onChange={handleChange}
                                autoComplete="off"
                                className="rounded-pill"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email" className="form-group-c">
                            <Form.Label className="fw-bold mb-1">
                                Email
                            </Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="E.g. yourname@email.com"
                                value={form.email}
                                name="email"
                                onChange={handleChange}
                                autoComplete="off"
                                className="rounded-pill"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group
                            controlId="password"
                            className="form-group-c"
                        >
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

                        <Form.Group
                            controlId="passwordConfirm"
                            className="form-group-c"
                        >
                            <Form.Label className="fw-bold mb-1">
                                Confirm Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                name="confirmPassword"
                                onChange={handleChange}
                                className="rounded-pill"
                            ></Form.Control>
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100 rounded-pill mt-2"
                            disabled={userInfo && userInfo.is_staff}
                        >
                            {userInfo && userInfo.is_staff
                                ? "Update profile (Guest not allowed)"
                                : "Update profile"}
                        </Button>
                    </Form>

                    {message && (
                        <Row className="py-3">
                            <Col>
                                <div className="d-flex flex-row">
                                    <Message variant="danger">
                                        {message}
                                    </Message>
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>
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

export default SettingsScreen;
