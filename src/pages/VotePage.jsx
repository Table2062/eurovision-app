import {useEffect, useState} from "react";
import {getOpenCategory} from "../api/votesApi";
import {Box, Container, Typography} from "@mui/material";
import useAuthStore from "../store/authStore";
import {useNavigate} from "react-router-dom";

const VotePage = () => {
    const navigate = useNavigate();
    const {token, isAdmin} = useAuthStore();
    const [category, setCategory] = useState('');
    const [noCategory, setNoCategory] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin');
        }

        const fetchOpenCategory = async () => {
            try {
                const data = await getOpenCategory(token);
                setCategory(data);
            } catch (err) {
                if (err.message == 'NO_CATEGORY') {
                    setNoCategory(true);
                } else {
                    navigate('/logout');
                }
            }
        };
        fetchOpenCategory();
    }, []);


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Container maxWidth="sm">
                <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
                    {
                        noCategory && (
                            <>
                                <Typography noCategory={false} variant="h4" align="center" gutterBottom>Hey, so che non
                                    vedi l'ora ma le votazioni non
                                    sono ancora aperte!</Typography>
                                <Typography noCategory={true} variant="h4" align="center" gutterBottom>Torna sabato 17
                                    maggio 2025 alle 18:00
                                    😉</Typography>
                            </>
                        )
                    }
                </Box>
            </Container>
        </Box>
    );
}

export default VotePage;