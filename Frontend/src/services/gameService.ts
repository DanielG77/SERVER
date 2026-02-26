import api from './api';
import {
    Game,
    GameRequest,
    ApiResponse
} from '../shared/types/api.types';

/**
 * Servicio público de juegos
 * Usa el endpoint público /games (sin autenticación requerida)
 * Devuelve directamente un array de Games
 */
export const gameService = {
    /**
     * Obtener lista de todos los juegos desde endpoint público
     */
    async getAllGames(): Promise<ApiResponse<Game[]>> {
        try {
            const response = await fetch('http://localhost:8080/games');
            const data: ApiResponse<Game[]> = await response.json();
            console.log('[gameService] Juegos obtenidos del endpoint público:', data);
            return data;
        } catch (error) {
            console.error('[gameService] Error al obtener juegos públicos:', error);
            return {
                success: false,
                message: 'Error al cargar juegos: ' + (error instanceof Error ? error.message : 'Desconocido')
            };
        }
    },
};

/**
 * Servicio de administración de juegos
 * Solo disponible para usuarios con rol ADMIN
 * Todas las peticiones van a /api/admin/games
 */
export const adminGameService = {
    /**
     * Obtener lista de todos los juegos
     */
    async getAllGames(): Promise<ApiResponse<Game[]>> {
        const response = await api.get('/api/admin/games');
        return response.data;
    },

    /**
     * Obtener un juego específico por ID
     */
    async getGameById(id: number): Promise<ApiResponse<Game>> {
        const response = await api.get(`/api/admin/games/${id}`);
        return response.data;
    },

    /**
     * Crear un nuevo juego
     */
    async createGame(data: GameRequest): Promise<ApiResponse<Game>> {
        const response = await api.post('/api/admin/games', data);
        return response.data;
    },

    /**
     * Actualizar un juego
     */
    async updateGame(id: number, data: GameRequest): Promise<ApiResponse<Game>> {
        const response = await api.put(`/api/admin/games/${id}`, data);
        return response.data;
    },

    /**
     * Eliminar (hard delete) un juego
     */
    async deleteGame(id: number): Promise<ApiResponse<void>> {
        const response = await api.delete(`/api/admin/games/${id}`);
        return response.data;
    },
};

export default adminGameService;
