import React from 'react';
import { TournamentSearchCard } from './TournamentSearchCard';

interface SearchResult {
    id: string;
    name: string;
    game: string;
    description: string;
    priceClient: number;
    startAt: string;
    isOnline: boolean;
    maxPlayers: number;
    score: number;
    reason?: string;
}

interface TournamentSearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
    hasSearched: boolean;
}

export const TournamentSearchResults: React.FC<TournamentSearchResultsProps> = ({
    results,
    isLoading,
    hasSearched,
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Buscando torneos...</p>
                </div>
            </div>
        );
    }

    if (!hasSearched) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Realiza una búsqueda para ver resultados</p>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No se encontraron torneos</p>
                <p className="text-gray-400">Intenta con otra búsqueda</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
                <TournamentSearchCard
                    key={result.id}
                    id={result.id}
                    name={result.name}
                    game={result.game}
                    description={result.description}
                    price={result.priceClient}
                    startAt={result.startAt}
                    isOnline={result.isOnline}
                    maxPlayers={result.maxPlayers}
                    score={result.score}
                    reason={result.reason}
                />
            ))}
        </div>
    );
};
