import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

/**
 * Componente que protege rutas que requieren roles específicos.
 * Si el usuario no tiene el rol requerido, redirige a /unauthorized.
 * Si el usuario no está autenticado, redirige a /login.
 * 
 * @param requiredRoles - Array de roles permitidos (ej: ['ADMIN', 'ROLE_ADMIN'])
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    requiredRoles = ['ADMIN', 'ROLE_ADMIN']
}) => {
    const { isAuthenticated, loading, hasRole } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
