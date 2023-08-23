import React from "react";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { getAllUsers } from "../actions/userActions";

function HomeScreen() {
    // const dispatch = useDispatch();

    // const userList = useSelector((state) => state.userList);
    // const { loading, error, users } = userList;
    // console.log(users);

    // useEffect(() => {
    //     dispatch(getAllUsers());
    // }, [dispatch]);
    return (
        <div>
            <div>home page</div>

            <div>Login and Register Page</div>

            {/* {loading ? (
                <div> Getting all users ....</div>
            ) : error ? (
                <div> Error occured getting users </div>
            ) : (
                <div>
                    {users.map((user) => (
                        <div key={user.id}>{user.username}</div>
                    ))}
                </div>
            )} */}
        </div>
    );
}

export default HomeScreen;
