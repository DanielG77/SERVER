import { useRef } from 'react';
import { useCategoriesContext } from '@/contexts/CategoriesContext';

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
    const { categories, isLoading, error } = useCategoriesContext();
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
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">Cargando categorías...</div>
                </div>
            </section>
        );
    }

    if (error || !categories?.length) {
        return (
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">No hay categorías disponibles</div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h2>
                <p className="text-gray-500 mb-8">Explora por tipo de juego o plataforma</p>

                <div className="relative group">
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-5 pb-4 scroll-smooth"
                    >
                        {categories.map((category) => {
                            const imageUrl = getCategoryImage(category.name);
                            return (
                                <div
                                    key={category.id}
                                    className="snap-start shrink-0 w-56 h-72 rounded-2xl shadow-md bg-cover bg-center relative"
                                    style={{ backgroundImage: `url('${imageUrl}')` }}
                                >
                                    <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white text-center rounded-b-2xl">
                                        <h3 className="font-semibold text-lg">{category.name}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botones de navegación */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 hidden md:block focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-label="Anterior categorías"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 hidden md:block focus:outline-none focus:ring-2 focus:ring-indigo-400"
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