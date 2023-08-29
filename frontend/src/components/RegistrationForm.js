import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { register } from "../actions/userActions";
import Message from "../components/Message";
import "../styles/components/LoginRegistrationForm.css";

function RegistrationForm({ toggleHomeComponentOnRight }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const userRegister = useSelector((state) => state.userRegister);
    const { error, loading, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [navigate, userInfo]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        setMessage("")

        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(register(form.name, form.email, form.password));
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center ">
            <div className="login-registration-header">
                <h1>Join Us!</h1>
                Already have an account?{" "}
                <span
                    onClick={toggleHomeComponentOnRight}
                    className="move-home-box-link fw-bolder border-bottom border-dark"
                >
                    Sign In
                </span>
            </div>
            <div className="other-sign-in-options-container">
                <Button
                    type="submit"
                    variant="light"
                    className="w-100 rounded-pill mt-2 fw-bold"
                >
                    Google
                </Button>
            </div>
            <div className="separator-container">
                <div className="line left-line"></div>
                <div className="text">Or sign up with</div>
                <div className="line right-line"></div>
            </div>
            <div className="login-registration-form">
                <Form onSubmit={submitHandler} id="login-form">
                    <Form.Group controlId="name" className="form-group-c">
                        <Form.Label className="fw-bold mb-1">Name</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder="John Smith"
                            name="name"
                            onChange={handleChange}
                            autoComplete="off"
                            className="rounded-pill"
                        ></Form.Control>
                    </Form.Group>

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

                    <Form.Group
                        controlId="passwordConfirm"
                        className="form-group-c"
                    >
                        <Form.Label className="fw-bold mb-1">
                            Confirm Password
                        </Form.Label>
                        <Form.Control
                            required
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
                    >
                        Register
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        {error && (
                            <div className="d-flex flex-row">
                                <Message variant="danger">{error}</Message>
                            </div>
                        )}
                    </Col>
                </Row>

                {message && (
                    <Row className="py-3">
                        <Col>
                            <div className="d-flex flex-row">
                                <Message variant="danger">{message}</Message>
                            </div>
                        </Col>
                    </Row>
                )}

                <Row className="py-3">
                    <Col>{loading && <h3>Loading ...</h3>}</Col>
                </Row>
            </div>
        </Container>
    );
}

export default RegistrationForm;
