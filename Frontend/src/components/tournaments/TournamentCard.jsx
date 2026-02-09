import React from 'react';

const TournamentCard = ({ tournament }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No programado';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'ongoing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Banner del torneo */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {tournament.images && tournament.images[0] ? (
                    <img
                        src={`http://localhost:8080/images/${tournament.images[0]}`}
                        alt={tournament.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="text-white text-2xl font-bold text-center p-4">
                        {tournament.name}
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Encabezado */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate">
                        {tournament.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.status)}`}>
                        {tournament.status.toUpperCase()}
                    </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {tournament.description}
                </p>

                {/* Precios */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-500">Precio Cliente</p>
                        <p className="text-lg font-bold text-blue-700">
                            {formatPrice(tournament.priceClient)}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-500">Precio Jugador</p>
                        <p className="text-lg font-bold text-green-700">
                            {formatPrice(tournament.pricePlayer)}
                        </p>
                    </div>
                </div>

                {/* Fechas */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Inicio: {formatDate(tournament.startAt)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Fin: {formatDate(tournament.endAt)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Creado: {formatDate(tournament.createdAt)}
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TournamentCard;