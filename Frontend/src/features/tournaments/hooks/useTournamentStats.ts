import { useState, useEffect, useCallback } from 'react';
import { tournamentApi } from '../../../api/tournamentApi';
import { TournamentStatus } from '../../../types';

interface TournamentStats {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    draft: number;
    byStatus: Record<TournamentStatus, number>;
    recentCount: number; // Torneos creados en los últimos 7 días
    averagePriceClient: number;
    averagePricePlayer: number;
}

export const useTournamentStats = (autoFetch = true) => {
    // Estados
    const [stats, setStats] = useState<TournamentStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Obtener estadísticas
    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener todos los torneos para calcular estadísticas
            const response = await tournamentApi.getTournaments({
                limit: 1000, // Obtener muchos para calcular
                sortBy: 'createdAt',
                sortOrder: 'desc',
            });

            const tournaments = response.items;

            // Calcular estadísticas
            const byStatus = tournaments.reduce((acc, tournament) => {
                acc[tournament.status] = (acc[tournament.status] || 0) + 1;
                return acc;
            }, {} as Record<TournamentStatus, number>);

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentCount = tournaments.filter(t => {
                const createdAt = new Date(t.createdAt);
                return createdAt >= sevenDaysAgo;
            }).length;

            const activeTournaments = tournaments.filter(t => t.isActive);
            const totalPriceClient = activeTournaments.reduce((sum, t) => sum + t.priceClient, 0);
            const totalPricePlayer = activeTournaments.reduce((sum, t) => sum + t.pricePlayer, 0);

            const statsData: TournamentStats = {
                total: tournaments.length,
                active: tournaments.filter(t => t.isActive).length,
                upcoming: tournaments.filter(t =>
                    new Date(t.startAt) > new Date() && t.status === 'open'
                ).length,
                completed: byStatus['completed'] || 0,
                cancelled: byStatus['cancelled'] || 0,
                draft: byStatus['draft'] || 0,
                byStatus,
                recentCount,
                averagePriceClient: activeTournaments.length > 0
                    ? totalPriceClient / activeTournaments.length
                    : 0,
                averagePricePlayer: activeTournaments.length > 0
                    ? totalPricePlayer / activeTournaments.length
                    : 0,
            };

            setStats(statsData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar las estadísticas');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Efecto para cargar automáticamente
    useEffect(() => {
        if (autoFetch) {
            fetchStats();
        }
    }, [fetchStats, autoFetch]);

    // Refresh
    const refresh = useCallback(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refresh,
    };
};