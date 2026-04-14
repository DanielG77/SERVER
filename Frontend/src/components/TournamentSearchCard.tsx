import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TournamentSearchCardProps {
    id: string;
    name: string;
    game: string;
    description: string;
    price: number;
    startAt: string;
    isOnline: boolean;
    maxPlayers: number;
    score: number;
    reason?: string;
}

export const TournamentSearchCard: React.FC<TournamentSearchCardProps> = ({
    id,
    name,
    game,
    description,
    price,
    startAt,
    isOnline,
    maxPlayers,
    score,
    reason,
}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/shop/${id}`);
    };
    const scorePercent = Math.round(score * 100);
    const startDate = new Date(startAt);
    const formattedDate = startDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-600">{game}</p>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-600">
                        <span className="text-lg font-bold text-blue-600">{scorePercent}%</span>
                    </div>
                </div>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                    <span className="text-gray-600">Precio:</span>
                    <p className="font-semibold text-gray-900">${price.toFixed(2)}</p>
                </div>
                <div>
                    <span className="text-gray-600">Fecha:</span>
                    <p className="font-semibold text-gray-900">{formattedDate}</p>
                </div>
                <div>
                    <span className="text-gray-600">Plataforma:</span>
                    <p className="font-semibold text-gray-900">{isOnline ? '🌐 Online' : '📍 Presencial'}</p>
                </div>
                <div>
                    <span className="text-gray-600">Jugadores:</span>
                    <p className="font-semibold text-gray-900">Hasta {maxPlayers}</p>
                </div>
            </div>

            {reason && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                    <p className="text-sm text-blue-900">
                        <span className="font-semibold">¿Por qué coincide? </span>
                        {reason}
                    </p>
                </div>
            )}

            <button
                onClick={handleViewDetails}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
                Ver detalles
            </button>
        </div>
    );
};
