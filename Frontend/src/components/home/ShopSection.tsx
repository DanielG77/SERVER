import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ShopSection: React.FC = () => {
    const navigate = useNavigate();

    // Placeholder featured products/categories
    const featuredItems = [
        {
            id: 1,
            name: 'Call of Duty',
            category: 'FPS',
            price: '$59.99',
            icon: '🎯',
            color: 'from-red-500/20 to-orange-600/20',
        },
        {
            id: 2,
            name: 'League of Legends',
            category: 'MOBA',
            price: 'Free',
            icon: '⚔️',
            color: 'from-cyan-500/20 to-lime-600/20',
        },
        {
            id: 3,
            name: 'VALORANT Merchandise',
            category: 'Accesorios',
            price: '$29.99',
            icon: '🎮',
            color: 'from-pink-500/20 to-rose-600/20',
        },
        {
            id: 4,
            name: 'Gaming Headset Pro',
            category: 'Hardware',
            price: '$149.99',
            icon: '🎧',
            color: 'from-green-500/20 to-emerald-600/20',
        },
    ];

    return (
        <section className="relative py-16 md:py-24 bg-slate-900/50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Gaming Shop
                            </h2>
                            <p className="text-gray-400 text-base md:text-lg">
                                Productos destacados y exclusivas para gamers
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1 w-full md:w-auto"
                        >
                            Ver Catálogo Completo
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate('/shop')}
                            className="group relative cursor-pointer bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-transparent via-white/10 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon - Large */}
                                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300 inline-block">
                                    {item.icon}
                                </div>

                                {/* Item Name */}
                                <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                    {item.name}
                                </h3>

                                {/* Category */}
                                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
                                    {item.category}
                                </p>

                                {/* Price */}
                                <div className="mb-4 pb-4 border-b border-white/10">
                                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">
                                        {item.price}
                                    </p>
                                </div>

                                {/* CTA */}
                                <button
                                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-white text-sm font-bold transition-all duration-200 group-hover:shadow-lg"
                                >
                                    Ver Detalles →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom text */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">
                        Productos limitados y exclusivos disponibles solo en nuestra plataforma
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-blue-400/50 text-blue-300 font-bold hover:bg-blue-500/20 transition-all"
                    >
                        Explorar la Tienda Completa
                        <span>→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};
