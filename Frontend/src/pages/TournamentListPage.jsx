import React from 'react';
import TournamentList from '../components/tournaments/TournamentList'; // Importar el componente correcto
import { TournamentProvider } from '../context/TournamentContext';

const TournamentListPage = () => {
    return (
        <TournamentProvider>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
                            🏆 Shop de Torneos
                        </h1>
                        <p className="text-center text-gray-600">
                            Explora y gestiona torneos deportivos con React, Fetch y Axios
                        </p>
                    </header>

                    <TournamentList /> {/* Usar el componente correcto */}

                    <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>Arquitectura Context API • Tailwind CSS v3 • Fetch/Axios</p>
                        <p className="mt-2">Endpoint: http://localhost:8080/tournaments</p>
                    </footer>
                </div>
            </div>
        </TournamentProvider>
    );
};

export default TournamentListPage;