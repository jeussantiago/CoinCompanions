import React, { useEffect, useState } from "react";
// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

import { logout } from "../actions/userActions";
import logo from "../images/small-logo.png";
import "../styles/components/SideBar.css";

function SideBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
    const [menu_class, setMenuClass] = useState("menu hidden");
    const [isMenuClicked, setIsMenuClicked] = useState(false);

    // toggle burger menu change
    const updateMenu = () => {
        if (!isMenuClicked) {
            setBurgerClass("burger-bar clicked");
            setMenuClass("menu visible");
        } else {
            setBurgerClass("burger-bar unclicked");
            setMenuClass("menu hidden");
        }
        setIsMenuClicked(!isMenuClicked);
    };

    // Show sidebar when screen size is not tablet size
    // returns a function to cleanup/remove event listener
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setBurgerClass("burger-bar unclicked");
                setMenuClass("menu hidden");
                setIsMenuClicked(false);
            } else if (window.innerWidth >= 768) {
                setBurgerClass("burger-bar clicked");
                setMenuClass("menu visible");
                setIsMenuClicked(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const logoutHandler = () => {
        // console.log("loggin out");
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="sidebar">
            <div className="burger-container d-block d-md-none">
                <div className="burger-box" onClick={updateMenu}>
                    <div className="burger-menu">
                        <div className={burger_class}></div>
                        <div className={burger_class}></div>
                        <div className={burger_class}></div>
                    </div>
                </div>
            </div>
            <div className={menu_class}>
                <div className="container-fluid">
                    <div className="row ">
                        <div className="col-auto col-sm2 bg-light d-flex flex-column justify-content-between min-vh-100">
                            <div className="upper-sidebar-content">
                                <div className="text-decoration-none ms-3 d-flex align-itmes-center d-none d-sm-inline">
                                    <LinkContainer to="/dashboard">
                                        <div className="brand-name-container">
                                            <h3 className="brand-name">
                                                Coin{" "}
                                                <img
                                                    src={logo}
                                                    alt="Logo"
                                                    className="logo-image"
                                                />{" "}
                                            </h3>
                                            <h3 className="brand-name">
                                                Companion
                                            </h3>
                                        </div>
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
        </div>
    );
}

export default SideBar;
