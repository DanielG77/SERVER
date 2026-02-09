import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { TrophyIcon, HomeIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Inicio', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { label: 'Torneos', path: '/tournaments', icon: <TrophyIcon className="w-5 h-5" /> },
    { label: 'Crear Torneo', path: '/tournaments/create', icon: <PlusIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">GameTournamentHub</div>
              <div className="text-xs text-gray-400">Competitive Gaming Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <UserCircleIcon className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg text-white font-medium transition-opacity">
              Registrarse
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-800 space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg text-white font-medium text-center transition-opacity">
                  Registrarse
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