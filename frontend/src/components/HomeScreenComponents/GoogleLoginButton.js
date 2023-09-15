// GoogleLoginButton.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// import { googleLogin } from "../../actions/userActions";
import { Button } from "react-bootstrap";
// dispatch(googleLogin(response.profileObj.tokenId))

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// console.log("client_id: ", CLIENT_ID);
function GoogleLoginButton() {
    // Your Google API Client ID

    // const userLogin = useSelector((state) => state.userLogin);
    // const { userInfo } = userLogin;

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

    // const onSignIn = (googleUser) => {
    //     var profile = googleUser.getBasicProfile();
    //     console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     console.log("Name: " + profile.getName());
    //     console.log("Image URL: " + profile.getImageUrl());
    //     console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    // };

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
            {/* <div className="g-signin2" data-onsuccess={onSignIn}>
                google sign in from site
            </div> */}
        </div>
    );
}

export default GoogleLoginButton;
