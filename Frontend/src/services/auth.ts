import api from './api';

export interface LoginCredentials {
    usernameOrEmail?: string;
    email?: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    username: string;
    email: string;
    roles: string[];
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface AuthError {
    message: string;
    code?: string;
    details?: Record<string, string>;
}

interface Tokens {
    token: string;
    refreshToken: string;
    username: string;
    email: string;
}

/**
 * Parses error response from server
 */
const parseErrorResponse = (data: unknown): AuthError => {
    if (typeof data === 'object' && data !== null) {
        if ('message' in data && typeof data.message === 'string') {
            return {
                message: data.message,
                code: (data as Record<string, unknown>).code as string | undefined,
                details: (data as Record<string, unknown>).details as Record<string, string> | undefined,
            };
        }
    }
    return { message: 'An error occurred. Please try again.' };
};

export const login = async (credentials: LoginCredentials & { email?: string; usernameOrEmail?: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
};

/**
 * Authenticates user with email/username and password
 * @throws AuthError with message and details
 */
export const apiLogin = async (credentials: LoginCredentials & { email?: string }): Promise<Tokens> => {
    const body = {
        usernameOrEmail: credentials.email || credentials.usernameOrEmail,
        password: credentials.password
    };

    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let errorData: unknown = {};
        try {
            errorData = await response.json();
        } catch (e) {
            // Response is not JSON
        }

        const error = parseErrorResponse(errorData);

        // Map common HTTP status codes to user-friendly messages
        if (response.status === 401) {
            error.message = error.message || 'Correo electrónico o contraseña incorrectos';
        } else if (response.status === 400) {
            error.message = error.message || 'Datos de entrada inválidos';
        } else if (response.status === 429) {
            error.message = 'Demasiados intentos de inicio de sesión. Por favor, intenta más tarde.';
        } else if (response.status >= 500) {
            error.message = 'Error del servidor. Por favor, intenta más tarde.';
        }

        throw error;
    }

    return response.json();
};

/**
 * Registers a new user
 * @throws AuthError with message and details
 */
export const apiRegister = async (credentials: RegisterCredentials): Promise<Tokens> => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        let errorData: unknown = {};
        try {
            errorData = await response.json();
        } catch (e) {
            // Response is not JSON
        }

        const error = parseErrorResponse(errorData);

        // Map common HTTP status codes to user-friendly messages
        if (response.status === 409) {
            // Conflict - usually means user already exists
            error.message = error.message || 'El correo electrónico o nombre de usuario ya está registrado';
        } else if (response.status === 400) {
            error.message = error.message || 'Errores de validación en los datos proporcionados';
        } else if (response.status === 429) {
            error.message = 'Demasiados intentos de registro. Por favor, intenta más tarde.';
        } else if (response.status >= 500) {
            error.message = 'Error del servidor. Por favor, intenta más tarde.';
        }

        throw error;
    }

    return response.json();
};
