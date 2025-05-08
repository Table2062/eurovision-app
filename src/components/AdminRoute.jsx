import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminRoute = ({ children }) => {
    const { token, isAdmin } = useAuthStore();

    if (!token) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/" />;

    return children;
};

export default AdminRoute;