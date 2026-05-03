import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { objectToQueryString } from '../utils/queryParams';

interface TournamentFilters {
    page?: number;
    limit?: number;
    q?: string;
    sort?: string;
    status?: string;
    gameId?: string;
    genreIds?: string[];
    formatIds?: string[];
    platformIds?: string[];
}

interface TournamentMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface Tournament {
    id: string;
    name: string;
    description: string;
    images: string[];
    game: { id: string; name: string };
    format: { id: string; name: string };
    platforms: { id: string; name: string }[];
    minPlayers: number;
    maxPlayers: number;
    startAt: string;
    endDate: string;
    priceClient: number;
    pricePlayer: number;
    status: string;
}

interface UseTournamentsReturn {
    data: Tournament[];
    meta: TournamentMeta | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTournaments = (filters: TournamentFilters): UseTournamentsReturn => {
    const { authFetch } = useAuth();

    const [data, setData] = useState<Tournament[]>([]);
    const [meta, setMeta] = useState<TournamentMeta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchTournaments = useCallback(async (currentFilters: TournamentFilters) => {
        // 🔥 Cancelar request anterior
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const queryString = objectToQueryString(currentFilters);
            const url = `/tournaments${queryString ? `?${queryString}` : ''}`;

            console.log('🔍 Fetching tournaments with URL:', url);

            const response = await authFetch(url, {
                signal: controller.signal,
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText.substring(0, 200));
                throw new Error(`HTTP ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            if (!contentType?.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Not JSON:', text.substring(0, 200));
                throw new Error('Response is not JSON');
            }

            const result = await response.json();

            console.log('✅ Data received:', result);

            setData(result.data ?? []);

            if (result.meta?.pagination) {
                const { total, page, limit } = result.meta.pagination;

                setMeta({
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                });
            } else {
                setMeta(null);
            }

        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                console.error('🔥 Fetch error:', err);
                setError(err.message);
            }
        } finally {
            // 🔥 IMPORTANTE: no pisar loading si fue abortado
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, [authFetch]);

    // 🔥 Dependencias simplificadas (más robusto)
    useEffect(() => {
        fetchTournaments(filters);
    }, [fetchTournaments, JSON.stringify(filters)]);

    const refetch = useCallback(() => {
        fetchTournaments(filters);
    }, [filters, fetchTournaments]);

    return { data, meta, loading, error, refetch };
};
