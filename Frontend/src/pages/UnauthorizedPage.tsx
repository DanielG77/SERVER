import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
                {/* Icono 403 */}
                <div className="mb-6">
                    <div className="text-6xl font-bold text-red-500 mb-2">403</div>
                    <h1 className="text-4xl font-bold">Acceso Denegado</h1>
                </div>

                {/* Mensaje */}
                <p className="text-lg text-gray-300 mb-4">
                    No tienes permiso para acceder a esta sección.
                </p>

                <div className="bg-gray-700 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-200">
                        {user ? (
                            <>
                                Usuario actual: <span className="font-semibold">{user.username}</span>
                                <br />
                                Rol(es): <span className="font-semibold">
                                    {user.roles && user.roles.length > 0
                                        ? user.roles.join(', ')
                                        : 'Sin asignar'}
                                </span>
                            </>
                        ) : (
                            'No autenticado'
                        )}
                    </p>
                </div>

                {/* Botones */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-500 transition rounded-lg font-medium"
                    >
                        ← Volver Atrás
                    </button>

                    <Link
                        to="/profile"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg font-medium inline-block"
                    >
                        Mi Perfil
                    </Link>

                    <Link
                        to="/"
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 transition rounded-lg font-medium inline-block"
                    >
                        Ir a Home
                    </Link>
                </div>

                {/* Ayuda */}
                <div className="mt-12 text-sm text-gray-400">
                    <p>Si crees que esto es un error, contacta con soporte.</p>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
