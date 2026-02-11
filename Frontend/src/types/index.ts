export interface Tournament {
    id: string;
    name: string;
    description: string;
    images: string[];
    status: TournamentStatus;
    priceClient: number;
    pricePlayer: number;
    isActive: boolean;
    createdAt: string;
    startAt: string;
    endAt: string;
    slug: string;
}

export enum TournamentStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    RUNNING = 'running',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TournamentFilters {
    status?: TournamentStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
}

export interface TournamentQueryParams extends TournamentFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}