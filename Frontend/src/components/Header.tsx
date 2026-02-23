import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    // Determinar si la ruta actual es la home (incluye /home y /)
    const isHome = location.pathname === '/' || location.pathname === '/home';

    // Clases condicionales para el header
    const headerClasses = `fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isHome
        ? 'bg-transparent text-white'
        : 'bg-white text-gray-800 shadow-md'
        }`;

    // Clases para los enlaces del menú desktop
    const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
        const baseClasses = `transition drop-shadow ${isHome ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`;
        return `${baseClasses} ${isActive ? 'font-semibold underline' : ''}`;
    };

    // Clases para el botón hamburguesa
    const buttonClasses = `md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${isHome ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'
        }`;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo a la izquierda */}
                    <div className={`flex-shrink-0 font-bold text-2xl tracking-tight drop-shadow-md ${isHome ? 'text-white' : 'text-gray-800'
                        }`}>
                        <Link to="/">🎮 GameHub</Link>
                    </div>

                    {/* Navegación escritorio */}
                    <nav className="hidden md:flex space-x-8 text-sm font-medium" aria-label="Principal">
                        <NavLink to="/shop" className={navLinkClasses}>Explorar</NavLink>
                        <NavLink to="/servicios" className={navLinkClasses}>Servicios</NavLink>
                        <NavLink to="/merchant" className={navLinkClasses}>Merchant</NavLink>
                    </nav>

                    {/* Botón hamburguesa móvil */}
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Menú móvil desplegable */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden pb-4 space-y-2 text-sm font-medium border-t pt-4 rounded-b-lg ${isHome
                        ? 'border-white/20 bg-black/50 backdrop-blur-sm text-white/90'
                        : 'border-gray-200 bg-white text-gray-700'
                        }`}>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `block px-2 py-2 rounded ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${isActive ? (isHome ? 'bg-white/20' : 'bg-gray-200') : ''
                                }`
                            }
                            onClick={toggleMobileMenu}
                            end
                        >
                            Explorar
                        </NavLink>
                        <NavLink
                            to="/servicios"
                            className={({ isActive }) =>
                                `block px-2 py-2 rounded ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${isActive ? (isHome ? 'bg-white/20' : 'bg-gray-200') : ''
                                }`
                            }
                            onClick={toggleMobileMenu}
                        >
                            Servicios
                        </NavLink>
                        <NavLink
                            to="/merchant"
                            className={({ isActive }) =>
                                `block px-2 py-2 rounded ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${isActive ? (isHome ? 'bg-white/20' : 'bg-gray-200') : ''
                                }`
                            }
                            onClick={toggleMobileMenu}
                        >
                            Merchant
                        </NavLink>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;