import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import SideBar from "./components/SideBar";

import DashboardScreen from "./screens/DashboardScreen";
import FriendsScreen from "./screens/FriendsScreen";
import GroupsScreens from "./screens/GroupsScreens";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

function App() {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    return (
        <Router>
            <div className="d-flex flex-row">
                {/* Don't show the Sidebar on the log in/home page */}
                {userInfo && <SideBar />}
                <main>
                    <Container>
                        <Routes>
                            <Route path="/" element={<HomeScreen />} exact />
                            <Route
                                path="/dashboard"
                                element={<DashboardScreen />}
                                exact
                            />
                            <Route
                                path="/friends"
                                element={<FriendsScreen />}
                                exact
                            />
                            <Route
                                path="/groups"
                                element={<GroupsScreens />}
                                exact
                            />
                            <Route
                                path="/settings"
                                element={<SettingsScreen />}
                                exact
                            />
                        </Routes>
                    </Container>
                </main>
            </div>
        </Router>
    );
}

export default App;
