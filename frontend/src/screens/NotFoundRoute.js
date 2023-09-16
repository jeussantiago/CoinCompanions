import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import notFoundImage from "../images/page-not-found.png";

function NotFoundRoute() {
    const navigate = useNavigate();

    const handleGoBackButton = () => {
        navigate("/dashboard");
    };
    return (
        <div className="page-not-found-screen h-100 d-flex flex-row justify-content-center">
            <img src={notFoundImage} alt="page not found" className="h-100" />
            <Button
                onClick={handleGoBackButton}
                className="page-not-found-image"
            >
                {"<"} Go Back
            </Button>
        </div>
    );
}

export default NotFoundRoute;
