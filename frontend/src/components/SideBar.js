import React from "react";
// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function SideBar() {
    const logoutHandler = () => {
        console.log("loggin out");
        // dispatch(logout());
        // navigate("/");
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row ">
                    <div className="col-auto col-sm2 bg-light d-flex flex-column justify-content-between min-vh-100">
                        {/* <div className="mt-2 px-4"> */}
                        <div className="upper-sidebar-content">
                            <div className="text-decoration-none ms-3 d-flex align-itmes-center d-none d-sm-inline">
                                <LinkContainer to="/dashboard">
                                    <h3 className="brand-name">
                                        Coin Companion
                                    </h3>
                                </LinkContainer>
                            </div>
                            <ul
                                className="nav nav-pills flex-column mt-2"
                                id="parentM"
                            >
                                <li className="nav-item">
                                    <LinkContainer
                                        to="/dashboard"
                                        className="nav-link"
                                    >
                                        <div>
                                            <i className="fa-solid fa-tachograph-digital"></i>
                                            <span className="ms-2 d-none d-sm-inline">
                                                Dashboard
                                            </span>
                                        </div>
                                    </LinkContainer>
                                </li>
                                <li className="nav-item">
                                    <LinkContainer
                                        to="/friends"
                                        className="nav-link"
                                    >
                                        <div>
                                            <i className="fas fa-user-friends"></i>
                                            <span className="ms-2 d-none d-sm-inline">
                                                Friends
                                            </span>
                                        </div>
                                    </LinkContainer>
                                </li>
                                <li className="nav-item">
                                    <LinkContainer
                                        to="/groups"
                                        className="nav-link"
                                    >
                                        <div>
                                            <i className="fa-solid fa-users-line"></i>
                                            {/* <i class="fa-solid fa-people-group"></i> */}
                                            <span className="ms-2 d-none d-sm-inline">
                                                Groups
                                            </span>
                                        </div>
                                    </LinkContainer>
                                </li>
                                <li className="nav-item">
                                    <LinkContainer
                                        to="/settings"
                                        className="nav-link"
                                    >
                                        <div>
                                            <i className="fa-solid fa-gear"></i>
                                            <span className="ms-2 d-none d-sm-inline">
                                                Settings
                                            </span>
                                        </div>
                                    </LinkContainer>
                                </li>
                            </ul>
                        </div>
                        <div className="lower-sidebar-content">
                            <div className="text-decoration-none">
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-outline-primary"
                                        type="button"
                                        onClick={logoutHandler}
                                    >
                                        <span className="d-none d-sm-inline">
                                            Logout
                                        </span>
                                        <span className="d-block d-sm-none">
                                            <i className="fa-solid fa-right-from-bracket"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
