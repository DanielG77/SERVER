import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../hooks/useTournament';
import { useState } from 'react';

const TournamentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: tournament, loading, error } = useTournament(id!);

    const [current, setCurrent] = useState(0);

    if (loading)
        return <div className="min-h-screen bg-slate-900 text-white p-10">Loading...</div>;

    if (error)
        return <div className="min-h-screen bg-slate-900 text-red-400 p-10">{error}</div>;

    if (!tournament) return null;

    const next = () =>
        setCurrent((prev) => (prev + 1) % tournament.images.length);

    const prev = () =>
        setCurrent((prev) =>
            prev === 0 ? tournament.images.length - 1 : prev - 1
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">

            <div className="container mx-auto px-6 py-12">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-10 text-blue-400 hover:text-blue-300 transition"
                >
                    ← Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

                    {/* CARRUSEL */}
                    <div className="relative">

                        <img
                            src={tournament.images[current]}
                            className="w-full h-[420px] object-cover rounded-xl shadow-2xl transition-all duration-500"
                        />

                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 px-4 py-2 rounded-lg"
                        >
                            ‹
                        </button>

                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 px-4 py-2 rounded-lg"
                        >
                            ›
                        </button>

                        <div className="flex justify-center mt-6 space-x-2">
                            {tournament.images.map((_: any, index: number) => (
                                <div
                                    key={index}
                                    className={`h-2 w-2 rounded-full transition ${index === current
                                        ? 'bg-blue-400'
                                        : 'bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>

                    </div>

                    {/* INFO */}
                    <div className="space-y-6">

                        <h1 className="text-4xl font-bold">
                            {tournament.name}
                        </h1>

                        <p className="text-slate-300 leading-relaxed">
                            {tournament.description}
                        </p>

                        <div className="border-t border-slate-700 pt-6 space-y-2 text-slate-200">
                            <p><strong>Game:</strong> {tournament.game.name}</p>
                            <p><strong>Format:</strong> {tournament.format.name}</p>
                            <p><strong>Platforms:</strong> {tournament.platforms.map((p: any) => p.name).join(', ')}</p>
                            <p><strong>Players:</strong> {tournament.minPlayers} - {tournament.maxPlayers}</p>
                            <p><strong>Start:</strong> {new Date(tournament.startAt).toLocaleDateString()}</p>
                            <p><strong>End:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                        </div>

                        <button className="mt-6 bg-blue-600 hover:bg-blue-500 transition px-8 py-3 rounded-xl font-semibold shadow-lg">
                            Register Now
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="inline-flex items-center gap-2 mb-8 px-4 py-2 
                            bg-slate-800 hover:bg-slate-700 
                            border border-slate-600 
                            rounded-lg transition 
                            text-sm font-medium"
                        >
                            ← Back to Shop
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default TournamentDetails;