import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../actions/userActions";
import Message from "../components/Message";
import "../styles/components/LoginForm.css";

function LoginForm({ toggleHomeComponentOnRight }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Container className="h-100 d-flex flex-column justify-content-center align-items-center ">
            <div>
                <h1>Login</h1>
            </div>
            <div className="login-form">
                <Form onSubmit={submitHandler} id="login-form">
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

                    <Button type="submit" variant="primary">
                        Sign in
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        New Customer? Register (pass parameter to Registrations)
                        <Button onClick={toggleHomeComponentOnRight}>
                            Register
                        </Button>
                    </Col>
                </Row>
                <Row className="py-3">
                    <Col>
                        {error && (
                            <div className="w-50 d-flex flex-row">
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
        </Container>
        // </div>
    );
}

export default LoginForm;
