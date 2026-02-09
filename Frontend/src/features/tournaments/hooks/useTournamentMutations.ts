import { useState, useCallback } from 'react';
import { tournamentApi, CreateTournamentDto } from '../../../api/tournamentApi';
import { Tournament } from '../../../types';

export const useTournamentMutations = () => {
    // Estados
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Crear torneo
    const createTournament = useCallback(async (data: CreateTournamentDto): Promise<Tournament | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const tournament = await tournamentApi.createTournament(data);
            setSuccess(true);
            return tournament;
        } catch (err: any) {
            setError(err.message || 'Error al crear el torneo');
            console.error('Error creating tournament:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Actualizar torneo
    const updateTournament = useCallback(async (id: string, data: Partial<CreateTournamentDto>): Promise<Tournament | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const tournament = await tournamentApi.updateTournament(id, data);
            setSuccess(true);
            return tournament;
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el torneo');
            console.error('Error updating tournament:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Eliminar torneo
    const deleteTournament = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await tournamentApi.deleteTournament(id);
            setSuccess(true);
            return true;
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el torneo');
            console.error('Error deleting tournament:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Resetear estado
    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return {
        // Estado
        loading,
        error,
        success,

        // Acciones
        createTournament,
        updateTournament,
        deleteTournament,
        reset,
    };
};