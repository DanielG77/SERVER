/**
 * EXAMPLE: UnifiedSearch integration in Shop page
 * 
 * Shows how to use UnifiedSearch with result selection and filtering.
 */

import { useState } from 'react';
import UnifiedSearch from '../UnifiedSearch';
import { TournamentSearchResultResponse } from '../../services/tournamentSearchService';

export const ShopSearchExample = () => {
    const [selectedResults, setSelectedResults] = useState<TournamentSearchResultResponse[]>([]);

    const handleResultSelect = (result: TournamentSearchResultResponse) => {
        setSelectedResults((prev) => {
            const exists = prev.some((r) => r.id === result.id);
            return exists ? prev.filter((r) => r.id !== result.id) : [...prev, result];
        });
    };

    return (
        <div className="space-y-8">
            {/* Search Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Buscar Torneos</h2>
                    <p className="text-gray-400">Encuentra el torneo perfecto para ti</p>
                </div>

                <UnifiedSearch
                    variant="page"
                    placeholder="Busca por nombre, juego, ubicación..."
                    onResultSelect={handleResultSelect}
                    maxResults={10}
                    containerClassName="max-w-2xl"
                />
            </section>

            {/* Selected Results */}
            {selectedResults.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Torneos Seleccionados ({selectedResults.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedResults.map((tournament) => (
                            <div key={tournament.id} className="p-4 bg-slate-800 border border-cyan-500/20 rounded-lg">
                                <h4 className="font-bold text-white mb-1">{tournament.name}</h4>
                                <p className="text-sm text-cyan-400 mb-2">{tournament.game}</p>
                                <p className="text-xs text-gray-400">👥 {tournament.maxPlayers} jugadores • 💰 ${tournament.priceClient}</p>
                                <button
                                    onClick={() => handleResultSelect(tournament)}
                                    className="mt-3 w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm transition-colors"
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

/*
 * Usage in Shop component:
 * 
 * Import and use in your Shop/Tournament listing page:
 * 
 * <UnifiedSearch
 *   variant="page"
 *   placeholder="Busca por nombre, juego, ubicación..."
 *   onResultSelect={(result) => {
 *     // Handle result selection (open modal, add to comparison, etc)
 *   }}
 *   maxResults={10}
 *   containerClassName="max-w-2xl"
 * />
 */
