import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const isHome = location.pathname === '/' || location.pathname === '/home';

    const handleLogout = async () => {
        setIsLogoutLoading(true);
        try {
            await logout();
            setShowLogoutConfirm(false);
            setIsMobileMenuOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            setIsLogoutLoading(false);
        }
    };

    const headerClasses = `fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isHome ? 'bg-transparent text-white' : 'bg-white text-gray-800 shadow-md'
        }`;

    const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
        const baseClasses = `transition drop-shadow ${isHome ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`;
        return `${baseClasses} ${isActive ? 'font-semibold underline' : ''}`;
    };

    const buttonClasses = `md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${isHome ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'
        }`;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className={`flex-shrink-0 font-bold text-2xl tracking-tight drop-shadow-md ${isHome ? 'text-white' : 'text-gray-800'
                        }`}>
                        <Link to="/">Colisium</Link>
                    </div>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex space-x-6 items-center text-sm font-medium">
                        <NavLink to="/shop" className={navLinkClasses}>Explorar</NavLink>
                        <NavLink to="/servicios" className={navLinkClasses}>Servicios</NavLink>
                        <NavLink to="/merchant" className={navLinkClasses}>Merchant</NavLink>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                                <Link
                                    to="/perfil"
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-200 transition ${isHome ? 'text-white hover:bg-white/20' : 'text-gray-800'
                                        }`}
                                >
                                    <Avatar
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        username={user.username}
                                        size="md"
                                    />
                                    <span className="font-medium truncate max-w-[120px]">{user.username}</span>
                                </Link>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className={`px-3 py-1 rounded transition ${isHome
                                        ? 'text-white/90 hover:bg-white/20'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    title="Cerrar sesión"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className={`px-3 py-1 rounded hover:bg-gray-100 transition ${isHome ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                Login
                            </NavLink>
                        )}
                    </nav>

                    {/* Botón móvil */}
                    <button
                        onClick={toggleMobileMenu}
                        className={buttonClasses}
                        aria-label="Abrir menú"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menú móvil */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden mt-2 pb-4 space-y-2 text-sm font-medium border-t pt-4 rounded-b-lg ${isHome ? 'border-white/20 bg-black/50 backdrop-blur-sm text-white/90' : 'border-gray-200 bg-white text-gray-700'
                        }`}>
                        <NavLink
                            to="/shop"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${isActive ? (isHome ? 'bg-white/20' : 'bg-gray-200') : ''
                                }`
                            }
                            onClick={toggleMobileMenu}
                        >
                            Explorar
                        </NavLink>
                        <NavLink
                            to="/servicios"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${isActive ? (isHome ? 'bg-white/20' : 'bg-gray-200') : ''
                                }`
                            }
                            onClick={toggleMobileMenu}
                        >
                            Servicios
                        </NavLink>
                        <NavLink
                            to="/merchant"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${isActive ? (isHome ? 'bg-white/20' : 'bg-gray-200') : ''
                                }`
                            }
                            onClick={toggleMobileMenu}
                        >
                            Merchant
                        </NavLink>

                        {user ? (
                            <div className="space-y-2">
                                <Link
                                    to="/perfil"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-200 transition ${isHome ? 'text-white hover:bg-white/20' : 'text-gray-800'
                                        }`}
                                    onClick={toggleMobileMenu}
                                >
                                    <Avatar
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        username={user.username}
                                        size="md"
                                    />
                                    <span className="font-medium truncate max-w-[120px]">{user.username}</span>
                                </Link>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${isHome
                                        ? 'text-white/90 hover:bg-white/20'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="block px-3 py-2 rounded hover:bg-gray-100 transition"
                                onClick={toggleMobileMenu}
                            >
                                Login
                            </NavLink>
                        )}
                    </div>
                )}

                {/* Logout Confirmation Dialog */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cerrar Sesión</h3>
                            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    disabled={isLogoutLoading}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLogoutLoading}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLogoutLoading && (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                                        </svg>
                                    )}
                                    {isLogoutLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;