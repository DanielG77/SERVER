type Category = {
    id: string;
    title: string;
    subtitle?: string;
    count?: number;
    emoji?: string;
};


const MOCK_CATEGORIES: Category[] = [
    { id: '1', title: 'Competitivo', subtitle: 'Torneos con bracket y premios', count: 124, emoji: '🏆' },
    { id: '2', title: 'Casual & Community', subtitle: 'Eventos abiertos, ligas locales', count: 78, emoji: '🎉' },
    { id: '3', title: 'Online', subtitle: 'Plataforma: PC / Consolas', count: 212, emoji: '💻' },
];


const CategoryCard = ({ c }: { c: Category }) => {
    return (
        <article className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-vivid-blue/10 to-vivid-purple/10 text-2xl">
                    <span aria-hidden>{c.emoji}</span>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{c.title}</h3>
                    <p className="text-sm text-slate-500">{c.subtitle}</p>
                </div>
            </div>


            <div className="mt-auto flex items-center justify-between">
                <div className="text-sm text-slate-500">{c.count} torneos</div>
                <button className="text-sm font-medium px-3 py-1 rounded-lg border border-gray-200 hover:bg-slate-50">Ver</button>
            </div>
        </article>
    );
};


export default function CategoriesSection() {
    return (
        <section className="max-w-7xl mx-auto py-12 px-4">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Explora por categoría</h2>
                <p className="text-sm text-slate-500">Tres separaciones claras para navegar los tipos de torneos</p>
            </header>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {MOCK_CATEGORIES.map(c => (
                    <CategoryCard key={c.id} c={c} />
                ))}
            </div>
        </section>
    );
}