import { useState, useEffect } from 'react';
import { useTournaments } from '../hooks/useTournaments';
import TournamentFilters from './components/TournamentFilters';
import TournamentList from './components/TournamentList';
// import TournamentDetails from './components/TournamentDetails';
import Pagination from './components/Pagination';
import { useNavigate } from 'react-router-dom';

export const ShopPage = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 8,
        q: '',
        sort: 'name',
        status: '',
        gameId: '',
        genreIds: [] as string[],
        formatIds: [] as string[],
        platformIds: [] as string[],
        is_active: true,     // 👈 AQUI FILTRAMOS SOLO ACTIVOS
    });
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const { data: tournaments, meta, loading, error } = useTournaments(filters);

    const handleFilterChange = (key: string, value: any) => {
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
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: number) => {
        setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const handleTournamentClick = (tournament: any) => {
        navigate(`/shop/${tournament.id}`);
    };

    // const totalItems = meta?.total ?? 0;
    // const totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));

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
