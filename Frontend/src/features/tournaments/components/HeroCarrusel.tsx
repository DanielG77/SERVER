import { useState, useEffect } from 'react';

type Slide = {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta?: string;
};

const SLIDES: Slide[] = [
    {
        id: '1',
        title: 'Compite en los torneos más grandes',
        subtitle: 'Descubre eventos activos en PC, PlayStation y Xbox',
        image:
            'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?q=80&w=1920&auto=format&fit=crop',
        cta: 'Explorar torneos',
    },
    {
        id: '2',
        title: 'Los últimos torneos añadidos',
        subtitle: 'Mantente al día con los eventos más recientes',
        image:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop',
        cta: 'Ver últimos torneos',
    },
    {
        id: '3',
        title: 'Juega en tu plataforma favorita',
        subtitle: 'PC, PlayStation, Xbox y más',
        image:
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop',
        cta: 'Ver plataformas',
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev: number) => (prev + 1) % SLIDES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const slide = SLIDES[current];

    return (
        <section className="relative h-[75vh] w-full overflow-hidden">
            <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
                        {slide.title}
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
                        {slide.subtitle}
                    </p>

                    <button className="mt-8 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-gray-100 transition-colors">
                        {slide.cta}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 w-8 rounded-full transition-all ${index === current ? 'bg-white' : 'bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}