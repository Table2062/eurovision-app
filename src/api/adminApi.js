const AUTH_BASE = process.env.REACT_APP_API_BASE+"/admin";

// Funzione per ottenere tutti gli utenti non admin
export const getAllNonAdminUsers = async (token) => {
    const response = await fetch(`${AUTH_BASE}/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nel recupero degli utenti');
    }

    return await response.json();
};

//Funzione per eliminare un utente
export const deleteUser = async (token, username) => {
    const response = await fetch(`${AUTH_BASE}/users/${username}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nell\'eliminazione dell\'utente');
    }

    return await response.json();
};

//Funzione per cambiare la password di un utente
export const changeUserPassword = async (token, username, newPassword) => {
    const response = await fetch(`${AUTH_BASE}/users/${username}/password`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
    });

    if (!response.ok) {
        throw new Error('Errore nel cambio della password');
    }

    return await response.json();
};

//Funzione per ottenere gli utenti che hanno votato per una categoria
export const getUsersThatVoted = async (token, category) => {
    const response = await fetch(`${AUTH_BASE}/users/${category}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nel recupero degli utenti che hanno votato');
    }

    return await response.json();
};

//Funzione per ottenere i voti di un utente per una categoria
export const getUserVotingResults = async (token, category, username) => {
    const response = await fetch(`${AUTH_BASE}/voting-results/${category}/users/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nel recupero dei voti dell\'utente');
    }

    return await response.json();
};

//Funzione per cancellare i voti di un utente per una categoria
export const deleteUserVotingResults = async (token, category, username) => {
    const response = await fetch(`${AUTH_BASE}/voting-results/${category}/users/${username}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nella cancellazione dei voti dell\'utente');
    }

    return await response.json();
};

//Funzione per ottenere la classifica di una categoria
export const getVotingResults = async (token, category, limit) => {
    const response = await fetch(`${AUTH_BASE}/voting-results/${category}?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nel recupero dei risultati di voto');
    }

    return await response.json();
};

//Funzione per aprire il voto per una categoria
export const openVoting = async (token, category) => {
    const response = await fetch(`${AUTH_BASE}/open-voting/${category}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nell\'apertura del voto');
    }

    return await response.json();
};

//Funzione per chiudere il voto per una categoria
export const closeVoting = async (token, category) => {
    const response = await fetch(`${AUTH_BASE}/close-voting/${category}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nella chiusura del voto');
    }

    return await response.json();
};

//Funzione per rivelare un voto
export const revealVote = async (token, username, category, points) => {
    const response = await fetch(`${AUTH_BASE}/reveal-vote`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, category, points })
    });

    if (!response.ok) {
        throw new Error('Errore nella rivelazione del voto');
    }

    return await response.json();
};

//Funzione per ottenere la top10 finale dell'Eurovision 2025
export const getFinalTop10 = async (token) => {
    const response = await fetch(`${AUTH_BASE}/finalTop10`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Errore nell\'ottenere la top10 finale');
    }

    return await response.json();
};

//Funzione per salvare la top10 finale dell'Eurovision 2025
export const saveFinalTop10 = async (token, top10) => {
    const response = await fetch(`${AUTH_BASE}/finalTop10`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(top10)
    });

    if (!response.ok) {
        throw new Error('Errore nel salvataggio della top10 finale');
    }

    return await response.json();
};

//Funzione per cancellare la top10 finale dell'Eurovision 2025
export const deleteFinalTop10 = async (token) => {
    const response = await fetch(`${AUTH_BASE}/finalTop10`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Errore nella cancellazione della top10 finale');
    }

    return await response.json();
};


//Funzione per inviare l'email finale
export const sendFinalEmail = async (token) => {
    const response = await fetch(`${AUTH_BASE}/send-final-email`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nell\'invio dell\'email finale');
    }

    return await response.json();
};

//Funzione per flaggare l'utente come possibile vincitore di premi
export const setAwardRanking = async (token, username, enabled) => {
    const response = await fetch(`${AUTH_BASE}/users/${username}/award-ranking/${enabled}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento dell\'utente');
    }

    return await response.json();
};

//Funzione per ottenere tutte le categorie
export const getAllCategories = async (token) => {
    const response = await fetch(`${AUTH_BASE}/categories`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nel recupero delle categorie');
    }

    return await response.json();
};

//Funzione per ottenere la classifica finale degli utenti per punteggi
export const getFinalScore = async (token, limit, canBeAwardedOnly) => {
    const response = await fetch(`${AUTH_BASE}/final-score?limit=${limit}&canBeAwardedOnly=${canBeAwardedOnly}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Errore nel recupero della classifica finale');
    }

    return await response.json();
}