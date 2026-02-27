export interface Genre {
    id: number;
    name: string;
}

export interface Game {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
    releaseDate: string;
    genres: Genre[];
}

export interface Format {
    id: number;
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
}

export interface Platform {
    id: number | string;
    name: string;
}

export interface Tournament {
    id: string;
    name: string;
    description: string;
    images: string[];
    status: 'draft' | 'open' | 'closed';
    priceClient: number;
    pricePlayer: number;
    active: boolean;
    createdAt: string;
    startAt: string;
    endAt: string;
    slug: string;
    game: Game;
    format: Format | null;
    minPlayers: number;
    maxPlayers: number;
    platforms: Platform[];
    online: boolean;
}

export interface Category {
    id: number;
    name: string;
}

// DTO de respuesta (con el wrapper ApiResponse)
import { ApiResponse } from '../types/api.types';
export type TournamentsResponse = ApiResponse<Tournament[]>;