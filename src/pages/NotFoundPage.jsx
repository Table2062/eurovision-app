import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotFoundImage from '../assets/404-image.jpg';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Box>
                <img src={NotFoundImage} alt="Pagina non trovata" style={{ width: '100%', height: 'auto' }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>
                    Oops! Pagina non trovata
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    La pagina che stai cercando non esiste. Torna alla home per continuare.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoHome}>
                    Torna alla Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;