import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournamentsContext } from '../../../context/TournamentsContext';
import { API_BASE_URL } from '../../../shared/api/endpoints';

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).replace(/\./g, '');
};

const getTournamentStatus = (startAt: string, endAt?: string): { status: 'LIVE' | 'STARTING_SOON' | 'ENDED'; label: string; color: string } => {
    const now = new Date();
    const start = new Date(startAt);
    const end = endAt ? new Date(endAt) : null;

    if (end && now > end) {
        return { status: 'ENDED', label: 'Finalizado', color: 'bg-gray-600 text-gray-100' };
    }
    if (now >= start && (!end || now <= end)) {
        return { status: 'LIVE', label: '🔴 EN VIVO', color: 'bg-red-600 text-white shadow-lg shadow-red-500/50' };
    }
    const daysUntil = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
        return { status: 'STARTING_SOON', label: `Pronto (${daysUntil}d)`, color: 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50' };
    }
    return { status: 'STARTING_SOON', label: 'Próximo', color: 'bg-slate-600 text-white' };
};

export const RecentTournamentsSection = () => {
    const { tournaments, isLoading, error } = useTournamentsContext();
    const carouselRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const container = carouselRef.current;
        const firstCard = container.querySelector('.snap-start') as HTMLElement | null;
        if (!firstCard) return;
        const cardWidth = firstCard.clientWidth;
        const gap = 20;
        const scrollAmount = cardWidth + gap;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const FALLBACK_IMAGE = 'https://dynamic.brandcrowd.com/template/preview/design/1f19a367-62ee-4381-8d46-d1bd21e580d4?v=4&designTemplateVersion=1&size=design-preview-standalone-1x';

    const getImageUrl = (url?: string) => {
        if (!url) return FALLBACK_IMAGE;
        return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    };

    if (isLoading) {
        return (
            <section className="w-full bg-slate-950 py-16">
                <div className="text-white text-center">Cargando torneos...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full bg-slate-950 py-16">
                <div className="text-white text-center">Error al cargar los torneos</div>
            </section>
        );
    }

    // limit 5
    const visibleTournaments = (tournaments ?? [])
        .filter(tournament => tournament.active === true)
        .slice(0, 5);

    return (
        <section className="w-full bg-gradient-to-b from-slate-950 to-slate-900 py-16">
            {/* Contenedor para el contenido centrado */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cabecera */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Torneos recientes</h2>
                        <p className="text-gray-300 mt-2 text-lg">Los eventos más populares de la semana</p>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-block bg-gradient-to-r from-cyan-500 to-lime-500 hover:from-cyan-400 hover:to-lime-400 text-black font-bold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1"
                    >
                        Explorar todos
                    </button>
                </div>
            </div>

            {/* Carrusel sin padding lateral para que ocupe todo el ancho */}
            <div className="relative group pl-4 sm:pl-6 lg:pl-8">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-5 pb-4 scroll-smooth justify-start md:justify-center"
                >
                    {visibleTournaments.map((tournament) => {
                        const bannerImage = getImageUrl(tournament.images?.[0]);

                        const startAt = tournament.startAt ? formatDate(tournament.startAt) : 'Sin fecha';
                        const prize = tournament.priceClient ? `${tournament.priceClient.toFixed(2)} €` : '—';
                        const statusInfo = tournament.startAt ? getTournamentStatus(tournament.startAt, tournament.endAt) : { status: 'STARTING_SOON', label: 'Próximo', color: 'bg-slate-600 text-white' };

                        const goToShop = () => navigate(`/shop/${tournament.id}`);

                        return (
                            <div
                                key={tournament.id}
                                onClick={goToShop}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        goToShop();
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                className="snap-start shrink-0 w-80 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer group flex flex-col hover:scale-105"
                                aria-label={`Ver tienda del torneo ${tournament.name}`}
                            >
                                <div className="relative overflow-hidden rounded-t-2xl">
                                    <img
                                        loading="lazy"
                                        src={bannerImage}
                                        alt={tournament.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            if (target.src !== FALLBACK_IMAGE) {
                                                target.src = FALLBACK_IMAGE;
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                                    {/* Status Badge */}
                                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full font-bold text-sm ${statusInfo.color} backdrop-blur-sm border border-white/20`}>
                                        {statusInfo.label}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{tournament.name}</h3>
                                    <p className="text-sm text-cyan-300 mt-1">
                                        {tournament.game?.name || 'Juego'} <span className="text-white/30">•</span> {tournament.format?.name || 'Formato libre'}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                                        <p className="text-sm font-medium text-white/80 bg-cyan-500/20 px-3 py-1.5 rounded-full border border-cyan-500/30">📅 {startAt}</p>
                                        <p className="text-lime-400 font-bold text-lg drop-shadow-md">💰 {prize}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToShop();
                                        }}
                                        className="mt-4 w-full bg-gradient-to-r from-cyan-600/80 to-cyan-500/80 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50 group-hover:shadow-cyan-500/50"
                                        aria-label={`Ir a la tienda del torneo ${tournament.name}`}
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Botones de navegación */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-full shadow-xl hover:shadow-cyan-500/50 border border-cyan-400 hidden md:block focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    aria-label="Anterior torneos"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-full shadow-xl hover:shadow-cyan-500/50 border border-cyan-400 hidden md:block focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    aria-label="Siguiente torneos"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};
