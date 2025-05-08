const AUTH_BASE = process.env.REACT_APP_API_BASE+"/auth"; // Modifica se necessario

// Funzione per registrare un nuovo utente
export const register = async (username, email, password, assignedCountry) => {
    const response = await fetch(`${AUTH_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, assignedCountry })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Errore nella registrazione');
    }

    return await response.json(); // Restituisce il token e altre info utente
};

// Funzione per eseguire il login
export const login = async (username, password) => {
    const response = await fetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Errore nel login');
    }

    return await response.json(); // Restituisce il token e altre info utente
};

// Funzione per ottenere tutte le nazioni disponibili
export const getAllCountries = async () => {
    const response = await fetch(`${AUTH_BASE}/all-countries`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Errore nel recuperare le nazioni');
    }

    return await response.json(); // Restituisce la lista delle nazioni
};