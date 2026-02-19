import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom'; // ← Importamos Link
import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';

type Tournament = {
    id: string;
    name: string;
    createdAt: string;
    game?: { name: string };
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
    meta?: any;
};

const fetchLatestTournaments = async (): Promise<Tournament[]> => {
    const { data } = await apiClient.get<ApiResponse<Tournament[]>>(
        ENDPOINTS.TOURNAMENTS,
        {
            params: {
                page: 1,
                limit: 5,
                sort: 'createdAt:desc',
            },
        }
    );

    if (!data.success) throw new Error('Error fetching latest tournaments');
    return data.data;
};

export default function LatestTournamentsSection() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['tournaments', 'latest', { platformId: 3 }],
        queryFn: fetchLatestTournaments,
    });

    return (
        <section className="max-w-7xl mx-auto py-16 px-4">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Últimos Torneos</h2>
                    <p className="text-sm text-slate-500">Los 5 torneos más recientes añadidos</p>
                </div>
                {/* Reemplazamos el button por un Link con las mismas clases */}
                <Link
                    to="/shop"
                    className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-slate-50 inline-block"
                >
                    Ver todos
                </Link>
            </header>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            )}

            {error && <div className="text-sm text-red-500">No se pudieron cargar los torneos.</div>}

            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((t) => (
                        <article
                            key={t.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
                        >
                            <h3 className="text-lg font-semibold text-slate-800">{t.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Juego: {t.game?.name ?? 'N/A'}
                            </p>
                            <p className="text-xs text-slate-400 mt-3">
                                Creado el {new Date(t.createdAt).toLocaleDateString()}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}