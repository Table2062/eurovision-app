const VOTES_BASE = process.env.REACT_APP_API_BASE+"/votes";

// Funzione per registrare una votazione


// Funzione per ottenere le nazioni che è possibile votare data una categoria


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
        }
        throw new Error('Errore nel recuperare la categoria di voto');
    }

    return await response.json();
};
