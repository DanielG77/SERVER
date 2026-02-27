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

    if (isLoading) {
        return (
            <section className="w-full bg-blue-950 py-16">
                <div className="text-white text-center">Cargando torneos...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full bg-blue-950 py-16">
                <div className="text-white text-center">Error al cargar los torneos</div>
            </section>
        );
    }

    // limit 5
    const visibleTournaments = (tournaments ?? [])
        .filter(tournament => tournament.active === true)
        .slice(0, 5);

    return (
        <section className="w-full bg-blue-950 py-16">
            {/* Contenedor para el contenido centrado */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cabecera */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Torneos recientes</h2>
                        <p className="text-blue-100 mt-2 text-lg">Los eventos más populares de la semana</p>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-block bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
                    >
                        Explorar todos
                    </button>
                </div>
            </div>

            {/* Carrusel sin padding lateral para que ocupe todo el ancho */}
            <div className="relative group pl-4 sm:pl-6 lg:pl-8">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-5 pb-4 scroll-smooth"
                >
                    {visibleTournaments.map((tournament) => {
                        const bannerImage = tournament.images?.[0]
                            ? `${API_BASE_URL}${tournament.images[0]}`
                            : 'https://www.antevenio.com/wp-content/uploads/2021/03/events-esports.png';

                        const startAt = tournament.startAt ? formatDate(tournament.startAt) : 'Sin fecha';
                        const prize = tournament.priceClient ? `${tournament.priceClient.toFixed(2)} €` : '—';

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
                                className="snap-start shrink-0 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white/20 transition-all cursor-pointer group flex flex-col"
                                aria-label={`Ver tienda del torneo ${tournament.name}`}
                            >
                                <div className="relative overflow-hidden rounded-t-2xl">
                                    <img
                                        src={bannerImage}
                                        alt={tournament.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = 'https://www.antevenio.com/wp-content/uploads/2021/03/events-esports.png';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-xl text-white group-hover:text-green-400 transition-colors line-clamp-1">{tournament.name}</h3>
                                    <p className="text-sm text-blue-200 mt-1">
                                        {tournament.game?.name || 'Juego'} <span className="text-white/50">•</span> {tournament.format?.name || 'Formato libre'}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto pt-4">
                                        <p className="text-sm font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">📅 {startAt}</p>
                                        <p className="text-green-400 font-bold text-lg drop-shadow-md">💰 {prize}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevenir doble navegación por el onClick del card
                                            goToShop();
                                        }}
                                        className="mt-4 w-full bg-white/10 hover:bg-green-500 group-hover:bg-green-500 text-white hover:text-gray-900 font-bold py-2.5 rounded-xl transition-all shadow-md group-hover:shadow-green-500/50"
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
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 hidden md:block focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label="Anterior torneos"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 hidden md:block focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
