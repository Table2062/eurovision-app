import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Typography
} from "@mui/material";
import UserVotesPanel from "./UserVotesPanel";
import {closeVoting, getUsersThatVoted, getVotingResults, openVoting} from "../api/adminApi";
import useAuthStore from "../store/authStore";
import RefreshIcon from '@mui/icons-material/Refresh';
import {getFlagEmoji} from "../utils/flagUtils";

const CategoryPanel = ({category}) => {
    const [voteStatus, setVoteStatus] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [votingResults, setVotingResults] = useState({});
    const {token} = useAuthStore();
    const [limit, setLimit] = useState(category.limit);

    const fetchVoteStatus = async () => {
        const data = await getUsersThatVoted(token, category.name);
        setVoteStatus(data);
    };

    const fetchVotingResults = async (newLimit) => {
        const results = await getVotingResults(token, category.name, newLimit);
        setVotingResults(results);
    };

    const handleVoteRevealed = () => {
        const fetchVotingResults = async (newLimit) => {
            const results = await getVotingResults(token, category.name, newLimit);
            setVotingResults(results);
        };
        fetchVotingResults(limit); // aggiorna la classifica al voto rivelato
    };

    const handleOpenVoting = () => {
        const callOpenVoting = async () => {
            try {
                await openVoting(token, category.name);
                fetchVoteStatus();
            } catch (error) {
                console.error("Errore nell'aprire la votazione:", error);
            }
        }
        callOpenVoting();
    }

    const handleCloseVoting = () => {
        const callCloseVoting = async () => {
            try {
                await closeVoting(token, category.name);
                fetchVoteStatus();
            } catch (error) {
                console.error("Errore nella chiusura della votazione:", error);
            }
        }
        callCloseVoting();
    }

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        fetchVotingResults(event.target.value);
    }

    useEffect(() => {
        fetchVotingResults(limit);
        fetchVoteStatus()
    }, []);

    return (
        <Box display="flex" width="100%" minHeight="95vh">
            <Paper sx={{flex: 1, p: 2}}>
                <Box alignItems="center" p={2}>
                    <Typography variant="h5">{category.label}{votingResults.completed ? " (completa)" : ""}
                        <IconButton onClick={() => fetchVotingResults(limit)} style={{marginBottom: "5px"}}>
                            <RefreshIcon/>
                        </IconButton>
                    </Typography>
                    <List>
                        {votingResults.countryResults && votingResults.countryResults.map((entry, index) => (
                            <ListItem key={entry.country.name}>
                                <ListItemText
                                    primary={`${index + 1}. ${getFlagEmoji(entry.country.isoCode)} ${entry.country.label}`}
                                    secondary={`Punti: ${entry.points}`}/>
                            </ListItem>
                        ))}
                    </List>
                    {!voteStatus.open ? <>
                        {!votingResults.completed && (
                            <Button width="25%" onClick={() => handleOpenVoting()} variant="outlined" sx={{mt: 2}}>
                                Avvia votazione
                            </Button>)}</>
                        : <Button width="25%" onClick={() => handleCloseVoting()} variant="outlined" sx={{mt: 2}}>
                            Chiudi votazione
                        </Button>
                    }
                </Box>
                <Box width="25%" p={2}>
                    <Select
                        fullWidth
                        labelId="limit-select-label"
                        id="limit-select"
                        value={limit}
                        label="Limit"
                        onChange={handleLimitChange}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={99}>ALL</MenuItem>
                    </Select>
                </Box>
            </Paper>
            <Paper sx={{flex: 1, p: 2}}>
                <Box p={2}>
                    {!selectedUser && (
                        <Box alignItems="center">
                            <Typography variant="h5">Utenti che hanno votato
                                <IconButton onClick={() => fetchVoteStatus()} style={{marginBottom: "5px"}}>
                                    <RefreshIcon/>
                                </IconButton>
                            </Typography>
                            <List>
                                {voteStatus && voteStatus.voters && voteStatus.voters.map((username) => (
                                    <ListItem button key={username} onClick={() => setSelectedUser(username)}>
                                        <ListItemText primary={username}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    {selectedUser && (
                        <UserVotesPanel
                            category={category.name}
                            username={selectedUser}
                            onClose={() => setSelectedUser(null)}
                            onVoteRevealed={handleVoteRevealed}
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default CategoryPanel;