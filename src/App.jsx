import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
// import VotePage.jsx from './pages/VotePage.jsx';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import RedirectFromRoot from './components/RedirectFromRoot';
import LogoutRoute from "./components/LogoutRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Footer from "./components/Footer";
import {Box} from "@mui/material";
import VotePage from "./pages/VotePage";

function App() {
    return (
        <>
            <Box display="flex"
                 flexDirection="column"
                 minHeight="100vh">
                <Router>
                    <Routes>
                        <Route path="/" element={<RedirectFromRoot />}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/logout" element={<LogoutRoute/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/vote" element={
                            <PrivateRoute>
                                {<VotePage/>}
                            </PrivateRoute>
                        }/>
                        <Route path="/admin" element={
                            <AdminRoute>
                                {<AdminDashboardPage/>}
                            </AdminRoute>
                        }/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </Router>
            </Box>
            <Footer/>
        </>
    );
}

export default App;
