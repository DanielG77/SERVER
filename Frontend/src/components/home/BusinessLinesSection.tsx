import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BusinessLinesSection: React.FC = () => {
    const navigate = useNavigate();

    const lines = [
        {
            id: 'tournaments',
            title: 'Organización de Torneos',
            description: 'Crea, gestiona y participa en torneos de videojuegos con premios reales. Plataforma completa para competencia online y presencial.',
            icon: '🏆',
            color: 'from-cyan-500/20 to-blue-600/20',
            hoverColor: 'hover:from-cyan-500/40 hover:to-blue-600/40',
            accentColor: 'text-cyan-400',
            borderColor: 'border-cyan-500/30 hover:border-cyan-400/60',
            ctaText: 'Explorar Torneos',
            onClick: () => navigate('/shop'),
        },
        {
            id: 'venues',
            title: 'Reserva de Locales',
            description: 'Espacios premium para eventos gaming, LAN parties y competiciones locales. Infraestructura profesional para tu experiencia.',
            icon: '📍',
            color: 'from-lime-500/20 to-green-600/20',
            hoverColor: 'hover:from-lime-500/40 hover:to-green-600/40',
            accentColor: 'text-lime-400',
            borderColor: 'border-lime-500/30 hover:border-lime-400/60',
            ctaText: 'Ver Locales',
            onClick: () => navigate('/shop'),
        },
        {
            id: 'shop',
            title: 'Gaming Merchant',
            description: 'Tienda oficial de videojuegos, accesorios y merchandise. Productos exclusivos y precios competitivos para gamers.',
            icon: '🎮',
            color: 'from-orange-500/20 to-red-600/20',
            hoverColor: 'hover:from-orange-500/40 hover:to-red-600/40',
            accentColor: 'text-orange-400',
            borderColor: 'border-orange-500/30 hover:border-orange-400/60',
            ctaText: 'Ver Tienda',
            onClick: () => navigate('/shop'),
        },
    ];

    return (
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-blue-950 via-slate-900/95 to-blue-950 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        A Qué Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Dedicamos</span>
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Tres líneas de negocio diseñadas para ofrecerte la mejor experiencia gaming
                    </p>
                </div>

                {/* Business Lines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {lines.map((line) => (
                        <div
                            key={line.id}
                            className={`group relative bg-gradient-to-br ${line.color} ${line.hoverColor} backdrop-blur-sm border-2 ${line.borderColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden`}
                            onClick={line.onClick}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-transparent via-white/5 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="text-5xl md:text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {line.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                    {line.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
                                    {line.description}
                                </p>

                                {/* CTA Button */}
                                <button
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${line.accentColor} hover:bg-white/10 border border-white/10 hover:border-white/30 group/btn`}
                                >
                                    <span>{line.ctaText}</span>
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>

                            {/* Decorative corner accent */}
                            <div className={`absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                                <div className={`absolute inset-0 ${line.accentColor} blur-2xl rounded-full`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 mb-6">
                        Descubre cómo podemos mejorar tu experiencia gaming
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                    >
                        Explorar Ahora
                    </button>
                </div>
            </div>
        </section>
    );
};
