import React from 'react';

interface MetricItem {
    id: string;
    icon: string;
    number: string;
    label: string;
}

export const MetricsSection: React.FC = () => {
    const metrics: MetricItem[] = [
        {
            id: 'tournaments',
            icon: '🏆',
            number: '500+',
            label: 'Torneos Organizados',
        },
        {
            id: 'players',
            icon: '👾',
            number: '10K+',
            label: 'Jugadores Activos',
        },
        {
            id: 'venues',
            icon: '🏢',
            number: '50+',
            label: 'Locales Premium',
        },
        {
            id: 'products',
            icon: '📦',
            number: '10K+',
            label: 'Productos en Tienda',
        },
    ];

    return (
        <section className="relative py-16 md:py-20 bg-gradient-to-r from-cyan-950/50 via-slate-900 to-blue-950/50 overflow-hidden border-y border-cyan-500/20">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-lime-500/20 rounded-full blur-3xl translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Intro text */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Números que Hablan
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg">
                        La confianza de nuestra comunidad gaming en cifras
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {metrics.map((metric, idx) => (
                        <div
                            key={metric.id}
                            className="group relative flex flex-col items-center justify-center text-center p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-cyan-500/10 hover:to-orange-500/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Glow accent */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-cyan-500/10 to-orange-500/0" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300 inline-block drop-shadow-lg">
                                    {metric.icon}
                                </div>

                                {/* Number - Big and bold */}
                                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-lime-400 mb-2 drop-shadow-lg">
                                    {metric.number}
                                </div>

                                {/* Label */}
                                <p className="text-gray-300 font-semibold text-sm md:text-base leading-snug">
                                    {metric.label}
                                </p>

                                {/* Decorative line */}
                                <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-lime-400 group-hover:w-full transition-all duration-500 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom accent text */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm md:text-base">
                        Sumando experiencia. Construyendo comunidad. Impulsando el gaming.
                    </p>
                </div>
            </div>
        </section>
    );
};
