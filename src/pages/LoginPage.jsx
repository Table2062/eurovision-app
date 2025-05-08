import React, {useEffect, useState} from 'react';
import {Container, TextField, Button, Typography, Box, Alert} from '@mui/material';
import {useForm} from 'react-hook-form';
import * as yup from 'yup'; // Yup per validazione
import useAuthStore from '../store/authStore';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {login} from '../api/authApi'; // API di login
import {yupResolver} from '@hookform/resolvers/yup';

// Schema di validazione con Yup
const validationSchema = yup.object({
    username: yup.string().required('Nome utente obbligatorio'),
    password: yup.string().required('Password obbligatoria')
});

const LoginPage = () => {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    });
    const loginStore = useAuthStore((state) => state.login);
    const { token, isAdmin } = useAuthStore();
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            navigate(isAdmin ? '/admin' : '/vote');
        }
    }, [token, isAdmin, navigate]);

    const onSubmit = async (data) => {
        try {
            const response = await login(data.username, data.password);
            const token = response.token;
            const decoded = jwtDecode(token);
            loginStore(token, decoded.isAdmin);
            navigate(decoded.isAdmin ? '/admin' : '/vote');
        } catch (err) {
            setError('Login fallito. Controlla nome utente e password.');
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Container maxWidth="sm">
                <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
                    <Typography variant="h4" align="center" gutterBottom>Login</Typography>

                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="Nome utente"
                            fullWidth
                            margin="normal"
                            {...register('username')}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{mt: 2}}>
                            Accedi
                        </Button>
                        <Button onClick={() => navigate('/register')} variant="outlined" fullWidth sx={{mt: 2}}>
                            Non hai un account? Registrati
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;