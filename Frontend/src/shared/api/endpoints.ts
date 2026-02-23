// shared/api/endpoints.ts
export const API_BASE_URL = 'http://localhost:8080';
console.log('✅ API_BASE_URL cargada:', API_BASE_URL);

export const ENDPOINTS = {
    TOURNAMENTS: `${API_BASE_URL}/tournaments`,
    TOURNAMENT_BY_SLUG: (slug: string) => `${API_BASE_URL}/tournaments/slug/${slug}`,
    GAMES: `${API_BASE_URL}/games`,
    CATEGORIES: `${API_BASE_URL}/genres`,   // <-- nuevo
};