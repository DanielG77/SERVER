import { useState, useEffect } from 'react';
import { useGamesContext } from '@/contexts/GamesContext';
import { API_BASE_URL } from '@/shared/api/endpoints';

export default function HeroCarousel() {
    const { games, isLoading, error } = useGamesContext();
    const [current, setCurrent] = useState(0);

    // Auto play
    useEffect(() => {
        if (!games || games.length === 0) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % games.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [games]);

    const goToSlide = (index: number) => setCurrent(index);
    const prevSlide = () =>
        setCurrent((prev) => (prev - 1 + (games?.length || 0)) % (games?.length || 1));
    const nextSlide = () =>
        setCurrent((prev) => (prev + 1) % (games?.length || 1));

    if (isLoading) {
        return (
            <section className="relative h-screen w-full overflow-hidden bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando juegos...</div>
            </section>
        );
    }

    if (error || !games || games.length === 0) {
        return (
            <section className="relative h-screen w-full overflow-hidden bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">No hay juegos disponibles</div>
            </section>
        );
    }

    return (
        <section className="relative h-screen w-full overflow-hidden" aria-label="Carrusel de juegos">
            <div className="relative h-full w-full">
                {games.map((game, index) => (
                    <div
                        key={game.id}
                        className={`absolute inset-0 hero-fade transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                            }`}
                        data-index={index}
                        aria-hidden={index !== current}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${API_BASE_URL}${game.iconUrl}')` }}
                        />
                        <div className="hero-overlay absolute inset-0" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center pt-16">
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                                {game.name}
                            </h2>
                            <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md">
                                {game.description}
                            </p>
                            <a
                                href={`/juegos/${game.id}`}
                                className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-8 py-4 rounded-full text-lg transition shadow-xl"
                            >
                                Ver torneos
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botones anterior/siguiente */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Slide anterior"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Siguiente slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots indicadores */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                {games.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white ${index === current ? 'bg-white/80' : 'bg-white/40 hover:bg-white/80'
                            }`}
                        aria-label={`Ir a slide ${index + 1}`}
                        aria-current={index === current ? 'true' : undefined}
                    />
                ))}
            </div>
        </section>
    );
}