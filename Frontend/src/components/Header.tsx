import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from './SearchBar';
import Avatar from './Avatar';
import logoImg from '../asset/logo.jpeg';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const { user, logout, hasRole } = useAuth();

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

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

    // Premium dark gaming navbar styling - CMG inspired
    const headerClasses = `fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-md shadow-lg border-b border-cyan-500/30 text-white`;

    const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
        const baseClasses = `text-white/80 hover:text-cyan-400 transition-all duration-200 text-sm font-medium`;
        return `${baseClasses} ${isActive ? 'text-cyan-400 font-bold border-b-2 border-cyan-400' : ''}`;
    };

    const buttonClasses = `md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white/80 hover:text-white transition-colors`;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4">

                    {/* Logo + Brand Name - Gaming Premium */}
                    <Link
                        to="/"
                        className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200 flex items-center gap-3"
                        title="Home"
                    >
                        <img
                            src={logoImg}
                            alt="Logo"
                            className="h-12 w-auto rounded-lg shadow-lg shadow-cyan-500/40"
                        />
                        <span className="hidden sm:block text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-400 to-lime-400 drop-shadow-lg">Juegalo</span>
                    </Link>

                    {/* Navegación Desktop - Centro */}
                    <nav className="hidden md:flex space-x-1 items-center text-sm font-medium flex-1 justify-center">
                        <NavLink
                            to="/shop"
                            className={navLinkClasses}
                        >
                            Torneos
                        </NavLink>
                        <NavLink
                            to="/shop"
                            className={navLinkClasses}
                        >
                            Locales
                        </NavLink>
                        <NavLink
                            to="/shop"
                            className={navLinkClasses}
                        >
                            Tienda
                        </NavLink>
                    </nav>

                    {/* Derecha: SearchBar + Auth + CTA */}
                    <div className="hidden md:flex items-center space-x-3 flex-1 justify-end">
                        {/* AI Search */}
                        <div className="w-64">
                            <SearchBar showInNavbar={true} />
                        </div>

                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Avatar
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        username={user.username}
                                        size="md"
                                    />
                                    <span className="font-medium text-white/90 truncate max-w-[100px] text-xs">{user.username}</span>
                                </Link>

                                {/* Admin Dashboard */}
                                {hasRole('ADMIN') && (
                                    <NavLink
                                        to="/admin"
                                        className="px-2 py-1 text-xs rounded hover:bg-cyan-500/30 transition-colors"
                                        title="Panel Admin"
                                    >
                                        🔧
                                    </NavLink>
                                )}

                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="p-2 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                    title="Cerrar sesión"
                                    aria-label="Logout"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-cyan-500/50"
                            >
                                Login
                            </NavLink>
                        )}

                        {/* Primary CTA */}
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-4 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-700 text-white font-medium text-sm transition-all shadow-lg hover:shadow-emerald-500/50 font-bold"
                            aria-label="Ver Torneos"
                        >
                            Ver Torneos
                        </button>
                    </div>

                    {/* Botón móvil - Hamburger */}
                    <button
                        onClick={toggleMobileMenu}
                        className={buttonClasses}
                        aria-label="Menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>

                {/* Menú móvil */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-2 pb-4 space-y-3 text-sm font-medium border-t border-cyan-500/20 pt-4 rounded-b-lg bg-slate-900/80 backdrop-blur-sm text-white/90">
                        {/* Mobile Search */}
                        <div className="px-3">
                            <SearchBar showInNavbar={true} />
                        </div>

                        <div className="space-y-2">
                            <NavLink
                                to="/shop"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded transition-colors ${isActive ? 'bg-cyan-500/30 text-cyan-300' : 'hover:bg-white/10'}`
                                }
                                onClick={toggleMobileMenu}
                            >
                                Torneos
                            </NavLink>
                            <NavLink
                                to="/shop"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded transition-colors ${isActive ? 'bg-cyan-500/30 text-cyan-300' : 'hover:bg-white/10'}`
                                }
                                onClick={toggleMobileMenu}
                            >
                                Locales
                            </NavLink>
                            <NavLink
                                to="/shop"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded transition-colors ${isActive ? 'bg-cyan-500/30 text-cyan-300' : 'hover:bg-white/10'}`
                                }
                                onClick={toggleMobileMenu}
                            >
                                Tienda
                            </NavLink>
                        </div>

                        {user ? (
                            <div className="space-y-2 border-t border-cyan-500/20 pt-4 mt-4">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition-colors"
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

                                {hasRole('ADMIN') && (
                                    <NavLink
                                        to="/admin"
                                        className={({ isActive }) =>
                                            `block px-3 py-2 rounded transition-colors ${isActive ? 'bg-cyan-500/30 text-cyan-300' : 'hover:bg-white/10'}`
                                        }
                                        onClick={toggleMobileMenu}
                                    >
                                        🔧 Admin
                                    </NavLink>
                                )}

                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-2 hover:bg-red-500/20 text-red-300"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
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
                                className="block px-3 py-2 rounded bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium text-center"
                                onClick={toggleMobileMenu}
                            >
                                Login
                            </NavLink>
                        )}

                        <button
                            onClick={() => { navigate('/shop'); toggleMobileMenu(); }}
                            className="w-full mt-2 px-3 py-2 rounded bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium"
                        >
                            Ver Torneos
                        </button>
                    </div>
                )}

                {/* Logout Confirmation Dialog */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 max-w-sm mx-4 border border-cyan-500/30">
                            <h3 className="text-lg font-semibold text-white mb-2">Cerrar Sesión</h3>
                            <p className="text-gray-300 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    disabled={isLogoutLoading}
                                    className="px-4 py-2 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-700/50 transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLogoutLoading}
                                    className="px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLogoutLoading && (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                                        </svg>
                                    )}
                                    {isLogoutLoading ? 'Cerrando...' : 'Logout'}
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