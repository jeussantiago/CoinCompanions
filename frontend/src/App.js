import { Container } from "react-bootstrap";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";

function App() {
    return (
        <Router>
            <main className="py-3">
                <Container>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} exact />
                    </Routes>
                </Container>
            </main>
        </Router>
    );
}

export default App;
