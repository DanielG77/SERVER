import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { objectToQueryString } from '../utils/queryParams';
import { useRef } from 'react';

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
        setLoading(true);
        setError(null);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const queryString = objectToQueryString(currentFilters);
            const url = `/tournaments?${queryString}`;

            // 🔍 LOG 1: Mostrar la URL que se va a llamar
            console.log('🔍 Fetching tournaments with URL:', url);

            const response = await authFetch(url, { signal: controller.signal });

            // 🔍 LOG 2: Ver el estado de la respuesta y los headers
            console.log('📡 Response status:', response.status);
            console.log('📡 Content-Type:', response.headers.get('content-type'));

            if (!response.ok) {
                // Intentamos leer el cuerpo como texto para ver si es HTML o JSON de error
                const errorText = await response.text();
                console.error('❌ Error response body:', errorText.substring(0, 200)); // primeros 200 caracteres
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 🔍 LOG 3: Antes de parsear JSON, verificamos que sea JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Respuesta no es JSON, es:', contentType, text.substring(0, 200));
                throw new Error('La respuesta no es JSON');
            }

            const result = await response.json();

            // 🔍 LOG 4: Mostrar el resultado (primeros datos)
            console.log('✅ Datos recibidos:', result);

            setData(result.data || []);

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
                console.error('🔥 Error en fetchTournaments:', err);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchTournaments(filters);
    }, [
        filters.page,
        filters.limit,
        filters.q,
        filters.sort,
        filters.status,
        filters.gameId,
        JSON.stringify(filters.genreIds),
        JSON.stringify(filters.formatIds),
        JSON.stringify(filters.platformIds),
    ]);

    const refetch = useCallback(() => {
        fetchTournaments(filters);
    }, [filters, fetchTournaments]);

    return { data, meta, loading, error, refetch };
};
