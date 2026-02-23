import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useTournaments } from '@/features/tournaments/queries/useTournaments.query';
import type { Tournament } from '@/shared/types/tournament.types';

interface TournamentsContextValue {
    tournaments: Tournament[] | undefined;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
}

const TournamentsContext = createContext<TournamentsContextValue | undefined>(undefined);

export const TournamentsProvider = ({ children }: { children: ReactNode }) => {
    const { data: tournaments, isLoading, error, refetch } = useTournaments();

    // Memorizamos el valor para evitar re-renders innecesarios
    const value = useMemo(
        () => ({
            tournaments,
            isLoading,
            error,
            refetch,
        }),
        [tournaments, isLoading, error, refetch]
    );

    return (
        <TournamentsContext.Provider value={value}>
            {children}
        </TournamentsContext.Provider>
    );
};

export const useTournamentsContext = () => {
    const context = useContext(TournamentsContext);
    if (context === undefined) {
        throw new Error('useTournamentsContext debe usarse dentro de TournamentsProvider');
    }
    return context;
};