import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CTASection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-slate-900 via-blue-950/50 to-slate-900 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl -translate-x-1/2" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Content */}
                <div className="text-center mb-12">
                    {/* Headline */}
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        ¿Listo para{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-lime-400 to-green-400">
                            Subir tu Nivel?
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Únete a miles de gamers profesionales que ya están transformando su experiencia gaming con nuestra plataforma.
                    </p>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12 text-sm md:text-base">
                        <div className="flex items-center gap-2 text-green-400">
                            <span>✓</span>
                            <span>Garantizado 100% Seguro</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <span>✓</span>
                            <span>Soporte 24/7</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <span>✓</span>
                            <span>Acceso Inmediato</span>
                        </div>
                    </div>

                    {/* CTA Buttons - Primary Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb:gap-6 justify-center mb-8">
                        {/* Primary CTA */}
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 md:px-12 py-4 md:py-5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-lg transition-all shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span>🎮 Explorar Torneos</span>
                        </button>

                        {/* Secondary CTA */}
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 md:px-12 py-4 md:py-5 rounded-lg bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white font-bold text-lg transition-all shadow-2xl shadow-lime-500/50 hover:shadow-lime-500/70 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span>📍 Reservar Ahora</span>
                        </button>

                        {/* Tertiary CTA */}
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 md:px-12 py-4 md:py-5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-lg transition-all shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span>📦 Ver Tienda</span>
                        </button>
                    </div>

                    {/* Secondary text */}
                    <p className="text-gray-400 text-sm md:text-base">
                        Prueba gratis y sin compromiso - Cancela cuando quieras
                    </p>
                </div>

                {/* Testimonial-style alternative CTA */}
                <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-sm text-center">
                    <p className="text-white text-lg md:text-xl mb-4 italic">
                        "La mejor plataforma gaming que he usado. Recomendado 100%"
                    </p>
                    <p className="text-gray-400 text-sm">
                        — Miles de gamers satisfechos | Rating: ⭐⭐⭐⭐⭐
                    </p>
                </div>
            </div>
        </section>
    );
};
