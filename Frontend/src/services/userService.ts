import api from './api';
import {
    User,
    UserUpdateRequest,
    PaginatedResponse,
    ApiResponse
} from '../shared/types/api.types';

/**
 * Servicio de administración de usuarios
 * Solo disponible para usuarios con rol ADMIN
 * Todas las peticiones van a /api/admin/users
 */
export const adminUserService = {
    /**
     * Obtener lista de todos los usuarios
     */
    async getAllUsers(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
        const response = await api.get('/api/admin/users', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Obtener un usuario específico por ID
     */
    async getUserById(id: number): Promise<ApiResponse<User>> {
        const response = await api.get(`/api/admin/users/${id}`);
        return response.data;
    },

    /**
     * Actualizar un usuario (email, roles, is_active)
     */
    async updateUser(id: number, data: UserUpdateRequest): Promise<ApiResponse<User>> {
        const response = await api.put(`/api/admin/users/${id}`, data);
        return response.data;
    },

    /**
     * Soft delete (marcar como inactivo) un usuario
     */
    async softDeleteUser(id: number): Promise<ApiResponse<void>> {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    },

    /**
     * Hard delete (eliminar físicamente) un usuario
     */
    async hardDeleteUser(id: number): Promise<ApiResponse<void>> {
        const response = await api.delete(`/api/admin/users/${id}`, {
            params: { hardDelete: true }
        });
        return response.data;
    },
};

export default adminUserService;
