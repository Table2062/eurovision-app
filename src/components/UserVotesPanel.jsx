import React, {useEffect, useState} from "react";
import {
    Box, Typography, IconButton, List, ListItem, ListItemText, Button,
} from "@mui/material";
import {getUserVotingResults, revealVote} from "../api/adminApi";
import useAuthStore from "../store/authStore";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {getFlagEmoji} from "../utils/flagUtils";

const UserVotesPanel = ({category, username, onClose, onVoteRevealed}) => {
    const [votes, setVotes] = useState([]);
    const {token} = useAuthStore();

    useEffect(() => {
        getUserVotingResults(token, category, username).then(setVotes);
    }, [category, username]);

    const handleReveal = async (points) => {
        await revealVote(token, username, category, points);
        onVoteRevealed(); // trigger update in CategoryPanel
        // Refresh local votes
        getUserVotingResults(token, category, username).then(setVotes);
    };

    return (
        <>
            <Box display="flex" alignItems="center">
                <Typography variant="h5"><IconButton onClick={onClose} style={{padding: "0", marginBottom: "5px"}}><ArrowBackIcon/></IconButton>Voti di {username}</Typography>
            </Box>
            <List>
                {votes && votes.countryResults && votes.countryResults.sort((a,b) => b.points - a.points).map(({country, points, revealed}, index) => (
                    <ListItem key={country.name} secondaryAction={!revealed && (
                        <Button variant="outlined" size="small" onClick={() => handleReveal(points)}>
                            Rivela
                        </Button>
                    )
                    }>
                        <ListItemText
                            primary={revealed ? `${index + 1}. ${getFlagEmoji(country.isoCode)} ${country.label}` : "-"}
                            secondary={points + " punt" + (points > 1 ? "i" : "o")}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default UserVotesPanel;