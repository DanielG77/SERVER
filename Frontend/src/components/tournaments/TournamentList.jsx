import React from 'react';
import TournamentCard from './TournamentCard';
import { useTournament } from '../../context/TournamentContext';

const TournamentList = () => {
    const { tournaments, loading, error, meta, useAxios, toggleApiMethod, fetchTournaments } = useTournament();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar torneos</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={fetchTournaments}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Torneos Disponibles</h1>
                        <p className="text-gray-600 mt-2">
                            Mostrando {tournaments.length} de {meta.pagination?.total || 0} torneos
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="mr-3 text-sm font-medium text-gray-700">
                                {useAxios ? 'Usando Axios' : 'Usando Fetch'}
                            </span>
                            <button
                                onClick={toggleApiMethod}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${useAxios ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${useAxios ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <button
                            onClick={fetchTournaments}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>

                {meta.pagination && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-blue-700">
                                Página {meta.pagination.page} de {Math.ceil(meta.pagination.total / meta.pagination.limit)}
                            </div>
                            <div className="text-sm text-blue-700">
                                Límite: {meta.pagination.limit} por página
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {tournaments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay torneos disponibles</h3>
                    <p className="text-gray-600">No se encontraron torneos en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TournamentList;