export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: {
        pagination: Pagination;
    };
}


// src/shared/types/api.types.ts
export interface Pagination {
    total: number;
    page: number;
    limit: number;
}
