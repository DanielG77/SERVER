import { useState, useCallback } from 'react';

interface TournamentSearchResult {
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

interface SearchResponse {
    query: string;
    results: TournamentSearchResult[];
    total: number;
}

export const useSearchTournaments = () => {
    const [results, setResults] = useState<TournamentSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const response = await fetch('/api/v1/tournaments/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }

            const data: SearchResponse = await response.json();
            setResults(data.results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido al buscar');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { results, isLoading, error, hasSearched, search };
};
