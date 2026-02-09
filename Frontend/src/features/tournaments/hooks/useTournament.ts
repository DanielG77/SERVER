import { useState, useEffect, useCallback } from 'react';
import { tournamentApi } from '../../../api/tournamentApi';
import { Tournament, TournamentStatus } from '../../../types';

interface UseTournamentOptions {
    id?: string;
    slug?: string;
    autoFetch?: boolean;
}

export const useTournament = (options: UseTournamentOptions) => {
    const { id, slug, autoFetch = true } = options;

    // Estados
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);

    // Obtener torneo por ID o slug
    const fetchTournament = useCallback(async () => {
        if (!id && !slug) return;

        setLoading(true);
        setError(null);

        try {
            const data = id
                ? await tournamentApi.getTournamentById(id)
                : await tournamentApi.getTournamentBySlug(slug!);

            setTournament(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar el torneo');
            console.error('Error fetching tournament:', err);
        } finally {
            setLoading(false);
        }
    }, [id, slug]);

    // Efecto para cargar automáticamente
    useEffect(() => {
        if (autoFetch && (id || slug)) {
            fetchTournament();
        }
    }, [fetchTournament, autoFetch, id, slug]);

    // Actualizar torneo
    const updateTournament = useCallback(async (updates: Partial<Tournament>) => {
        if (!tournament?.id) return null;

        setUpdating(true);
        try {
            const updated = await tournamentApi.updateTournament(tournament.id, updates);
            setTournament(updated);
            return updated;
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el torneo');
            console.error('Error updating tournament:', err);
            return null;
        } finally {
            setUpdating(false);
        }
    }, [tournament?.id]);

    // Cambiar estado del torneo
    const changeStatus = useCallback(async (newStatus: TournamentStatus) => {
        return updateTournament({ status: newStatus });
    }, [updateTournament]);

    // Activar/desactivar torneo
    const toggleActive = useCallback(async () => {
        if (!tournament) return null;

        return updateTournament({ isActive: !tournament.isActive });
    }, [tournament, updateTournament]);

    // Refrescar datos
    const refresh = useCallback(() => {
        fetchTournament();
    }, [fetchTournament]);

    return {
        // Estado
        tournament,
        loading,
        updating,
        error,

        // Acciones
        fetchTournament,
        updateTournament,
        changeStatus,
        toggleActive,
        refresh,
    };
};