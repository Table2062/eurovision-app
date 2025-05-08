import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const LogoutRoute = () => {
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Rimuove token e utente
        navigate('/login'); // Reindirizza al login
    }, [logout, navigate]);

    return null; // Nessun contenuto visibile
};

export default LogoutRoute;