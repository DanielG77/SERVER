import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
    Tournament,
    TournamentStatus,
    PaginatedResponse,
    TournamentFilters,
    TournamentQueryParams,
    ApiResponse
} from '../types';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8080/api';
const API_TIMEOUT = 10000;

// Crear instancia de axios con configuración personalizada
const createApiClient = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    // Interceptor para manejar respuestas y errores globalmente
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                // El servidor respondió con un código de error
                console.error('API Error:', {
                    status: error.response.status,
                    data: error.response.data,
                    url: error.config?.url
                });

                // Puedes manejar errores específicos aquí
                switch (error.response.status) {
                    case 401:
                        // Redirigir a login o refrescar token
                        break;
                    case 403:
                        // Mostrar error de permisos
                        break;
                    case 404:
                        // Recurso no encontrado
                        break;
                    case 500:
                        // Error del servidor
                        break;
                }
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta
                console.error('Network Error:', error.message);
            } else {
                // Error al configurar la petición
                console.error('Request Error:', error.message);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// Instancia global de la API
const apiClient = createApiClient();

// Tipos para las respuestas específicas
export interface TournamentListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: TournamentStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
}

export interface CreateTournamentDto {
    name: string;
    description: string;
    images: string[];
    status: TournamentStatus;
    priceClient: number;
    pricePlayer: number;
    isActive: boolean;
    startAt: string;
    endAt: string;
    slug: string;
}

export interface UpdateTournamentDto extends Partial<CreateTournamentDto> {
    id: string;
}

// Servicio de Torneos
export const tournamentApi = {
    /**
     * Obtener lista paginada de torneos con filtros
     */
    getTournaments: async (
        params?: TournamentListParams
    ): Promise<PaginatedResponse<Tournament>> => {
        try {
            const response: AxiosResponse<PaginatedResponse<Tournament>> = await apiClient.get('/api/tournaments', {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    sortBy: params?.sortBy || 'createdAt',
                    sortOrder: params?.sortOrder || 'desc',
                    ...params,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            throw error;
        }
    },

    /**
     * Obtener torneo por ID
     */
    getTournamentById: async (id: string): Promise<Tournament> => {
        try {
            const response: AxiosResponse<Tournament> = await apiClient.get(`/api/tournaments/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching tournament ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtener torneo por slug
     */
    getTournamentBySlug: async (slug: string): Promise<Tournament> => {
        try {
            const response: AxiosResponse<Tournament> = await apiClient.get(`/api/tournaments/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching tournament by slug ${slug}:`, error);
            throw error;
        }
    },

    /**
     * Crear nuevo torneo
     */
    createTournament: async (data: CreateTournamentDto): Promise<Tournament> => {
        try {
            const response: AxiosResponse<Tournament> = await apiClient.post('/tournaments', data);
            return response.data;
        } catch (error) {
            console.error('Error creating tournament:', error);
            throw error;
        }
    },

    /**
     * Actualizar torneo existente
     */
    updateTournament: async (id: string, data: Partial<CreateTournamentDto>): Promise<Tournament> => {
        try {
            const response: AxiosResponse<Tournament> = await apiClient.put(`/tournaments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating tournament ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar torneo
     */
    deleteTournament: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/tournaments/${id}`);
        } catch (error) {
            console.error(`Error deleting tournament ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas de torneos
     */
    // getTournamentStats: async (): Promise<{
    //     total: number;
    //     active: number;
    //     upcoming: number;
    //     completed: number;
    // }> => {
    //     try {
    //         const response: AxiosResponse = await apiClient.get('/tournaments/stats');
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching tournament stats:', error);
    //         throw error;
    //     }
    // },

    /**
     * Buscar torneos por término
     */
    searchTournaments: async (
        term: string,
        params?: Omit<TournamentListParams, 'search'>
    ): Promise<PaginatedResponse<Tournament>> => {
        try {
            const response: AxiosResponse<PaginatedResponse<Tournament>> = await apiClient.get('/tournaments/search', {
                params: {
                    term,
                    ...params,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error searching tournaments with term "${term}":`, error);
            throw error;
        }
    },

    /**
     * Obtener torneos por estado
     */
    getTournamentsByStatus: async (
        status: TournamentStatus,
        params?: Omit<TournamentListParams, 'status'>
    ): Promise<PaginatedResponse<Tournament>> => {
        try {
            const response: AxiosResponse<PaginatedResponse<Tournament>> = await apiClient.get(`/tournaments/status/${status}`, {
                params,
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching tournaments with status ${status}:`, error);
            throw error;
        }
    },
};

// Funciones de utilidad para construir queries
export const buildTournamentQuery = (filters: TournamentFilters = {}): TournamentListParams => {
    const query: TournamentListParams = {};

    if (filters.status) query.status = filters.status;
    if (filters.search) query.search = filters.search;
    if (filters.startDate) query.startDate = filters.startDate;
    if (filters.endDate) query.endDate = filters.endDate;
    if (filters.minPrice !== undefined) query.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) query.maxPrice = filters.maxPrice;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    return query;
};

// Tipos para sort options
export type TournamentSortOption =
    | 'createdAt'
    | 'startAt'
    | 'endAt'
    | 'priceClient'
    | 'pricePlayer'
    | 'name';

export const tournamentSortOptions: { value: TournamentSortOption; label: string }[] = [
    { value: 'createdAt', label: 'Fecha de creación' },
    { value: 'startAt', label: 'Fecha de inicio' },
    { value: 'endAt', label: 'Fecha de fin' },
    { value: 'priceClient', label: 'Precio para espectador' },
    { value: 'pricePlayer', label: 'Precio para jugador' },
    { value: 'name', label: 'Nombre' },
];

// Helper para formatear fechas para la API
export const formatDateForApi = (date: Date): string => {
    return date.toISOString();
};

// Helper para validar datos del torneo
export const validateTournamentData = (data: Partial<CreateTournamentDto>): string[] => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
        errors.push('El nombre es requerido');
    }

    if (data.priceClient !== undefined && data.priceClient < 0) {
        errors.push('El precio para espectador no puede ser negativo');
    }

    if (data.pricePlayer !== undefined && data.pricePlayer < 0) {
        errors.push('El precio para jugador no puede ser negativo');
    }

    if (data.startAt && data.endAt) {
        const startDate = new Date(data.startAt);
        const endDate = new Date(data.endAt);

        if (endDate <= startDate) {
            errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
        }
    }

    return errors;
};

export default tournamentApi;