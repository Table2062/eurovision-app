import {
    Alert,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from "@mui/material";
import {getFlagEmoji} from "../utils/flagUtils";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {getAllCountries} from "../api/authApi";
import {getFinalTop10, saveFinalTop10, deleteFinalTop10, getFinalScore, sendFinalEmail} from "../api/adminApi";
import useAuthStore from "../store/authStore";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";

const validationSchema = yup.object({
    country: yup.string().required('Seleziona una nazione')
});

const FinalPanel = () => {
    const {token} = useAuthStore();

    const [countries, setCountries] = useState([]);
    const [votes, setVotes] = useState([]);
    const [error, setError] = useState('');
    const [top10, setTop10] = useState([]);
    const [finalScoreGeneral, setFinalScoreGeneral] = useState([]);
    const [finalScoreAwarded, setFinalScoreAwarded] = useState([]);
    const [limitGeneral, setLimitGeneral] = useState(3);
    const [limitAwarded, setLimitAwarded] = useState(3);
    const [emailSent, setEmailSent] = useState(false);
    const votePoints = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
    const [showGeneralScores, setShowGeneralScores] = useState({first: false, second: false, third: false});
    const [showAwardedScores, setShowAwardedScores] = useState({first: false, second: false, third: false});

    const {
        register: formRegister,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const isVoteValid = () => {
        return (
            votes.length === votePoints.length &&
            votes.every(v => v.country && v.country !== '')
        );
    };

    const onSubmit = async () => {
        localStorage.getItem('finalTop10');
        try {
            var finalTop10 = votes.map(v => v.country);
            await saveFinalTop10(token, finalTop10);
            setTop10(finalTop10);
            setError('')
        } catch (err) {
            setError("Invio Top10 finale fallito!");
        }
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getAllCountries();
                setCountries(data.countries);
            } catch (err) {
                setError("Errore nel recupero delle nazioni!");
            }
        };
        fetchCountries();

        const fetchTop10 = async () => {
            try {
                const data = await getFinalTop10(token);
                setTop10(data);
            } catch (err) {
                setTop10([]);
            }
        }
        fetchTop10();
    }, []);

    const deleteTop10 = async () => {
        try {
            await deleteFinalTop10(token);
            setTop10([]);
        } catch (err) {
            setError("Errore nella cancellazione della Top 10 finale");
        }
    }

    const fetchFinalScoreGeneral = async (limit) => {
        try {
            const data = await getFinalScore(token, limit, false);
            setFinalScoreGeneral(data);
        } catch (err) {
            setFinalScoreGeneral([])
            setError("Errore nel recupero della Top 10 finale");
        }
    }

    const fetchFinalScoreAwarded = async (limit) => {
        try {
            const data = await getFinalScore(token, limit, true);
            setFinalScoreAwarded(data);
        } catch (err) {
            setFinalScoreAwarded([])
            setError("Errore nel recupero della Top 10 finale");
        }
    }

    useEffect(() => {
        if (top10 && top10.length === 10) {
            fetchFinalScoreGeneral(limitGeneral);
            fetchFinalScoreAwarded(limitAwarded);
        }
    }, [top10]);

    const handleLimitGeneralChange = (event) => {
        setLimitGeneral(event.target.value);
        if (top10 && top10.length === 10) {
            fetchFinalScoreGeneral(event.target.value);
        }
    }

    const handleLimitAwardedChange = (event) => {
        setLimitAwarded(event.target.value);
        if (top10 && top10.length === 10) {
            fetchFinalScoreAwarded(event.target.value);
        }
    }

    const sendFinalEmaill = async () => {
        try {
            await sendFinalEmail(token);
            setError('')
            setEmailSent(true);
        } catch (err) {
            setError("Invio email finale fallito!");
        }
    }

    const canShowGeneralScores = (index) => {
        if (index > 2) return true;
        else if (index === 0 && showGeneralScores.first) return true;
        else if (index === 1 && showGeneralScores.second) return true;
        else return index === 2 && showGeneralScores.third;
    }

    const canShowAwardedScores = (index) => {
        if (index > 2) return true;
        else if (index === 0 && showAwardedScores.first) return true;
        else if (index === 1 && showAwardedScores.second) return true;
        else return index === 2 && showAwardedScores.third;
    }

    const revealAwardedIndex = (index) => {
        switch (index) {
            case 0:
                setShowAwardedScores({...showAwardedScores, first: true});
                break;
            case 1:
                setShowAwardedScores({...showAwardedScores, second: true});
                break;
            case 2:
                setShowAwardedScores({...showAwardedScores, third: true});
                break;
            default:
        }
    }

    const revealGeneralIndex = (index) => {
        switch (index) {
            case 0:
                setShowGeneralScores({...showGeneralScores, first: true});
                break;
            case 1:
                setShowGeneralScores({...showGeneralScores, second: true});
                break;
            case 2:
                setShowGeneralScores({...showGeneralScores, third: true});
                break;
            default:
        }
    }

    return <>
        <Box display="flex" width="100%" minHeight="95vh">
            <Paper sx={{flex: 1, p: 2}}>
                <Typography key="final-score-general" variant="h5">Classifica premi</Typography>
                {(top10 && top10.length === 10) && finalScoreAwarded.map((score, index) => <>
                    {canShowAwardedScores(index) ? <>
                        <Typography key={"final-score-awarded-username-"+index} variant="h6">{index+1}º {score.username}</Typography>
                        <Typography key={"final-score-awarded-totalscore-"+index} variant="h6">Punti totali: {score.totalScore}</Typography>
                        <Typography key={"final-score-awarded-assignedcountry-"+index} variant="body1">Nazione assegnata: {getFlagEmoji(score.assignedCountry.isoCode)} {score.assignedCountry.label}</Typography>
                        <Typography key={"final-score-awarded-bonopoints-"+index} variant="body1">Il più bello: {score.bonoPoints}</Typography>
                        <Typography key={"final-score-awarded-bonapoints-"+index} variant="body1">La più bella: {score.bonaPoints}</Typography>
                        <Typography key={"final-score-awarded-winnerpoints-"+index} variant="body1">Chi vince?: {score.winnerPoints}</Typography>
                        <Typography key={"final-score-awarded-bestsingeroutfit-"+index} variant="body1">Migior outfit - cantante: {score.bestSingerOutfit}</Typography>
                        <Typography key={"final-score-awarded-bestfoodpoints-"+index} variant="body1">Miglior cibo: {score.bestFoodPoints}</Typography>
                        <Typography key={"final-score-awarded-bestguestoutfit-"+index} variant="body1">Miglior outfit - cosplay: {score.bestGuestOutfitPoints}</Typography>
                        <Typography key={"final-score-awarded-rankingaccuracy-"+index} variant="body1">Top10: {score.rankingAccuracy}</Typography>
                        <br/>
                    </> : <Button onClick={() => revealAwardedIndex(index)}>Scopri il {index+1}º</Button>}
                </>)}
                <Box width="25%" p={2}>
                    <Select
                        fullWidth
                        labelId="limit-select-label"
                        id="limit-select"
                        value={limitAwarded}
                        label="Limit"
                        onChange={handleLimitAwardedChange}
                    >
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={99}>ALL</MenuItem>
                    </Select>
                </Box>
            </Paper>
            <Paper sx={{flex: 1, p: 2}}>
                <Typography key="final-score-general" variant="h5">Classifica generale</Typography>
                {(top10 && top10.length === 10) && finalScoreGeneral.map((score, index) => <>
                    {canShowGeneralScores(index) ? <>
                        <Typography key={"final-score-general-username-"+index} variant="h6">{index+1}º {score.username}</Typography>
                        <Typography key={"final-score-general-totalscore-"+index} variant="h6">Punti totali: {score.totalScore}</Typography>
                        <Typography key={"final-score-general-assignedcountry-"+index} variant="body1">Nazione assegnata: {getFlagEmoji(score.assignedCountry.isoCode)} {score.assignedCountry.label}</Typography>
                        <Typography key={"final-score-general-bonopoints-"+index} variant="body1">Il più bello: {score.bonoPoints}</Typography>
                        <Typography key={"final-score-general-bonapoints-"+index} variant="body1">La più bella: {score.bonaPoints}</Typography>
                        <Typography key={"final-score-general-winnerpoints-"+index} variant="body1">Chi vince?: {score.winnerPoints}</Typography>
                        <Typography key={"final-score-general-bestsingeroutfit-"+index} variant="body1">Migior outfit - cantante: {score.bestSingerOutfit}</Typography>
                        <Typography key={"final-score-general-bestfoodpoints-"+index} variant="body1">Miglior cibo: {score.bestFoodPoints}</Typography>
                        <Typography key={"final-score-general-bestguestoutfit-"+index} variant="body1">Miglior outfit - cosplay: {score.bestGuestOutfitPoints}</Typography>
                        <Typography key={"final-score-general-rankingaccuracy-"+index} variant="body1">Top10: {score.rankingAccuracy}</Typography>
                        <br/>
                    </> : <Button onClick={() => revealGeneralIndex(index)}>Scopri il {index+1}º</Button>}
                </>)}
                <Box width="25%" p={2}>
                    <Select
                        fullWidth
                        labelId="limit-select-label"
                        id="limit-select"
                        value={limitGeneral}
                        label="Limit"
                        onChange={handleLimitGeneralChange}
                    >
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={99}>ALL</MenuItem>
                    </Select>
                </Box>
            </Paper>
            <Paper sx={{flex: 1, p: 2}}>
                {(top10 && top10.length === 10) ? <>
                    <Typography variant="h5" >Top 10 finale dell'Eurovision 2025 <IconButton onClick={deleteTop10} p={0} style={{padding: "0", marginBottom: "5px"}}><DeleteIcon/></IconButton></Typography>
                    {top10.map((country, index) => (
                        <Typography key={index} variant="h6">
                            {index + 1}º {getFlagEmoji(countries.find(c => c.name === country).isoCode)} {countries.find(c => c.name === country).label}
                        </Typography>
                    ))}
                    <Box mt={4} textAlign="center">
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={sendFinalEmaill}
                            disabled={emailSent}
                        >
                            <EmailIcon style={{marginRight: "5px"}}/> Invia email con i punteggi
                        </Button>
                    </Box>
                </> : <>
                    <Typography variant="h5">Carica la Top 10 finale dell'Eurovision 2025</Typography>

                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                    {votePoints.map((points, index) => (
                        <FormControl key={points} fullWidth margin="normal">
                            <InputLabel
                                id={`vote-select-label-${points}`}>{index+1}º</InputLabel>
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
                                {countries
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
                </>}
            </Paper>
        </Box>
    </>
}

export default FinalPanel;