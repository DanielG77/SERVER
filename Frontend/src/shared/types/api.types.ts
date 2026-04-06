// src/shared/types/api.types.ts
export interface ApiResponse<T> {
    success: boolean;
    data?: T;               // make data optional because error responses often omit data
    message?: string;       // <- add optional message
    meta?: {
        pagination?: Pagination;
    };
}

// src/shared/types/api.types.ts
export interface Pagination {
    total: number;
    page: number;
    limit: number;
}

// Types para respuestas paginadas del backend
export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    empty: boolean;
}

export interface TicketReservation {
    id: string;
    userId: number;
    tournamentId: string;
    tournamentName: string;

    amount: number;
    currency: string;

    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

    createdAt: string;
    expiresAt: string;
}


// Tournament Status type (from backend ENUM)
export type TournamentStatus = 'draft' | 'open' | 'running' | 'completed' | 'cancelled';

// Base tournament fields shared by both admin and user contexts
export interface BaseTournament {
    id: string;
    name: string;
    description: string;
    status: TournamentStatus;
    gameId: number;
    gameName: string;
    tournamentFormatId?: number;
    formatName?: string;
    platformIds?: number[];
    platformNames?: string[];
    priceClient: number;
    pricePlayer: number;
    isOnline: boolean;
    minPlayers: number;
    maxPlayers: number;
    images: string[];
    startAt?: string;   // ISO date string
    endAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Admin-specific tournament with ownership and active status
export interface AdminTournament extends BaseTournament {
    userId: number;
    ownerUsername: string;
    isActive: boolean;
}

// User-specific tournament (user is the owner)
export interface UserTournament extends BaseTournament {
    userId: number;
    ownerUsername: string;
    isActive: boolean;
}

// Backward compatibility: Tournament can be either AdminTournament or UserTournament
export type Tournament = AdminTournament | UserTournament;

export interface TournamentRequest {
    name: string;
    description: string;
    status?: TournamentStatus;
    gameId: number;
    tournamentFormatId?: number;
    platformIds?: number[];
    priceClient: number;
    pricePlayer: number;
    isOnline: boolean;
    minPlayers: number;
    maxPlayers: number;
    images: string[];
    startAt?: string;   // ISO date string
    endAt?: string;
}

// Tipos para Juegos
export interface Game {
    id: number;
    name: string;
    description?: string;
    iconUrl?: string;
    releaseDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GameRequest {
    name: string;
    description?: string;
    iconUrl?: string;
    releaseDate?: string;
}

// Tipos para Usuarios
export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserUpdateRequest {
    email?: string;
    roles?: string[];
    isActive?: boolean;
}
