import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Game {
    id: number;
    name: string;
}

interface TournamentFiltersProps {
    filters: {
        status: string;
        gameId: string;
        genreIds: string[];
        formatIds: string[];
        platformIds: string[];
        sort: string;
    };
    onFilterChange: (key: string, value: any) => void;
    onSearchChange: (q: string) => void;
    searchQuery: string;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
    filters,
    onFilterChange,
    onSearchChange,
    searchQuery,
}) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loadingGames, setLoadingGames] = useState(false);
    const [errorGames, setErrorGames] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            setLoadingGames(true);
            setErrorGames(null);
            try {
                const response = await axios.get('http://localhost:8080/games');
                console.log('Games response:', response); // <-- Verifica qué llega
                if (response.data?.success && Array.isArray(response.data.data)) {
                    setGames(response.data.data);
                } else {
                    setErrorGames('No se encontraron juegos');
                }
            } catch (err: any) {
                console.error('Error fetching games:', err);
                setErrorGames('Error al cargar los juegos');
            } finally {
                setLoadingGames(false);
            }
        };

        fetchGames();
    }, []);


    return (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search tournaments..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="">All</option>
                        <option value="draft">Draft</option>
                        <option value="open">Open</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Game */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Game</label>
                    <select
                        value={filters.gameId}
                        onChange={(e) => onFilterChange('gameId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="">All Games</option>
                        {loadingGames && <option>Loading...</option>}
                        {errorGames && <option>{errorGames}</option>}
                        {!loadingGames && !errorGames &&
                            games.map((game) => (
                                <option key={game.id} value={game.id}>{game.name}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                        value={filters.sort}
                        onChange={(e) => onFilterChange('sort', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="name">Name</option>
                        <option value="startAt">Start Date</option>
                        <option value="priceClient">Price</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default TournamentFilters;
