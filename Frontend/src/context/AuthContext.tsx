// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';
import { apiLogin, LoginCredentials } from '../services/auth';

interface User {
    id: string;         // ID numérico como string (para compatibilidad con JWT sub)
    numericId: number;  // ID numérico utilizado por el backend
    username: string;
    email: string;
    roles: string[];
    avatarUrl?: string;
    bio?: string;
}

interface DecodedToken {
    sub?: string;
    username?: string;
    email?: string;
    roles?: string[];
    [key: string]: unknown;
}

interface PendingRequest {
    request: () => Promise<Response>;
    resolve: (value: Response) => void;
    reject: (reason?: unknown) => void;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    errorMessage: string | null;
    clearErrorMessage: () => void;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
    authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: Decodificar JWT para extraer claims
const decodeToken = (token: string): DecodedToken | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Anti-infinite-loop mechanisms
    const isRefreshingRef = useRef(false);
    const pendingRequestsRef = useRef<PendingRequest[]>([]);

    // Process pending requests after successful token refresh
    const processPendingRequests = useCallback((success: boolean) => {
        const pendingRequests = pendingRequestsRef.current;
        pendingRequestsRef.current = [];

        pendingRequests.forEach((pendingRequest) => {
            if (success) {
                pendingRequest.request()
                    .then(pendingRequest.resolve)
                    .catch(pendingRequest.reject);
            } else {
                pendingRequest.reject(new Error('Token refresh failed'));
            }
        });
    }, []);

    const clearErrorMessage = useCallback(() => {
        setErrorMessage(null);
    }, []);

    const refreshAccessToken = useCallback(async (): Promise<void> => {
        // If already refreshing, wait for the ongoing refresh to complete
        if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    if (!isRefreshingRef.current) {
                        clearInterval(checkInterval);
                        // Check if refresh was successful by verifying token exists
                        if (Cookies.get('access_token')) {
                            console.log('[AuthContext] Pending request resumed after refresh');
                            resolve();
                        } else {
                            console.warn('[AuthContext] Refresh completed but no token found');
                            reject(new Error('Token refresh failed'));
                        }
                    }
                }, 50);

                // Explicit timeout: abort waiting after 10 seconds
                const timeoutId = setTimeout(() => {
                    clearInterval(checkInterval);
                    console.error('[AuthContext] Refresh wait timeout after 10s');
                    reject(new Error('Token refresh timeout'));
                }, 10000);

