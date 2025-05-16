import {Alert, Box, Button, Paper, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {
    changeUserPassword,
    deleteUser,
    deleteUserVotingResults,
    getAllNonAdminUsers,
    setAwardRanking
} from "../api/adminApi";
import useAuthStore from "../store/authStore";
import {useNavigate} from "react-router-dom";

const UtilsPanel = () => {
    const {token} = useAuthStore();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const [error4, setError4] = useState('');
    const [deleteVoteCategory, setDeleteVoteCategory] = useState('');
    const [deleteVoteUsername, setDeleteVoteUsername] = useState('');
    const [changePasswordUsername, setChangePasswordUsername] = useState('');
    const [changePasswordPassword, setChangePasswordPassword] = useState('');
    const [deleteUserUsername, setDeleteUserUsername] = useState('');
    const navigate = useNavigate();

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
            setError('')
        } catch (error) {
            setError(error.message);
        }
    }

    const handleDeleteVote = async (category, username) => {
        try {
            await deleteUserVotingResults(token, category, username);
            setDeleteVoteCategory('');
            setDeleteVoteUsername('');
            setError2('');
        } catch (error) {
            setError2(error.message);
        }
    }

    const handleChangePassword = async (username, password) => {
        try {
            await changeUserPassword(token, username, password);
            setChangePasswordUsername('');
            setChangePasswordPassword('');
            setError3('');
        } catch (error) {
            setError3(error.message);
        }
    }

    const handleDeleteUser = async (username) => {
        try {
            await deleteUser(token, username);
            setDeleteUserUsername('');
            setError4('');
            fetchUsers();
        } catch (error) {
            setError4(error.message);
        }
    }

    return <>
        <Box display="flex" width="100%" minHeight="95vh">
            <Paper sx={{flex: 1, p: 2}}>
                <Typography mb={2} key="enable-award" variant="h5">Abilita utenti alla classifica premi</Typography>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <Box display="flex" flexDirection="column" gap={2}>
                    {users.map((user) => (
                        <Box mt={1} key={user.username} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1">{user.username} - {user.country}</Typography>
                            {!user.awardRankingEnabled && <Button variant="outlined" onClick={() => handleAwardRankingToggle(user.username, true)}>Abilita</Button>}
                            {user.awardRankingEnabled && <Button variant="outlined" onClick={() => handleAwardRankingToggle(user.username, false)}>Disabilita</Button>}
                        </Box>
                    ))}
                </Box>
            </Paper>
            <Paper sx={{flex: 1, p: 2}}>
                <Typography mb={2} key="delete-votes" variant="h5">Elimina la votazione di un utente</Typography>
                {error2 && <Alert severity="error" sx={{mb: 2}}>{error2}</Alert>}
                <Box width="100%">
                    <TextField fullWidth placeholder="Categoria di voto" value={deleteVoteCategory} onChange={(e) => setDeleteVoteCategory(e.target.value)}/>
                    <TextField style={{marginTop: "5px"}} fullWidth placeholder="Nome utente" value={deleteVoteUsername} onChange={(e) => setDeleteVoteUsername(e.target.value)}/>
                    <Button style={{marginTop: "5px"}} fullWidth variant="outlined" onClick={() => handleDeleteVote(deleteVoteCategory, deleteVoteUsername)}>Elimina</Button>
                </Box>
            </Paper>
            <Paper sx={{flex: 1, p: 2}}>
                <Typography mb={2} key="change-password" variant="h5">Cambia password utente</Typography>
                {error3 && <Alert severity="error" sx={{mb: 2}}>{error3}</Alert>}
                <Box width="100%">
                    <TextField name="changePasswordU" fullWidth placeholder="Nome utente" value={changePasswordUsername}
                               onChange={(e) => setChangePasswordUsername(e.target.value)}/>
                    <TextField name="changePasswordP" style={{marginTop: "5px"}} fullWidth placeholder="Password"
                               type="password" value={changePasswordPassword}
                               onChange={(e) => setChangePasswordPassword(e.target.value)}/>
                    <Button style={{marginTop: "5px"}} fullWidth variant="outlined"
                            onClick={() => handleChangePassword(changePasswordUsername, changePasswordPassword)}>Cambia
                        password</Button>
                </Box>
                <br/><br/>
                <Typography mb={2} key="delete-user" variant="h5">Elimina utente</Typography>
                {error4 && <Alert severity="error" sx={{mb: 2}}>{error4}</Alert>}
                <Box width="100%">
                    <TextField name="deleteUserU" fullWidth placeholder="Nome utente" value={deleteUserUsername}
                               onChange={(e) => setDeleteUserUsername(e.target.value)}/>
                    <Button style={{marginTop: "5px"}} fullWidth variant="outlined"
                            onClick={() => handleDeleteUser(deleteUserUsername)}>Elimina utente</Button>
                </Box>
                <br/><br/>
                <Typography mb={2} key="logout" variant="h5">Logout</Typography>
                <Box width="100%">
                    <Button style={{marginTop: "5px"}} fullWidth variant="outlined"
                            onClick={() => navigate('/logout')}>Logout</Button>
                </Box>
            </Paper>
        </Box>
    </>
}

export default UtilsPanel;