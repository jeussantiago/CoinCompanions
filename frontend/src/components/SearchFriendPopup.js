import React, { useEffect, useState } from "react";
import { Modal, Button, FormControl, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../styles/screens/FriendsScreen.css";

import { getUserFriendSearch } from "../actions/userActions";
import AlertMessage from "./AlertMessage";

function SearchFriendPopup({ show, onClose }) {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userFriendSearchResults = useSelector(
        (state) => state.userFriendSearch
    );
    const { userFriendSearch } = userFriendSearchResults;

    const handleClose = () => {
        setSearchTerm("");
        onClose();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSendFriendRequest = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.post(
                `/api/users/friend-requests/send/${id}/`,
                {},
                config
            );
            // console.log(response.status);
            if (response.status === 201) {
                // If the request was successful, return "success"
                handleShowAlert("Friend request sent successfully!", "success");
            } else {
                handleShowAlert(
                    "An error occurred. Please try again.",
                    "danger"
                );
            }
        } catch (err) {
            const err_message =
                err.response && err.response.data.detail
                    ? err.response.data.detail
                    : err.message;
            handleShowAlert(err_message, "danger");
        }
    };

    const handleShowAlert = (message, variant) => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000); // Hide the alert after 3 seconds
    };

    useEffect(() => {
        dispatch(getUserFriendSearch(searchTerm));
    }, [dispatch, searchTerm]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Search Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-3"
                />
                <ListGroup className="search-results-container">
                    {userFriendSearch.map((friend) => (
                        <ListGroup.Item key={friend.id}>
                            <div className="d-flex flex-row justify-content-between">
                                <div className="d-flex align-items-center">
                                    {friend.email}
                                </div>
                                <Button
                                    onClick={() =>
                                        handleSendFriendRequest(friend.id)
                                    }
                                >
                                    Send friend request
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
            {showAlert && (
                <AlertMessage message={alertMessage} variant={alertVariant} />
            )}
        </Modal>
    );
}

export default SearchFriendPopup;
