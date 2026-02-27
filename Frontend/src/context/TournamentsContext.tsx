import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Tournament } from '@/shared/types/tournament.types';

interface TournamentsContextType {
    tournaments: Tournament[];
    isLoading: boolean;
    error: unknown;
}

const TournamentsContext = createContext<TournamentsContextType | undefined>(undefined);

export const useTournamentsContext = () => {
    const context = useContext(TournamentsContext);
    if (!context) {
        throw new Error('useTournamentsContext must be used within a TournamentsProvider');
    }
    return context;
};

interface TournamentsProviderProps {
    children: React.ReactNode;
}

export const TournamentsProvider: React.FC<TournamentsProviderProps> = ({ children }) => {
    const { data = [], isLoading, error } = useQuery<Tournament[]>({
        queryKey: ['tournaments'],
        queryFn: async () => {
            const response = await api.get('/tournaments');
            return response.data.data;
        },
    });

    return (
        <TournamentsContext.Provider value={{ tournaments: data, isLoading, error }}>
            {children}
        </TournamentsContext.Provider>
    );
};
