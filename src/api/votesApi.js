const VOTES_BASE = process.env.REACT_APP_API_BASE+"/votes";

// Funzione per registrare una votazione
export const submitVotes = async (token, categoryCode, votes) => {
    const response = await fetch(`${VOTES_BASE}/submit/${categoryCode}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ votes: votes })
    });

    if (!response.ok) {
        throw new Error('Errore nella votazione');
    }
    return await response.json(); // restituisce un messaggio di successo
};

// Funzione per ottenere le nazioni che è possibile votare data una categoria
export const getAvailableCountries = async (token, categoryCode) => {
    const response = await fetch(`${VOTES_BASE}/available-countries/${categoryCode}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Errore nel recuperare le nazioni disponibili');
    }

    return await response.json();
}

// Funzione per ottenere la categoria su cui sono aperte le votazioni
export const getOpenCategory = async (token) => {
    const response = await fetch(`${VOTES_BASE}/open-category`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("NO_CATEGORY");
        } else if(response.status === 400) {
            throw new Error("ALREADY_VOTED");
        }
        throw new Error('Errore nel recuperare la categoria di voto');
    }

    return await response.json();
};
