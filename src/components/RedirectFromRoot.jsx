import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RedirectFromRoot = () => {
    const { token, isAdmin } = useAuthStore();
    return <Navigate to={!token ? '/login' : (isAdmin ? '/admin' : '/vote')} replace />;
};

export default RedirectFromRoot;