// GoogleLoginButton.js
import React from "react";
import { GoogleLogin } from "react-google-login";
import { googleLogin } from "../../actions/userActions";

function GoogleLoginButton() {
    // Your Google API Client ID
    const CLIENT_ID = "YOUR_CLIENT_ID";

    const responseGoogle = (response) => {
        // Handle the Google response here
        if (response.profileObj) {
            console.log(response.profileObj);
            // onSuccess(response.profileObj);
            // dispatch(googleLogin(response.profileObj.tokenId))
        } else {
            console.log(response.error);
            // onFailure(response.error);
            // throw error alert message
        }
    };

    return (
        <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Sign in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
        />
    );
}

export default GoogleLoginButton;
