import { Container } from "react-bootstrap";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import SideBar from "./components/SideBar";

import DashboardScreen from "./screens/DashboardScreen";
import FriendsScreen from "./screens/FriendsScreen";
import GroupsScreens from "./screens/GroupsScreens";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

function App() {
    return (
        <Router>
            {/* { isAuthenticated && <SideBar /> } */}
            <div className="d-flex flex-row">
                <SideBar />
                <main className="py-3">
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
