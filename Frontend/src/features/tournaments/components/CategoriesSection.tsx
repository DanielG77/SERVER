import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../context/CategoriesContext';

// Mapa de imágenes placeholder por categoría (podría ser una función que asigne según el nombre)
const getCategoryImage = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    // Asignamos imágenes representativas (puedes cambiarlas después)
    if (name.includes('shooter')) return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop';
    if (name.includes('moba')) return 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=400&auto=format&fit=crop';
    if (name.includes('battle')) return 'https://images.unsplash.com/photo-1604866830893-c13cafa515d6?w=400&auto=format&fit=crop';
    if (name.includes('estrategia')) return 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&auto=format&fit=crop';
    if (name.includes('lucha')) return 'https://images.unsplash.com/photo-1614680376408-81e5b15c4e97?w=400&auto=format&fit=crop';
    if (name.includes('deportes')) return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop';
    // fallback
    return 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&auto=format&fit=crop';
};

export const CategoriesSection = () => {
    const { categories, isLoading, error } = useCategories();
    const carouselRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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
            <section className="bg-slate-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">Cargando categorías...</div>
                </div>
            </section>
        );
    }

    if (error || !categories?.length) {
        return (
            <section className="bg-slate-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">No hay categorías disponibles</div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gradient-to-b from-slate-950 to-slate-950 py-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-400 mb-2">Categorías destacadas</h2>
                <p className="text-gray-300 text-lg mb-10">Explora por tipo de juego y encuentra tus favoritos</p>

                <div className="relative group">
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 pb-4 scroll-smooth"
                    >
                        {categories.map((category) => {
                            const imageUrl = getCategoryImage(category.name);
                            return (
                                <div
                                    key={category.id}
                                    onClick={() => navigate('/shop', { state: { categoryId: category.id } })}
                                    className="snap-start shrink-0 w-64 h-80 rounded-2xl shadow-lg hover:shadow-cyan-500/30 hover:scale-105 cursor-pointer transition-all duration-300 bg-cover bg-center relative group overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50"
                                    style={{ backgroundImage: `url('${imageUrl}')` }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            navigate('/shop', { state: { categoryId: category.id } });
                                        }
                                    }}
                                    aria-label={`Ver categoría ${category.name}`}
                                >
                                    {/* Overlay gradient - mejorado */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-900/20 opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                                    {/* Accent glow on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/0 via-transparent to-orange-600/0 group-hover:from-cyan-500/20 group-hover:to-orange-500/20 transition-all duration-300" />

                                    {/* Border accent */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/40 rounded-2xl transition-colors duration-300" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 transform group-hover:translate-y-0 transition-transform delay-75">
                                        <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-lg group-hover:text-cyan-300 transition-colors">{category.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                            <span className="text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">Explorar →</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botones de navegación - estilo gaming */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white p-3 rounded-full shadow-lg hover:shadow-cyan-500/50 border border-cyan-400 hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                        aria-label="Anterior categorías"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white p-3 rounded-full shadow-lg hover:shadow-cyan-500/50 border border-cyan-400 hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                        aria-label="Siguiente categorías"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};