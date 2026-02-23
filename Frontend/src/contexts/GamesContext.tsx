import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useGames, Game } from '@/hook/useGames.query';

interface GamesContextValue {
  games: Game[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const GamesContext = createContext<GamesContextValue | undefined>(undefined);

export const GamesProvider = ({ children }: { children: ReactNode }) => {
  const { data: games, isLoading, error, refetch } = useGames();

  const value = useMemo(
    () => ({ games, isLoading, error, refetch }),
    [games, isLoading, error, refetch]
  );

  return (
    <GamesContext.Provider value={value}>
      {children}
    </GamesContext.Provider>
  );
};

export const useGamesContext = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error('useGamesContext debe usarse dentro de GamesProvider');
  }
  return context;
};