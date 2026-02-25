import { useRef } from 'react';
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

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const container = carouselRef.current;
        const firstCard = container.querySelector('.snap-start');
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

    return (
        <section className="w-full bg-blue-950 py-16">
            {/* Contenedor para el contenido centrado */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cabecera */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Torneos recientes</h2>
                        <p className="text-blue-100 mt-1">Los eventos más populares de la semana</p>
                    </div>
                    <a
                        href="/shop"
                        className="inline-block bg-green-400 hover:bg-green-500 text-gray-900 font-medium px-6 py-3 rounded-full transition shadow"
                    >
                        Explorar todos
                    </a>
                </div>
            </div>

            {/* Carrusel sin padding lateral para que ocupe todo el ancho */}
            <div className="relative group pl-4 sm:pl-6 lg:pl-8">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-5 pb-4 scroll-smooth"
                >
                    {tournaments?.map((tournament) => {
                        const bannerImage = tournament.images?.[0]
                            ? `${API_BASE_URL}${tournament.images[0]}`
                            : 'https://www.antevenio.com/wp-content/uploads/2021/03/events-esports.png';

                        const startAt = formatDate(tournament.startAt);
                        const prize = tournament.priceClient ? `${tournament.priceClient.toFixed(2)} €` : '—';

                        return (
                            <div
                                key={tournament.id}
                                className="snap-start shrink-0 w-72 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
                            >
                                <img
                                    src={bannerImage}
                                    alt={tournament.name}
                                    className="w-full h-40 object-cover rounded-t-2xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://www.antevenio.com/wp-content/uploads/2021/03/events-esports.png';
                                    }}
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{tournament.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {tournament.game.name} · {tournament.format?.name || 'Formato libre'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">📅 {startAt}</p>
                                    <p className="text-green-400 font-semibold mt-1">💰 {prize}</p>
                                    <button
                                        className="mt-3 w-full bg-green-400 hover:bg-green-500 text-gray-900 font-medium py-2 rounded-lg transition"
                                        aria-label={`Unirse a ${tournament.name}`}
                                    >
                                        Unirse
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