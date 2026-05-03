import { useState, useCallback, useRef, useEffect } from 'react';
import { searchTournaments, TournamentSearchResultResponse } from '../services/tournamentSearchService';

export interface UseTournamentSearchResult {
    query: string;
    results: TournamentSearchResultResponse[];
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
    hasSearched: boolean;
    setQuery: (query: string) => void;
    search: (q?: string) => Promise<void>;
    clear: () => void;
    reset: () => void;
}

interface UseTournamentSearchOptions {
    debounceMs?: number;
    minChars?: number;
    autoSearch?: boolean;
}

export const useTournamentSearch = (options: UseTournamentSearchOptions = {}): UseTournamentSearchResult => {
    const { debounceMs = 300, minChars = 1, autoSearch = true } = options;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TournamentSearchResultResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const performSearch = useCallback(
        async (searchQuery: string) => {
            const trimmedQuery = searchQuery.trim();

            if (trimmedQuery.length < minChars) {
                setResults([]);
                setError(null);
                setHasSearched(false);
                setIsLoading(false);
                return;
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            setIsLoading(true);
            setError(null);
            setHasSearched(true);

            try {
                const response = await searchTournaments(trimmedQuery, controller.signal);
                if (!controller.signal.aborted) {
                    setResults(response.results || []);
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return;
                const errorMessage = err instanceof Error ? err.message : 'Error al buscar torneos';
                setError(errorMessage);
                setResults([]);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        },
        [minChars]
    );

    const handleQueryChange = useCallback(
        (newQuery: string) => {
            setQuery(newQuery);

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            if (!autoSearch) return;

            debounceTimerRef.current = setTimeout(() => {
                performSearch(newQuery);
            }, debounceMs);
        },
        [autoSearch, debounceMs, performSearch]
    );

    const search = useCallback(
        async (q?: string) => {
            const searchQuery = q ?? query;

            setQuery(searchQuery);

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            await performSearch(searchQuery);
        },
        [query, performSearch]
    );

    const clear = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    const reset = useCallback(() => {
        setQuery('');
        setResults([]);
        setError(null);
        setHasSearched(false);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        query,
        results,
        isLoading,
        error,
        isEmpty: hasSearched && results.length === 0 && !isLoading,
        hasSearched,
        setQuery: handleQueryChange,
        search,
        clear,
        reset,
    };
};