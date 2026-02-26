import api from './api';
import {
    UserTournament,
    AdminTournament,
    TournamentRequest,
    PaginatedResponse,
    ApiResponse
} from '../shared/types/api.types';

/**
 * Servicio de configuración de torneos del usuario autenticado
 * Todas las peticiones van a /api/user/tournaments
 */
export const userTournamentService = {
    /**
     * Crear un nuevo torneo (el usuario autenticado será automaticamente el propietario)
     */
    async createTournament(data: TournamentRequest): Promise<ApiResponse<UserTournament>> {
        console.log('[userTournamentService.createTournament] Enviando datos:', data);
        const response = await api.post('/api/user/tournaments', data);
        console.log('[userTournamentService.createTournament] Respuesta:', response.data);
        return response.data;
    },

    /**
     * Obtener la lista de torneos propios del usuario (solo activos)
     * @param page número de página (0-indexed)
     * @param size tamaño de página (ej: 10, 20, 50)
     */
    async getMyTournaments(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<UserTournament>>> {
        console.log(`[userTournamentService.getMyTournaments] Cargando página ${page}, tamaño ${size}`);
        try {
            const response = await api.get('/api/user/tournaments', {
                params: { page, size }
            });
            console.log('[userTournamentService.getMyTournaments] Respuesta exitosa:', response.data);
            return response.data;
        } catch (error) {
            console.error('[userTournamentService.getMyTournaments] Error:', error);
            throw error;
        }
    },

    /**
     * Obtener un torneo específico del usuario (verifica propiedad)
     */
    async getMyTournament(id: string): Promise<ApiResponse<UserTournament>> {
        console.log(`[userTournamentService.getMyTournament] Cargando torneo ${id}`);
        const response = await api.get(`/api/user/tournaments/${id}`);
        return response.data;
    },

    /**
     * Actualizar un torneo propio (verifica propiedad)
     */
    async updateMyTournament(id: string, data: TournamentRequest): Promise<ApiResponse<UserTournament>> {
        console.log(`[userTournamentService.updateMyTournament] Actualizando torneo ${id}:`, data);
        const response = await api.put(`/api/user/tournaments/${id}`, data);
        console.log('[userTournamentService.updateMyTournament] Respuesta:', response.data);
        return response.data;
    },

    /**
     * Eliminar (soft delete) un torneo propio (verifica propiedad)
     */
    async deleteMyTournament(id: string): Promise<ApiResponse<void>> {
        console.log(`[userTournamentService.deleteMyTournament] Eliminando torneo ${id}`);
        const response = await api.delete(`/api/user/tournaments/${id}`);
        return response.data;
    },
};

/**
 * Servicio de administración de torneos
 * Solo disponible para usuarios con rol ADMIN
 * Todas las peticiones van a /api/admin/tournaments
 */
export const adminTournamentService = {
    /**
     * Crear un nuevo torneo asignado a un usuario específico
     * @param data Datos del torneo
     * @param ownerId ID del usuario que será propietario del torneo
     */
    async createTournament(data: TournamentRequest, ownerId: number): Promise<ApiResponse<AdminTournament>> {
        console.log(`[adminTournamentService.createTournament] Creando para usuario ${ownerId}:`, data);
        const response = await api.post('/api/admin/tournaments', data, {
            params: { ownerId }
        });
        console.log('[adminTournamentService.createTournament] Respuesta:', response.data);
        return response.data;
    },

    /**
     * Obtener lista de TODOS los torneos (activos e inactivos)
     */
    async getAllTournaments(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<AdminTournament>>> {
        console.log(`[adminTournamentService.getAllTournaments] Cargando página ${page}, tamaño ${size}`);
        try {
            const response = await api.get('/api/admin/tournaments', {
                params: { page, size }
            });
            console.log('[adminTournamentService.getAllTournaments] Respuesta exitosa:', response.data);
            return response.data;
        } catch (error) {
            console.error('[adminTournamentService.getAllTournaments] Error:', error);
            throw error;
        }
    },

    /**
     * Obtener un torneo específico por ID
     */
    async getTournamentById(id: string): Promise<ApiResponse<AdminTournament>> {
        console.log(`[adminTournamentService.getTournamentById] Cargando torneo ${id}`);
        const response = await api.get(`/api/admin/tournaments/${id}`);
        return response.data;
    },

    /**
     * Actualizar un torneo
     */
    async updateTournament(id: string, data: TournamentRequest): Promise<ApiResponse<AdminTournament>> {
        console.log(`[adminTournamentService.updateTournament] Actualizando torneo ${id}:`, data);
        const response = await api.put(`/api/admin/tournaments/${id}`, data);
        console.log('[adminTournamentService.updateTournament] Respuesta:', response.data);
        return response.data;
    },

    /**
     * Soft delete (marcar como inactivo) un torneo
     */
    async softDeleteTournament(id: string): Promise<ApiResponse<void>> {
        console.log(`[adminTournamentService.softDeleteTournament] Eliminando (soft) torneo ${id}`);
        const response = await api.delete(`/api/admin/tournaments/${id}`);
        return response.data;
    },

    /**
     * Hard delete (eliminar físicamente) un torneo
     */
    async hardDeleteTournament(id: string): Promise<ApiResponse<void>> {
        console.log(`[adminTournamentService.hardDeleteTournament] Eliminando (hard) torneo ${id}`);
        const response = await api.delete(`/api/admin/tournaments/${id}`, {
            params: { hardDelete: true }
        });
        return response.data;
    },
};

export default {
    user: userTournamentService,
    admin: adminTournamentService,
};
