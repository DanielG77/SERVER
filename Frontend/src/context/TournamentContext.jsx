import React, { createContext, useContext, useState, useEffect } from 'react';
import { tournamentService } from '../api/apiFetch';
import { tournamentAxiosService } from '../api/apiAxios';

const TournamentContext = createContext();

export const useTournament = () => {
    const context = useContext(TournamentContext);
    if (!context) {
        throw new Error('useTournament debe usarse dentro de TournamentProvider');
    }
    return context;
};

export const TournamentProvider = ({ children }) => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState({});
    const [useAxios, setUseAxios] = useState(true);

    const fetchTournaments = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;

            if (useAxios) {
                // Usar Axios
                response = await tournamentAxiosService.getTournamentsWithAxios();
            } else {
                // Usar Fetch
                response = await tournamentService.getTournamentsWithFetch();
            }

            if (response.success) {
                setTournaments(response.data);
                setMeta(response.meta);
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleApiMethod = () => {
        setUseAxios(!useAxios);
    };

    useEffect(() => {
        fetchTournaments();
    }, [useAxios]);

    const value = {
        tournaments,
        loading,
        error,
        meta,
        useAxios,
        fetchTournaments,
        toggleApiMethod,
    };

    return (
        <TournamentContext.Provider value={value}>
            {children}
        </TournamentContext.Provider>
    );
};