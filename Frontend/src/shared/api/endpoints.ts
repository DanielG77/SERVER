export const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
    TOURNAMENTS: `${API_BASE_URL}/tournaments`,
    TOURNAMENT_BY_SLUG: (slug: string) => `${API_BASE_URL}/tournaments/slug/${slug}`,
    GAMES: `${API_BASE_URL}/games`,
    CATEGORIES: `${API_BASE_URL}/genres`,
};