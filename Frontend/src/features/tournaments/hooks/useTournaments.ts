import { useState, useEffect, useCallback, useMemo } from 'react';
import { tournamentApi, TournamentListParams, TournamentSortOption } from '../../../api/tournamentApi';
import { Tournament, TournamentStatus, PaginatedResponse, TournamentFilters } from '../../../types';

interface UseTournamentsOptions {
    initialPage?: number;
    initialLimit?: number;
    initialFilters?: TournamentFilters;
    initialSortBy?: TournamentSortOption;
    initialSortOrder?: 'asc' | 'desc';
    autoFetch?: boolean;
}

export const useTournaments = (options: UseTournamentsOptions = {}) => {
    const {
        initialPage = 1,
        initialLimit = 12,
        initialFilters = {},
        initialSortBy = 'createdAt',
        initialSortOrder = 'desc',
        autoFetch = true,
    } = options;

    // Estados
    const [data, setData] = useState<PaginatedResponse<Tournament> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(initialPage);
    const [limit, setLimit] = useState<number>(initialLimit);
    const [filters, setFilters] = useState<TournamentFilters>(initialFilters);
    const [sortBy, setSortBy] = useState<TournamentSortOption>(initialSortBy);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fetch principal de torneos
    const fetchTournaments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params: TournamentListParams = {
                page,
                limit,
                sortBy,
                sortOrder,
                ...filters,
            };

            // Si hay término de búsqueda, usar endpoint de búsqueda
            const result = searchTerm.trim()
                ? await tournamentApi.searchTournaments(searchTerm, params)
                : await tournamentApi.getTournaments(params);

            setData(result);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los torneos');
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, filters, sortBy, sortOrder, searchTerm]);

    // Efecto para cargar automáticamente si autoFetch es true
    useEffect(() => {
        if (autoFetch) {
            fetchTournaments();
        }
    }, [fetchTournaments, autoFetch]);

    // Funciones para manipular la paginación
    const goToPage = useCallback((newPage: number) => {
        if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
            setPage(newPage);
        }
    }, [data?.totalPages]);

    const nextPage = useCallback(() => {
        if (page < (data?.totalPages || 1)) {
            setPage(prev => prev + 1);
        }
    }, [page, data?.totalPages]);

    const prevPage = useCallback(() => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }, [page]);

    // Funciones para manipular filtros
    const updateFilter = useCallback((key: keyof TournamentFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
        setPage(1); // Resetear a primera página cuando cambian los filtros
    }, []);

    const updateFilters = useCallback((newFilters: TournamentFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
        }));
        setPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchTerm('');
        setPage(1);
    }, []);

    // Funciones para manipular ordenamiento
    const updateSort = useCallback((newSortBy: TournamentSortOption) => {
        setSortBy(newSortBy);
        setPage(1);
    }, []);

    const toggleSortOrder = useCallback(() => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        setPage(1);
    }, []);

    // Funciones para manipular búsqueda
    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setPage(1);
    }, []);

    // Valores computados
    const tournaments = useMemo(() => data?.items || [], [data]);
    const totalItems = useMemo(() => data?.total || 0, [data]);
    const totalPages = useMemo(() => data?.totalPages || 1, [data]);
    const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
    const hasPrevPage = useMemo(() => page > 1, [page]);

    return {
        // Estado
        tournaments,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage,
            hasPrevPage,
        },
        filters,
        sort: {
            by: sortBy,
            order: sortOrder,
        },
        searchTerm,
        loading,
        error,
        data,

        // Acciones
        fetchTournaments,
        goToPage,
        nextPage,
        prevPage,
        setLimit,
        updateFilter,
        updateFilters,
        clearFilters,
        updateSort,
        toggleSortOrder,
        handleSearch,
        setSearchTerm,
    };
};