/**
 * Tournament Search Service
 * Handles all search API communication with the backend
 * Backend: POST /api/v1/tournaments/search
 */

import api from './api';

/** Request body sent to backend */
export interface TournamentSearchRequest {
    query: string;
}

/** Individual tournament result from backend */
export interface TournamentSearchResultResponse {
    id: string;
    name: string;
    game: string;
    description: string;
    priceClient: number;
    startAt: string;
    isOnline: boolean;
    maxPlayers: number;
    score?: number;
    reason?: string;
}

/** Response received from backend */
export interface TournamentSearchResponse {
    query: string;
    results: TournamentSearchResultResponse[];
}

/**
 * Calls POST /api/v1/tournaments/search
 * @param query Search query string
 * @param signal AbortSignal for request cancellation
 * @returns Promise with search response
 */
export const searchTournaments = async (
    query: string,
    signal?: AbortSignal
): Promise<TournamentSearchResponse> => {
    if (!query.trim()) {
        return {
            query: '',
            results: [],
        };
    }

    try {
        const response = await api.post<TournamentSearchResponse>(
            '/api/v1/tournaments/search',
            { query } as TournamentSearchRequest,
            {
                signal,
                timeout: 10000, // 10 second timeout
            }
        );

        return response.data;
    } catch (error: any) {
        // Don't throw error if request was cancelled
        if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
            console.debug('Search request cancelled');
            return {
                query,
                results: [],
            };
        }

        // Re-throw for hook to handle
        throw error;
    }
};

/**
 * Validates search query format
 * @param query Search query to validate
 * @returns true if valid, false otherwise
 */
export const isValidSearchQuery = (query: string): boolean => {
    return query.trim().length > 0 && query.trim().length <= 200;
};
