import { useState, useCallback, useRef, useEffect } from 'react';

export interface TournamentSearchResult {
    id: string;
    name: string;
    game: string;
    description: string;
    priceClient: number;
    startAt: string;
    isOnline: boolean;
    maxPlayers: number;
    score?: number;
    reason?: string;
    aiInterpretation?: string;
    aiConfidence?: number;
}

export interface SearchResponse {
    query: string;
    results: TournamentSearchResult[];
    total?: number;
}

interface UseSearchTournamentsOptions {
    autoAbortPrevious?: boolean;
}

/**
 * Centralizado hook para búsqueda de torneos con IA
 * 
 * USO:
 * const { results, isLoading, error, hasSearched, search, clear } = useSearchTournaments();
 * 
 * Siempre envía:
 * POST /api/v1/tournaments/search
 * { "query": "texto natural del usuario" }
 * 
 * Todo parsing/filtros/IA está en backend
 */
export const useSearchTournaments = (options: UseSearchTournamentsOptions = {}) => {
    const { autoAbortPrevious = true } = options;

    const [results, setResults] = useState<TournamentSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const search = useCallback(async (query: string) => {
        // Cancelar búsqueda anterior si está en progreso
        if (autoAbortPrevious && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            console.debug('🔍 AI Search:', { query: trimmedQuery });

            const response = await fetch('/api/v1/tournaments/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: trimmedQuery }),
                signal: controller.signal,
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error en la búsqueda: ${response.status}`);
            }

            const data: SearchResponse = await response.json();

            console.debug('✅ AI Search Results:', {
                query: trimmedQuery,
                resultsCount: data.results?.length || 0,
                firstResult: data.results?.[0]?.aiInterpretation
            });

            setResults(data.results || []);
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.debug('⏸️ Search cancelled');
                return;
            }
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido al buscar';
            console.error('❌ Search error:', errorMsg);
            setError(errorMsg);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [autoAbortPrevious]);

    const clear = useCallback(() => {
        setResults([]);
        setError(null);
        setHasSearched(false);
    }, []);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        clear();
    }, [clear]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        results,
        isLoading,
        error,
        hasSearched,
        search,
        clear,
        reset
    };
};
