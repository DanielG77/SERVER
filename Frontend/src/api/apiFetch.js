const API_URL = 'http://localhost:8080';

export const tournamentService = {
    // Usando Fetch API
    getTournamentsWithFetch: async () => {
        try {
            const response = await fetch(`${API_URL}/tournaments`);
            if (!response.ok) {
                throw new Error('Error al obtener torneos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error con fetch:', error);
            throw error;
        }
    },

    // Usando Fetch con parámetros
    getTournamentsWithFetchParams: async (page = 1, limit = 10) => {
        try {
            const response = await fetch(
                `${API_URL}/tournaments?page=${page}&limit=${limit}`
            );
            if (!response.ok) {
                throw new Error('Error al obtener torneos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error con fetch:', error);
            throw error;
        }
    }
};