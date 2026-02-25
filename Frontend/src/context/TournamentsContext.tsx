import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Tournament {
    id: string;
    name: string;
    images?: string[];
    startAt?: string;
    priceClient?: number;
    game?: { name: string };
    format?: { name: string };
    // Add other fields as needed
}

interface TournamentsContextType {
    tournaments: Tournament[];
    isLoading: boolean;
    error: any;
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
    const { data: tournaments = [], isLoading, error } = useQuery({
        queryKey: ['tournaments'],
        queryFn: async () => {
            const response = await api.get('/tournaments');
            return response.data.data || [];
        },
    });

    return (
        <TournamentsContext.Provider value={{ tournaments, isLoading, error }}>
            {children}
        </TournamentsContext.Provider>
    );
};