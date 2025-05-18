import React, {useEffect, useState} from "react";
import {getAvailableCountries, getOpenCategory, submitVotes} from "../api/votesApi";
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Typography
} from "@mui/material";
import useAuthStore from "../store/authStore";
import {useNavigate} from "react-router-dom";
import {getFlagEmoji} from "../utils/flagUtils";
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    IconButton, Tooltip
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

const VotePage = () => {
    const navigate = useNavigate();
    const {token} = useAuthStore();
    const [category, setCategory] = useState(null);
    const [noCategory, setNoCategory] = useState(false);
    const [alreadyVoted, setAlreadyVoted] = useState(false);
    const [availableCountries, setAvailableCountries] = useState([]);
    const [votes, setVotes] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [triggerFetchCategory, setTriggerFetchCategory] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [rulesOpen, setRulesOpen] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await getOpenCategory(token);
                setCategory(data);
                setNoCategory(false);
                setAlreadyVoted(false);
                setError('');
                setSuccessMessage('');
                setVotes([]);
            } catch (err) {
                if (err.message === 'NO_CATEGORY') {
                    setNoCategory(true);
                } else if (err.message === 'ALREADY_VOTED') {
                    setAlreadyVoted(true);
                    setNoCategory(false);
                    setCategory({name: err.message, label: "Hai già votato!"});
                    setVotes([])
                    setCategory(null)
                } else {
                    navigate('/logout');
                }
            }
        };
        fetchCategory();
    }, [navigate, token, triggerFetchCategory]);

    useEffect(() => {
        if (category && category.votePoints && category.votePoints.length > 0) {
            getAvailableCountries(token, category.name)
                .then(data => {
                    setAvailableCountries(data.countries);
                }).catch(err => {
                setAvailableCountries([]);
                setError("Errore nel recupero delle nazioni disponibili!");
            });
        }
    }, [category, token]);

    const isVoteValid = () => {
        return (
            votes.length === category.votePoints.length &&
            votes.every(v => v.country && v.country !== '')
        );
    };

    const onSubmit = async () => {
        try {
            await submitVotes(token, category.name, votes);
            setCategory(null)
            setAlreadyVoted(true);
            setVotes([]); // reset selezioni
            setSuccessMessage("Votazione inviata con successo! 🎉");
            setError('')
        } catch (err) {
            setError("Votazione fallita!");
            setSuccessMessage('');
        }
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Container maxWidth="sm">
                    <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
                        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                            <IconButton display="flex" justifyContent="flex-start" onClick={() => navigate('/logout')}>
                                <LogoutIcon/>
                            </IconButton>
                            <Tooltip title="Regole punteggio">
                                <IconButton onClick={() => setRulesOpen(true)}>
                                    <InfoIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {
                            alreadyVoted && (
                                <>
                                    <Typography variant="h4" align="center" gutterBottom>Hai votato per la categoria
                                        corrente!</Typography>
                                    <Typography variant="h4" align="center"> Attendi l'apertura della prossima categoria o
                                        segui l'aggiornamento delle
                                        classifiche.</Typography>
                                    <Box mt={4} textAlign="center">
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setTriggerFetchCategory(!triggerFetchCategory);
                                            }}
                                        >
                                            Aggiorna
                                        </Button>
                                        <Typography mt={2} variant="body1" align="center" gutterBottom>
                                            Clicca AGGIORNA non appena ti verrà comunicato che è stata aperta una nuova
                                            votazione.
                                        </Typography>
                                    </Box>
                                </>
                            )
                        }
                        {
                            noCategory && (
                                <>
                                    <Typography variant="h4" align="center" gutterBottom>Grazie per aver partecipato alle votazioni per l'Eurovision 2025 ❤️</Typography>
                                    {
                                        false && (
                                            <>formRegister
                                                <Box mt={4} textAlign="center">
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => {
                                                            setTriggerFetchCategory(!triggerFetchCategory);
                                                        }}
                                                    >
                                                        Aggiorna
                                                    </Button>
                                                </Box>
                                                <Typography mt={2} variant="body1" align="center" gutterBottom>
                                                    Clicca AGGIORNA non appena ti verrà comunicato che sono state aperte le
                                                    votazioni.
                                                </Typography>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            category && (
                                <>
                                    <Typography variant="h4" align="center" gutterBottom>{category.label}</Typography>

                                    {category.votePoints.map((points, index) => (
                                        <FormControl key={points} fullWidth margin="normal">
                                            <InputLabel id={`vote-select-label-${points}`}>Assegna {points} punt{points > 1 ? "i " : "o "}
                                                a</InputLabel>
                                            <Select
                                                labelId={`vote-select-label-${points}`}
                                                value={votes.find(v => v.points === points)?.country || ""}
                                                label={`Assegna ${points} punti a`}
                                                onChange={(e) => {
                                                    const country = e.target.value;
                                                    setVotes(prevVotes => {
                                                        // Rimuovi country già selezionata altrove o già associata a questo punteggio
                                                        const filtered = prevVotes.filter(v => v.points !== points && v.country !== country);
                                                        return [...filtered, {country, points}];
                                                    });
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>-- Seleziona un paese --</em>
                                                </MenuItem>
                                                {availableCountries
                                                    .filter(c => !votes.find(v => v.country === c.name && v.points !== points))
                                                    .map(c => (
                                                        <MenuItem key={c.name} value={c.name}>
                                                            {getFlagEmoji(c.isoCode)} {c.label}{(!!c.participant || !!c.assignedGuest) && " - "}{c.participant ? c.participant : c.assignedGuest}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    ))}

                                    <Box mt={4} textAlign="center">
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={onSubmit}
                                            disabled={!isVoteValid()}
                                        >
                                            Invia voti
                                        </Button>
                                    </Box>
                                </>
                            )
                        }
                        <Box mt={2} textAlign="center">
                            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                            {
                                successMessage &&
                                <Snackbar open={snackbarOpen} autoHideDuration={3000}
                                          onClose={() => setSnackbarOpen(false)}>
                                    <Alert severity="success" sx={{width: '100%'}}>{successMessage}</Alert>
                                </Snackbar>
                            }
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Dialog open={rulesOpen} onClose={() => setRulesOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle align="center">Regole per il punteggio finale</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText component="div">
                        <ul>
                            <li>
                                Ogni utente può votare in ogni categoria una sola volta.
                            </li>
                            <li>
                                Il punteggio finale dell'utente sarà calcolato in base alla classifica ufficiale
                                dell'Eurovision 2025 ed i voti forniti durante la serata del 17 maggio 2025.
                            </li>
                            <li>
                                Se la nazione votata nella categoria "Chi vince?" è la vincitrice dell'Eurovision 2025,
                                guadagni 6 punti.
                            </li>
                            <li>
                                Se la nazione votata nelle categorie "Il più bello", "La più bella" o "Miglior outfit -
                                cantante" è la più votata della categoria, guadagni 3 punti (per ogni categoria).
                            </li>
                            <li>
                                Se la tua nazione è nella Top 5 nelle categorie "Miglior cibo" e "Miglior outfit -
                                cosplay", guadagni punti extra in base alla posizione (da 5 punti per il 1º posto ad 1
                                punto per il 5º).
                            </li>
                            <li>
                                Non è possibile votare per la tua nazione nelle categorie "Miglior cibo" e "Miglior
                                outfit - cosplay" (No autovoto 😝).
                            </li>
                            <li>
                                La classifica inviata per la categoria "EUROVISION" sarà comparata con la classifica
                                finale dell'Eurovision 2025.
                                Per ogni nazione sarà calcolata la distanza tra la posizione fornita e quella della
                                classifica finale.
                                Saranno assegnati:
                                <ul>
                                    <li>
                                        4 punti per ogni distanza 0 (posizione indovinata 🥳).
                                    </li>
                                    <li>
                                        2 punti per ogni distanza 1.
                                    </li>
                                    <li>
                                        1 punto per ogni distanza 2.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default VotePage;