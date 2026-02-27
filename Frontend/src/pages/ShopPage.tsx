import { useState, useEffect, useRef } from 'react';
import { useTournaments } from '../hooks/useTournaments';
import TournamentFilters from './components/TournamentFilters';
import TournamentList from './components/TournamentList';
import Pagination from './components/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import { queryStringToObject, objectToQueryString } from '../utils/queryParams';


export const ShopPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const firstLoad = useRef(true);
    const isUserAction = useRef(false);

    // Lee filtros de la URL al cargar
    const urlFilters = queryStringToObject(location.search);
    // Estado local de filtros, inicializado desde la URL
    const [filters, setFilters] = useState(() => {
        return {
            page: Number(urlFilters.page) || 1,
            limit: Number(urlFilters.limit) || 8,
            q: urlFilters.q || '',
            sort: urlFilters.sort || 'name',
            status: urlFilters.status || '',
            gameId: urlFilters.gameId || '',
            genreIds: urlFilters.genreIds ? (Array.isArray(urlFilters.genreIds) ? urlFilters.genreIds : [urlFilters.genreIds]) : [],
            formatIds: urlFilters.formatIds ? (Array.isArray(urlFilters.formatIds) ? urlFilters.formatIds : [urlFilters.formatIds]) : [],
            platformIds: urlFilters.platformIds ? (Array.isArray(urlFilters.platformIds) ? urlFilters.platformIds : [urlFilters.platformIds]) : [],
            is_active: urlFilters.is_active !== undefined ? urlFilters.is_active === 'true' || urlFilters.is_active === true : true,
        };
    });
    const [searchInput, setSearchInput] = useState(filters.q || '');

    // Actualiza la URL cuando cambian los filtros
    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        if (!isUserAction.current) return;
        const filtersForUrl = { ...filters };
        Object.keys(filtersForUrl).forEach((key) => {
            if (
                filtersForUrl[key] === '' ||
                filtersForUrl[key] === undefined ||
                (Array.isArray(filtersForUrl[key]) && filtersForUrl[key].length === 0) ||
                (key === 'is_active' && filtersForUrl[key] === true)
            ) {
                delete filtersForUrl[key];
            }
        });
        const qs = objectToQueryString(filtersForUrl);
        navigate({ pathname: '/shop', search: qs ? `?${qs}` : '' }, { replace: true });
        isUserAction.current = false;
    }, [filters, navigate]);

    // Si cambia la URL (ej: usuario pega un link), actualiza los filtros
    useEffect(() => {
        const urlFilters = queryStringToObject(location.search);
        isUserAction.current = false;
        setFilters((prev) => ({
            ...prev,
            ...urlFilters,
            page: Number(urlFilters.page) || 1,
            limit: Number(urlFilters.limit) || prev.limit,
            q: urlFilters.q || '',
            is_active: urlFilters.is_active !== undefined ? urlFilters.is_active === 'true' || urlFilters.is_active === true : true,
            genreIds: urlFilters.genreIds ? (Array.isArray(urlFilters.genreIds) ? urlFilters.genreIds : [urlFilters.genreIds]) : [],
            formatIds: urlFilters.formatIds ? (Array.isArray(urlFilters.formatIds) ? urlFilters.formatIds : [urlFilters.formatIds]) : [],
            platformIds: urlFilters.platformIds ? (Array.isArray(urlFilters.platformIds) ? urlFilters.platformIds : [urlFilters.platformIds]) : [],
        }));
    }, [location.search]);

    const { data: tournaments, meta, loading, error } = useTournaments(filters);

    const handleFilterChange = (key: string, value: any) => {
        isUserAction.current = true;
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1,
        }));
    };

    const handleSearchChange = (q: string) => {
        setSearchInput(q);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({
                ...prev,
                q: searchInput,
                page: 1,
            }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handlePageChange = (newPage: number) => {
        isUserAction.current = true;
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: number) => {
        isUserAction.current = true;
        setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const handleTournamentClick = (tournament: any) => {
        navigate(`/shop/${tournament.id}`);
    };

    return (
        <div className="min-h-screen bg-white text-slate-800">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Tournaments</h1>

                <TournamentFilters
                    filters={{
                        status: filters.status,
                        gameId: filters.gameId,
                        genreIds: filters.genreIds,
                        formatIds: filters.formatIds,
                        platformIds: filters.platformIds,
                        sort: filters.sort,
                    }}
                    onFilterChange={handleFilterChange}
                    onSearchChange={handleSearchChange}
                    searchQuery={searchInput}
                />

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                <TournamentList
                    tournaments={tournaments}
                    loading={loading}
                    onTournamentClick={handleTournamentClick}
                />

                {!loading && !error && tournaments.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No tournaments found matching your filters.
                    </div>
                )}

                {tournaments.length > 0 && (
                    <Pagination
                        currentPage={filters.page}
                        totalItems={meta?.total ?? 0}
                        limit={filters.limit}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                )}
            </div>
        </div>
    );
};
