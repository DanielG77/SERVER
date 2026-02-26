import { useState, useEffect } from 'react';
import { Tournament } from '../shared/types/tournament.types';

interface UseTournamentReturn {
    data: Tournament | null;
    loading: boolean;
    error: string | null;
}

interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
}

export const useTournament = (id: string): UseTournamentReturn => {
    const [data, setData] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTournament = async (): Promise<void> => {
            try {
                const res = await fetch(
                    `http://localhost:8080/tournaments/${id}`
                );

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }

                const json: ApiResponse<Tournament> = await res.json();

                if (!json.success) {
                    throw new Error(json.message || 'API returned error');
                }

                if (json.data) {
                    setData(json.data);
                } else {
                    setError('Tournament data is null or missing');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTournament();
        } else {
            setError('Tournament ID is required');
            setLoading(false);
        }
    }, [id]);

    return { data, loading, error };
};