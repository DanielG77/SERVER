import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames } from '../../../context/GamesContext';
import { API_BASE_URL } from '../../../shared/api/endpoints';

export default function HeroCarousel() {
    const { games, isLoading, error } = useGames();
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

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

    console.log('Juegos cargados en HeroCarousel:', games);
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
                        {/* Background */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${game.iconUrl}')` }}
                        />

                        {/* Overlay */}
                        <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/30" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center pt-16">
                            <div className="max-w-4xl">
                                {/* Title */}
                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-green-300">
                                    {game.name}
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg md:text-xl mb-8 drop-shadow-lg text-green-300 font-bold">
                                    Torneos • Locales para Eventos • Gaming Shop
                                </p>

                                {/* Description */}
                                <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto drop-shadow-lg text-gray-300 leading-relaxed">
                                    {game.description}
                                </p>

                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => navigate(`/shop?gameId=${game.id}&is_active=true`)}
                                        className="px-10 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold text-lg transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 hover:-translate-y-1 transform"
                                    >
                                        🎮 Ver Torneos
                                    </button>
                                    <button
                                        onClick={() => navigate('/shop')}
                                        className="px-10 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-lime-400 hover:to-green-500 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/50 hover:shadow-green-500/80 hover:-translate-y-1 transform border border-white/20"
                                    >
                                        📍 Reservar Local
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev Button */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Slide anterior"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Next Button */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Siguiente slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
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