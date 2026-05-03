import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { TournamentSearchResults } from '../components/TournamentSearchResults';
import { useSearchTournaments } from '../hooks/useSearchTournaments';

export const SearchPage: React.FC = () => {
    const { results, isLoading, error, hasSearched, search } = useSearchTournaments();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Buscar Torneos</h1>
                    <p className="text-gray-600">Busca torneos usando lenguaje natural</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <SearchBar onSearch={search} isLoading={isLoading} />
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
                            {error}
                        </div>
                    )}
                </div>

                {/* Results */}
                <TournamentSearchResults
                    results={results}
                    isLoading={isLoading}
                    hasSearched={hasSearched}
                />
            </div>
        </div>
    );
};
