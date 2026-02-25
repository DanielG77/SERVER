// hooks/useTournament.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface Tournament {
    id: string;
    name: string;
    description: string;
    images: string[];
    game: { id: string; name: string };
    format: { id: string; name: string };
    platforms: { id: string; name: string }[];
    minPlayers: number;
    maxPlayers: number;
    startAt: string;
    endDate: string;
    priceClient: number;
    pricePlayer: number;
    status: string;
}

interface UseTournamentReturn {
    data: Tournament | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTournament = (id: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/tournaments/${id}`
                );

                const json = await res.json();

                if (!json.success) {
                    throw new Error('API returned error');
                }

                setData(json.data); // 🔥 IMPORTANTE
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTournament();
    }, [id]);

    return { data, loading, error };
};