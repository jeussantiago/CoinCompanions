import React from "react";
import { Alert } from "react-bootstrap";

function AlertMessage({ message, variant }) {
    return (
        <div className="text-center">
            <Alert variant={variant} className="fixed-top w-100">
                {message}
            </Alert>
        </div>
    );
}

export default AlertMessage;
