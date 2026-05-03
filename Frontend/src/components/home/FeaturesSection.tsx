import React from 'react';

interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export const FeaturesSection: React.FC = () => {
    const features: Feature[] = [
        {
            id: 'management',
            icon: '⚙️',
            title: 'Gestión Integral',
            description: 'Administra torneos, reservas y tienda desde una plataforma unificada',
        },
        {
            id: 'community',
            icon: '👥',
            title: 'Comunidad Gaming',
            description: 'Conecta con miles de jugadores y construye tu red profesional',
        },
        {
            id: 'premium',
            icon: '✨',
            title: 'Experiencia Premium',
            description: 'Espacios de primera categoría equipados con tecnología de punta',
        },
        {
            id: 'support',
            icon: '🎯',
            title: 'Soporte 24/7',
            description: 'Equipo dedicado disponible para ayudarte en cada momento',
        },
        {
            id: 'exclusive',
            icon: '🏅',
            title: 'Acceso Exclusivo',
            description: 'Productos y eventos exclusivos para miembros de la plataforma',
        },
        {
            id: 'growth',
            icon: '📈',
            title: 'Crecimiento Garantizado',
            description: 'Herramientas que ayudan a amplificar tu presencia en el gaming',
        },
    ];

    return (
        <section className="relative py-16 md:py-24 bg-slate-900/50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        ¿Por Qué Elegirnos?
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg">
                        Beneficios que te harán destacar en el mundo gaming
                    </p>
                </div>

                {/* Features Grid - 2 cols on mobile, 3 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 rounded-xl p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Glow on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-lime-500/0" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="text-4xl mb-4 group-hover:scale-120 transition-transform duration-300 inline-block">
                                    {feature.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Visual accent line */}
                                <div className="mt-4 h-1 w-8 bg-gradient-to-r from-cyan-400 to-lime-400 rounded-full group-hover:w-16 transition-all duration-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
