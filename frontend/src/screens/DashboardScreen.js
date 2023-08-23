import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DashboardScreen() {
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        <div>
            <div>DashboardScreen</div>

            <div>hello {userInfo.name}</div>
        </div>
    );
}

export default DashboardScreen;
