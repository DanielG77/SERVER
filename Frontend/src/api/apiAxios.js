import axios from 'axios';

const API_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const tournamentAxiosService = {
    getTournamentsWithAxios: async () => {
        try {
            const response = await axiosInstance.get('/tournaments');
            return response.data;
        } catch (error) {
            console.error('Error con axios:', error);
            throw error;
        }
    }
};