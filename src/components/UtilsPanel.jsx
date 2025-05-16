import {Alert, Box, Paper, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {getAllNonAdminUsers, setAwardRanking} from "../api/adminApi";
import useAuthStore from "../store/authStore";

const UtilsPanel = () => {
    const {token} = useAuthStore();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const data = await getAllNonAdminUsers(token);
            setUsers(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAwardRankingToggle = async (username, enabled) => {
        try {
            await setAwardRanking(token, username, enabled);
            fetchUsers();
        } catch (error) {
            setError(error.message);
        }
    }

    return <>
        <Box display="flex" width="100%" minHeight="95vh">
            <Paper sx={{flex: 1, p: 2}}>
                <Typography mb={2} key="final-score-general" variant="h5">Abilita utenti alla classifica premi</Typography>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <Box display="flex" flexDirection="column" gap={2}>
                    {users.map((user) => (
                        <Box mt={1} key={user.username} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1">{user.username} - {user.country}</Typography>
                            {!user.awardRankingEnabled && <button onClick={() => handleAwardRankingToggle(user.username, true)}>Abilita</button>}
                            {user.awardRankingEnabled && <button onClick={() => handleAwardRankingToggle(user.username, false)}>Disabilita</button>}
                        </Box>
                    ))}
                </Box>
            </Paper>
            <Paper sx={{flex: 1, p: 2}}></Paper>
            <Paper sx={{flex: 1, p: 2}}></Paper>
            <Paper sx={{flex: 1, p: 2}}></Paper>
        </Box>
    </>
}

export default UtilsPanel;