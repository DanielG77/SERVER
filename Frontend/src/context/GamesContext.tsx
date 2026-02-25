import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Game {
    id: string;
    name: string;
    iconUrl?: string;
    description?: string;
    // Add other fields as needed
}

interface GamesContextType {
    games: Game[];
    isLoading: boolean;
    error: any;
}

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const useGames = () => {
    const context = useContext(GamesContext);
    if (!context) {
        throw new Error('useGames must be used within a GamesProvider');
    }
    return context;
};

interface GamesProviderProps {
    children: React.ReactNode;
}

export const GamesProvider: React.FC<GamesProviderProps> = ({ children }) => {
    const { data: games = [], isLoading, error } = useQuery({
        queryKey: ['games'],
        queryFn: async () => {
            const response = await api.get('/games');
            return response.data.data || [];
        },
    });

    return (
        <GamesContext.Provider value={{ games, isLoading, error }}>
            {children}
        </GamesContext.Provider>
    );
};