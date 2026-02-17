import axios from 'axios';
import { API_BASE_URL } from './endpoints';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    // Si en el futuro usas cookies de sesión: withCredentials: true
});
// Interceptor simple para logging / estandarizar errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // aquí puedes mapear errores al formato que quieras
        console.error('[API ERROR]', error?.response?.status, error?.response?.data);
        return Promise.reject(error);
    }
);