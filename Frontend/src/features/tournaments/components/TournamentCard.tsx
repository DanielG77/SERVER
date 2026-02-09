import React from 'react';
import { Link } from 'react-router-dom';
import { Tournament, TournamentStatus } from '../../../types';
import {
    CalendarIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ClockIcon,
    TrophyIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TournamentCardProps {
    tournament: Tournament;
    className?: string;
    onCardClick?: (tournament: Tournament) => void;
    showActions?: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
    tournament,
    className = '',
    onCardClick,
    showActions = true,
}) => {
    const {
        id,
        name,
        description,
        images,
        status,
        priceClient,
        pricePlayer,
        startAt,
        endAt,
        slug,
        isActive,
    } = tournament;

    // Estado con colores
    const statusConfig = {
        [TournamentStatus.DRAFT]: {
            label: 'Borrador',
            color: 'bg-gray-500 text-white',
            textColor: 'text-gray-500'
        },
        [TournamentStatus.OPEN]: {
            label: 'Inscripciones Abiertas',
            color: 'bg-green-500 text-white',
            textColor: 'text-green-500'
        },
        [TournamentStatus.RUNNING]: {
            label: 'En Curso',
            color: 'bg-blue-500 text-white',
            textColor: 'text-blue-500'
        },
        [TournamentStatus.COMPLETED]: {
            label: 'Completado',
            color: 'bg-purple-500 text-white',
            textColor: 'text-purple-500'
        },
        [TournamentStatus.CANCELLED]: {
            label: 'Cancelado',
            color: 'bg-red-500 text-white',
            textColor: 'text-red-500'
        },
    };

    const statusInfo = statusConfig[status];
    const mainImage = images && images.length > 0 ? images[0] : '/default-tournament.jpg';

    // Formatear fechas
    const formattedStartDate = startAt
        ? format(new Date(startAt), 'dd MMM yyyy', { locale: es })
        : 'Sin fecha';

    const formattedEndDate = endAt
        ? format(new Date(endAt), 'dd MMM yyyy', { locale: es })
        : 'Indefinido';

    // Manejar click en la card
    const handleClick = () => {
        if (onCardClick) {
            onCardClick(tournament);
        }
    };

    // Obtener la descripción truncada
    const getTruncatedDescription = (text: string, maxLength: number = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div
            className={`group bg-dark-light rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 ${className} ${!isActive ? 'opacity-70' : ''
                }`}
            onClick={handleClick}
        >
            {/* Estado del torneo */}
            <div className="px-4 pt-4 flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                </span>

                {!isActive && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                        Inactivo
                    </span>
                )}
            </div>

            {/* Imagen del torneo */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={mainImage}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />

                {/* Overlay de precios */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-white">${pricePlayer}</span>
                        </div>
                        <p className="text-xs text-gray-300">Jugador</p>
                    </div>

                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-white">${priceClient}</span>
                        </div>
                        <p className="text-xs text-gray-300">Espectador</p>
                    </div>
                </div>
            </div>

            {/* Contenido de la card */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {name}
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                    {getTruncatedDescription(description)}
                </p>

                {/* Información adicional */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300">
                        <CalendarIcon className="w-5 h-5 mr-3 text-primary" />
                        <div className="text-sm">
                            <span className="font-medium">Inicio: </span>
                            <span>{formattedStartDate}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-gray-300">
                        <ClockIcon className="w-5 h-5 mr-3 text-primary" />
                        <div className="text-sm">
                            <span className="font-medium">Fin: </span>
                            <span>{formattedEndDate}</span>
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                {showActions && (
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                        <Link
                            to={`/tournaments/${slug}`}
                            className="inline-flex items-center text-primary hover:text-primary-light font-medium text-sm group/link"
                        >
                            Ver detalles
                            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex items-center">
                            <TrophyIcon className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-300">Premio</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente para mostrar lista de torneos en grid
export const TournamentGrid: React.FC<{
    tournaments: Tournament[];
    loading?: boolean;
    emptyMessage?: string;
    onCardClick?: (tournament: Tournament) => void;
}> = ({
    tournaments,
    loading = false,
    emptyMessage = 'No se encontraron torneos',
    onCardClick
}) => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-dark-light rounded-xl animate-pulse h-96"></div>
                    ))}
                </div>
            );
        }

        if (tournaments.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">{emptyMessage}</div>
                    <div className="text-gray-400">Intenta con otros filtros de búsqueda</div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tournaments.map((tournament) => (
                    <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        onCardClick={onCardClick}
                        className="h-full"
                    />
                ))}
            </div>
        );
    };

export default TournamentCard;