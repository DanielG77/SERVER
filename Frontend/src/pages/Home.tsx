import React from 'react';
import { Link } from 'react-router-dom';
import { useTournaments, useTournamentStats } from '../features/tournaments/hooks';
import { TournamentGrid } from '../features/tournaments/components';
import {
    TrophyIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    FireIcon,
    ArrowRightIcon,
    PlayIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const Home: React.FC = () => {
    const { tournaments: featuredTournaments, loading: tournamentsLoading } = useTournaments({
        initialLimit: 4,
        initialSortBy: 'createdAt',
        initialSortOrder: 'desc',
        autoFetch: true,
    });

    const { stats, loading: statsLoading } = useTournamentStats();

    const gameCategories = [
        {
            name: 'Shooter',
            icon: '🔫',
            color: 'from-neon-blue to-neon-purple',
            tournaments: stats?.byStatus?.open || 12,
            popularGames: ['Call of Duty', 'CS:GO', 'Valorant']
        },
        {
            name: 'MOBA',
            icon: '⚔️',
            color: 'from-neon-pink to-neon-blue',
            tournaments: 8,
            popularGames: ['League of Legends', 'Dota 2']
        },
        {
            name: 'Battle Royale',
            icon: '🎯',
            color: 'from-neon-green to-neon-blue',
            tournaments: 6,
            popularGames: ['Fortnite', 'PUBG', 'Apex Legends']
        },
        {
            name: 'Deportes',
            icon: '🏆',
            color: 'from-neon-yellow to-neon-orange',
            tournaments: 5,
            popularGames: ['FIFA', 'NBA 2K', 'Rocket League']
        },
        {
            name: 'Estrategia',
            icon: '♟️',
            color: 'from-neon-purple to-neon-pink',
            tournaments: 4,
            popularGames: ['StarCraft', 'Age of Empires']
        },
        {
            name: 'Fighting',
            icon: '🥊',
            color: 'from-neon-orange to-neon-yellow',
            tournaments: 3,
            popularGames: ['Street Fighter', 'Tekken']
        }
    ];

    return (
        <div className="min-h-screen bg-dark overflow-hidden">
            {/* Hero Section */}
            <section className="relative overflow-hidden animated-gradient particles min-h-[90vh] flex items-center">
                {/* Efecto de partículas y grid */}
                <div className="absolute inset-0 bg-grid-animated opacity-20" />
                <div className="absolute top-10 left-10 w-72 h-72 bg-neon-blue/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-neon-pink/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />

                {/* Escaneo effect */}
                <div className="absolute inset-0 scanlines" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/20 border border-neon-blue/30 mb-6 animate-pulse">
                            <SparklesIcon className="w-4 h-4 text-neon-blue animate-spin" />
                            <span className="text-neon-blue text-sm font-bold tracking-wider">
                                PLATAFORMA #1 DE TORNEOS
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black mb-6 tracking-tighter">
                            VIVE LA{' '}
                            <span className="gradient-text">
                                COMPETICIÓN
                            </span>
                            <br />
                            <span className="text-outline text-white">COMO NUNCA ANTES</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Organiza, compite y gana en torneos de los juegos más populares.
                            Únete a una comunidad global de gamers apasionados.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<PlayIcon className="w-5 h-5 animate-pulse" />}
                                className="btn-neon group"
                                as={Link}
                                to="/tournaments"
                            >
                                <span className="flex items-center">
                                    VER TORNEOS ACTIVOS
                                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                                </span>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                icon={<TrophyIcon className="w-5 h-5" />}
                                className="border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-dark hover:shadow-neon-pink"
                                as={Link}
                                to="/tournaments/create"
                            >
                                CREAR TORNEO
                            </Button>
                        </div>

                        {/* Stats mini en hero */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            {[
                                { value: stats?.total || 0, label: 'Torneos', icon: '🏆', color: 'neon-blue' },
                                { value: stats?.active || 0, label: 'Activos', icon: '⚡', color: 'neon-green' },
                                { value: '1,500+', label: 'Jugadores', icon: '👥', color: 'neon-pink' },
                                { value: '$50K+', label: 'En premios', icon: '💰', color: 'neon-yellow' }
                            ].map((stat, index) => (
                                <div key={index} className="glass-card p-4 text-center backdrop-blur-sm">
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className={`text-2xl font-bold text-${stat.color} mb-1`}>{stat.value}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 scroll-section">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                            Estadísticas en <span className="gradient-text">Tiempo Real</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Seguimiento en vivo de todos los torneos y participantes en la plataforma
                        </p>
                    </div>

                    {statsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="glass-card p-6 animate-pulse">
                                    <div className="h-8 bg-dark-lighter rounded mb-4"></div>
                                    <div className="h-4 bg-dark-lighter rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <TrophyIcon className="w-6 h-6" />,
                                    value: stats?.total || 0,
                                    label: 'Torneos Totales',
                                    color: 'neon-blue',
                                    subtitle: `+${stats?.recentCount || 0} esta semana`,
                                    bgColor: 'bg-neon-blue/10',
                                    borderColor: 'border-neon-blue/30'
                                },
                                {
                                    icon: <FireIcon className="w-6 h-6" />,
                                    value: stats?.active || 0,
                                    label: 'Torneos Activos',
                                    color: 'neon-green',
                                    subtitle: `${stats?.upcoming || 0} próximos torneos`,
                                    bgColor: 'bg-neon-green/10',
                                    borderColor: 'border-neon-green/30'
                                },
                                {
                                    icon: <UserGroupIcon className="w-6 h-6" />,
                                    value: stats?.averagePricePlayer?.toFixed(2) || '0.00',
                                    label: 'Precio Promedio',
                                    color: 'neon-pink',
                                    subtitle: `Para jugadores • $${stats?.averagePriceClient?.toFixed(2) || '0.00'} espectadores`,
                                    bgColor: 'bg-neon-pink/10',
                                    borderColor: 'border-neon-pink/30'
                                },
                                {
                                    icon: <CalendarDaysIcon className="w-6 h-6" />,
                                    value: stats?.completed || 0,
                                    label: 'Completados',
                                    color: 'neon-purple',
                                    subtitle: `${stats?.cancelled || 0} cancelados • ${stats?.draft || 0} en borrador`,
                                    bgColor: 'bg-neon-purple/10',
                                    borderColor: 'border-neon-purple/30'
                                }
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className={`glass-card p-6 border ${stat.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-glow group`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${stat.bgColor} text-${stat.color} group-hover:animate-pulse`}>
                                            {stat.icon}
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</div>
                                            <div className="text-sm text-gray-400">{stat.label}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="text-green-400">{stat.subtitle}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Tournaments */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-light/50 scroll-section">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                                Torneos <span className="gradient-text">Destacados</span>
                            </h2>
                            <p className="text-gray-400">
                                Los torneos más populares y emocionantes del momento
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            icon={<ArrowRightIcon className="w-4 h-4" />}
                            as={Link}
                            to="/tournaments"
                            className="mt-4 md:mt-0 group border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark"
                        >
                            <span className="flex items-center">
                                Ver Todos los Torneos
                                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </div>

                    <TournamentGrid
                        tournaments={featuredTournaments}
                        loading={tournamentsLoading}
                        emptyMessage="No hay torneos destacados en este momento"
                    />
                </div>
            </section>

            {/* Game Categories */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 scroll-section">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                            Categorías <span className="gradient-text">Populares</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Encuentra torneos de tus juegos favoritos en cada categoría
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gameCategories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/tournaments?category=${category.name.toLowerCase()}`}
                                className="block group perspective-1000"
                            >
                                <div className="glass-card p-6 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`text-3xl p-3 rounded-lg bg-gradient-to-br ${category.color} animate-neon-pulse`}>
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors duration-300">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {category.tournaments} torneos activos
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-500 group-hover:text-neon-blue group-hover:translate-x-2 transition-all duration-300" />
                                    </div>

                                    <div className="space-y-3">
                                        {category.popularGames.map((game, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2 px-3 bg-dark-lighter rounded-lg hover:bg-dark-light transition-colors group/item"
                                            >
                                                <span className="text-gray-300 group-hover/item:text-white transition-colors">
                                                    {game}
                                                </span>
                                                <span className="text-xs px-2 py-1 bg-neon-blue/20 text-neon-blue rounded animate-pulse">
                                                    Ver torneos
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-section">
                <div className="absolute inset-0 animated-gradient opacity-20" />
                <div className="absolute inset-0 bg-grid-animated opacity-10" />

                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/20 border border-neon-blue/30 mb-6 animate-pulse">
                        <SparklesIcon className="w-4 h-4 text-neon-blue" />
                        <span className="text-neon-blue text-sm font-bold tracking-wider">¿LISTO PARA COMPETIR?</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                        Únete a la{' '}
                        <span className="gradient-text">
                            COMUNIDAD
                        </span>{' '}
                        de gamers
                    </h2>

                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Crea tu propio torneo o únete a uno existente. La comunidad de GameTournamentHub te espera.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="primary"
                            size="lg"
                            icon={<TrophyIcon className="w-5 h-5" />}
                            className="btn-neon group bg-gradient-to-r from-neon-blue to-neon-purple border-0"
                            as={Link}
                            to="/tournaments/create"
                        >
                            <span className="flex items-center">
                                CREAR TORNEO GRATIS
                                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            icon={<UserGroupIcon className="w-5 h-5" />}
                            className="border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-dark hover:shadow-neon-pink"
                            as={Link}
                            to="/tournaments"
                        >
                            EXPLORAR TORNEOS
                        </Button>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        {[
                            { value: '24/7', label: 'Soporte', color: 'neon-blue' },
                            { value: '0%', label: 'Comisiones', color: 'neon-green' },
                            { value: '100%', label: 'Garantía', color: 'neon-pink' }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className={`text-2xl font-bold text-${item.color} mb-2`}>{item.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer minimalista
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} GameTournamentHub. Todos los derechos reservados.
                        <span className="block mt-2 text-xs text-gray-600">
                            Plataforma diseñada para gamers por gamers.
                        </span>
                    </p>
                </div>
            </footer> */}
        </div>
    );
};

export default Home;