                // Clear timeout if check succeeds first
                const originalReject = reject;
                reject = (reason) => {
                    clearTimeout(timeoutId);
                    originalReject(reason);
                };
            });
        }

        isRefreshingRef.current = true;

        try {
            const refreshToken = Cookies.get('refresh_token');
            if (!refreshToken) {
                console.error('[AuthContext] No refresh token available');
                throw new Error('No refresh token available');
            }

            console.log('[AuthContext] Attempting to refresh access token');
            const response = await fetch('http://localhost:8080/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                Cookies.set('access_token', data.accessToken, {
                    expires: 1 / 24, // 1 hora
                    path: '/',
                    secure: false, // Cambiar a true en producción con HTTPS
                    sameSite: 'Lax'
                });
                // Opcionalmente rotar refresh token
                if (data.refreshToken) {
                    Cookies.set('refresh_token', data.refreshToken, {
                        expires: 7, // 7 días
                        path: '/',
                        secure: false,
                        sameSite: 'Lax'
                    });
                }
                console.log('[AuthContext] Access token refreshed successfully');
                processPendingRequests(true);
            } else {
                console.error(`[AuthContext] Refresh failed with status ${response.status}`);
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('[AuthContext] Error refreshing token:', error);

            // Forzar logout cuando falla refresh
            const errorMsg = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            setErrorMessage(errorMsg);

            // Limpiar cookies si el refresh falló
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            setUser(null);
            processPendingRequests(false);

            // Guardar el mensaje de error en localStorage para que persista después de redirect
            localStorage.setItem('auth_error_message', errorMsg);

            throw error;
        } finally {
            isRefreshingRef.current = false;
        }
    }, [processPendingRequests]);

    // Función para hacer fetch con autenticación (usa tokens de cookies)
    const authFetch = useCallback(async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const accessToken = Cookies.get('access_token');
        const headers = new Headers(init?.headers);

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        let response = await fetch(`http://localhost:8080${input}`, {
            ...init,
            headers,
            credentials: 'include'
        });

        // Si el token expiró (401), intentamos refrescar
        if (response.status === 401) {
            console.log('[AuthContext] Received 401, attempting token refresh');

            // Si ya estamos refrescando, agregar a la cola
            if (isRefreshingRef.current) {
                console.log('[AuthContext] Already refreshing, queuing request');
                return new Promise((resolve, reject) => {
                    pendingRequestsRef.current.push({
                        request: async () => {
                            const newAccessToken = Cookies.get('access_token');
                            if (newAccessToken) {
                                const newHeaders = new Headers(init?.headers);
                                newHeaders.set('Authorization', `Bearer ${newAccessToken}`);
                                return fetch(`http://localhost:8080${input}`, {
                                    ...init,
                                    headers: newHeaders,
                                    credentials: 'include'
                                });
                            }
                            throw new Error('No access token available after refresh');
                        },
                        resolve,
                        reject,
                    });
                });
            }

            try {
                await refreshAccessToken();
                console.log('[AuthContext] Token refresh successful, retrying original request');

                // Reintentamos la petición original con el nuevo token
                const newAccessToken = Cookies.get('access_token');
                if (newAccessToken) {
                    const newHeaders = new Headers(init?.headers);
                    newHeaders.set('Authorization', `Bearer ${newAccessToken}`);
                    response = await fetch(`http://localhost:8080${input}`, {
                        ...init,
                        headers: newHeaders,
                        credentials: 'include'
                    });
                } else {
                    console.error('[AuthContext] No token available after refresh succeeded - this should not happen');
                    throw new Error('Token refresh did not produce a token');
                }
            } catch (error) {
                console.error('[AuthContext] Token refresh failed, returning 401 response:', error);
                // Return the 401 response - the caller will handle the auth error
                // Don't retry or return a modified response
                return response;
            }
        }

        return response;
    }, [refreshAccessToken]);

    const fetchProfile = useCallback(async () => {
        try {
            console.log('[AuthContext] Fetching user profile...');
            const response = await authFetch('/api/users/profile');

            if (response.ok) {
                const data = await response.json();
                console.log('[AuthContext] Profile fetched successfully:', data.username);

                // Si la respuesta no tiene roles, intentar decodificar el token
                let roles = data.roles || [];
                if (!roles || roles.length === 0) {
                    const token = Cookies.get('access_token');
                    if (token) {
                        const decoded = decodeToken(token);
                        roles = decoded?.roles || [];
                    }
                }

                setUser({
                    id: String(data.id),
                    numericId: Number(data.id),
                    username: data.username,
                    email: data.email,
                    roles: Array.isArray(roles) ? roles : [],
                    avatarUrl: data.avatarUrl,
                    bio: data.bio,
                });
                setLoading(false);
            } else if (response.status === 401 || response.status === 403) {
                // Token inválido o expirado - clear everything
                console.warn(`[AuthContext] Profile fetch returned ${response.status}, clearing auth state`);
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                setUser(null);
                setErrorMessage('Sesión expirada. Por favor, inicia sesión nuevamente.');
                setLoading(false);
            } else {
                // Error del servidor u otro código no manejado
                console.error(`[AuthContext] Error al obtener perfil: status ${response.status}`);
                // On server error, clear user but keep cookies for potential retry
                setUser(null);
                setErrorMessage('No se pudo cargar el perfil. Intenta recargar la página.');
                setLoading(false);
            }
        } catch (error) {
            console.error('[AuthContext] Error de red al obtener perfil:', error);
            // Network error - don't clear cookies, could be temporary
            setUser(null);
            setErrorMessage('Error de conexión. Intenta recargar la página.');
            setLoading(false);
        }
    }, [authFetch]);

    // Cargar perfil al iniciar la app si hay token
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Cargar mensaje de error persistido si existe
                const storedErrorMessage = localStorage.getItem('auth_error_message');
                if (storedErrorMessage) {
                    setErrorMessage(storedErrorMessage);
                    localStorage.removeItem('auth_error_message');
                }

                const accessToken = Cookies.get('access_token');
                console.log('[AuthContext] Initial setup - access_token exists:', !!accessToken);

                if (accessToken) {
                    // Await the profile fetch so we ensure user state is set before marking loading complete
                    await fetchProfile();
                } else {
                    console.log('[AuthContext] No access token found, user remains null');
                    setLoading(false);
                }
            } catch (error) {
                console.error('[AuthContext] Error during initialization:', error);
                setLoading(false);
            }
        };

        initializeAuth();
    }, [fetchProfile]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            console.log('[AuthContext] Starting login for user:', credentials.usernameOrEmail || credentials.email);
            setLoading(true);
            clearErrorMessage();

            // 1. Obtener tokens del servidor
            const tokens = await apiLogin(credentials);

            // 2. Guardar tokens en cookies (sin HttpOnly para que el frontend pueda acceder)
            Cookies.set('access_token', tokens.token, {
                expires: 1 / 24, // 1 hora
                path: '/',
                secure: false, // Cambiar a true en producción con HTTPS
                sameSite: 'Lax'
            });
            Cookies.set('refresh_token', tokens.refreshToken, {
                expires: 7, // 7 días
                path: '/',
                secure: false,
                sameSite: 'Lax'
            });

            // 3. Obtener perfil del usuario autenticado para conseguir el ID numérico
            // (fetchProfile obtendrá roles, email, numericId, etc.)
            console.log('[AuthContext] Login successful, fetching full profile...');
            await fetchProfile();
            setLoading(false);
        } catch (error) {
            console.error('[AuthContext] Login error:', error);
            // Limpiar cualquier cookie que haya quedado
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            setUser(null);
            setLoading(false);
            throw error; // para que el componente Login pueda mostrar el error
        }
    }, [clearErrorMessage, fetchProfile]);

    const logout = useCallback(async () => {
        try {
            console.log('[AuthContext] Starting logout');
            const refreshToken = Cookies.get('refresh_token');
            if (refreshToken) {
                try {
                    // Llamar al endpoint de logout para revocar el token en el servidor
                    const response = await fetch('http://localhost:8080/api/auth/logout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ refreshToken }),
                    });
                    if (response.ok) {
                        console.log('[AuthContext] Server logout successful');
                    } else {
                        console.warn('[AuthContext] Server logout returned status:', response.status);
                    }
                } catch (serverError) {
                    // Log error but continue with local cleanup
                    console.warn('[AuthContext] Error notifying server of logout:', serverError);
                }
            }
        } catch (error) {
            console.error('[AuthContext] Error during logout:', error);
        } finally {
            // Limpiar cookies en el cliente de todas formas
            console.log('[AuthContext] Clearing local auth state');
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            setUser(null);
            setErrorMessage(null);
            setLoading(false);
            isRefreshingRef.current = false;
            pendingRequestsRef.current = [];
        }
    }, []);

    const isAuthenticated = user !== null && Cookies.get('access_token') !== undefined;

    // Helper: Verificar si el usuario tiene un rol específico
    const hasRole = (role: string): boolean => {
        if (!user || !user.roles) return false;
        return user.roles.some(r => r === role || r === `ROLE_${role}`);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        loading,
        errorMessage,
        clearErrorMessage,
        login,
        logout,
        refreshAccessToken,
        authFetch,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};