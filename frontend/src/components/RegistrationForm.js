import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { register } from "../actions/userActions";
import Message from "../components/Message";

function RegistrationForm({ toggleHomeComponentOnRight }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const userRegister = useSelector((state) => state.userRegister);
    const { error, loading, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(register(name, email, password));
        }
    };

    return (
        <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
            <div>
                <h1>Register</h1>
            </div>
            <div className="login-register-form">
                <Form onSubmit={submitHandler} id="login-form">
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="passwordConfirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Register
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        Existing Customer? Sign In (pass parameter to
                        Registrations)
                        <Button
                            variant="warning"
                            onClick={toggleHomeComponentOnRight}
                        >
                            Sign in
                        </Button>
                    </Col>
                </Row>

                <Row className="py-3">
                    <Col>
                        {error && (
                            <div className="w-50 d-flex flex-row">
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
