import React, { useEffect, useState } from "react";
import {
    Container,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Snackbar,
    Alert,
    Box
} from "@mui/material";
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import { getAllCountries, register } from "../api/authApi";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { getFlagEmoji } from "../utils/flagUtils";

const validationSchema = yup.object({
    username: yup.string().required('Nome utente obbligatorio'),
    email: yup.string().email('Email non valida'),
    password: yup.string().min(6, 'La password deve contenere almeno 6 caratteri').required('Password obbligatoria'),
    assignedCountry: yup.string().required('Seleziona una nazione')
});

const RegisterPage = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [error, setError] = useState('');

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getAllCountries(true);
                setCountries(data.countries);
            } catch (err) {
                setError("Errore nel recupero delle nazioni!");
            }
        };
        fetchCountries();
    }, []);

    const onSubmit = async (data) => {
        try {
            await register(data.username.trim(), data.email.trim(), data.password, data.assignedCountry);
            setSnackbarOpen(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError("Registrazione fallita!");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Container maxWidth="sm">
                <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
                    <Typography variant="h4" align="center" gutterBottom>Registrazione</Typography>

                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nome Utente"
                            {...formRegister('username')}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            {...formRegister('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            type="password"
                            label="Password"
                            {...formRegister('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <FormControl fullWidth margin="normal" error={!!errors.assignedCountry}>
                            <InputLabel>Nazione</InputLabel>
                            <Select
                                label="Nazione"
                                defaultValue=""
                                {...formRegister('assignedCountry')}
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country.name} value={country.name}>
                                        {getFlagEmoji(country.isoCode)} {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Registrati
                        </Button>
                        <Button onClick={() => navigate('/login')} variant="outlined" fullWidth sx={{mt: 2}}>
                            Torna al Login
                        </Button>
                    </form>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                    >
                        <Alert severity="success" sx={{ width: '100%' }}>
                            Registrazione completata! Reindirizzamento al login...
                        </Alert>
                    </Snackbar>
                </Box>
            </Container>
        </Box>
    );
};

export default RegisterPage;