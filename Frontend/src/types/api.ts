// Tipos para respuestas de error de la API
export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
    timestamp?: string;
    path?: string;
}

// Tipos para paginación
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Tipos para filtros avanzados
export interface DateRangeFilter {
    from?: string;
    to?: string;
}

export interface PriceRangeFilter {
    min?: number;
    max?: number;
}

// Tipos para estadísticas
export interface TournamentStats {
    total: number;
    byStatus: Record<string, number>;
    byMonth: Array<{ month: string; count: number }>;
    revenue: {
        total: number;
        projected: number;
    };
}

// Tipos para respuestas de búsqueda
export interface SearchResponse<T> {
    results: T[];
    total: number;
    query: string;
    took: number; // tiempo en ms
}