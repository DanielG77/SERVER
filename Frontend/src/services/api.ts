import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Agregar token Authorization automáticamente
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Manejar errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error
        console.error('API Error:', error.response?.status, error.message);

        // Si es 401 (token expirado o inválido), limpiar cookies
        if (error.response?.status === 401) {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            console.warn('Token inválido o expirado. Redirigiendo a login...');
            // El AuthContext manejará la redirección a login
        }

        return Promise.reject(error);
    }
);

export default api;