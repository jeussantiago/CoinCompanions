// GoogleLoginButton.js
import React from "react";
import { Button } from "react-bootstrap";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
function GoogleLoginButton() {
    // Your Google API Client ID

    window.onload = () => {
        // Load and initialize gapi
        window.gapi.load("auth2", () => {
            window.gapi.auth2.init({
                client_id: CLIENT_ID,
            });
        });
    };

    const handleGoogleLogin = () => {
        console.log("hello");
        const auth2 = window.gapi.auth2.getAuthInstance();

        auth2
            .signIn()
            .then((googleUser) => {
                const idToken = googleUser.getAuthResponse().id_token;
                console.log("user idToken: ", idToken);
                // Send the `idToken` to your server for verification
                // Your server should verify the token with Google and log in or create a user as needed
                // You can use a library like `google-auth-library` on your server for this purpose
            })
            .catch((error) => {
                // Handle the error here
                console.error("Google Sign-In Error: ", error);
            });
    };

    return (
        <div>
            <Button
                type="submit"
                variant="dark"
                onClick={handleGoogleLogin}
                className="w-100 rounded-pill mt-2 fw-bold"
            >
                Google
            </Button>
        </div>
    );
}

export default GoogleLoginButton;
