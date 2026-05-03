import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../asset/logo.jpeg';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-b from-slate-950 to-slate-950 border-t border-cyan-500/30 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Footer Content */}
                <div className="py-16 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Logo & About */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                                <img
                                    src={logoImg}
                                    alt="Logo"
                                    className="h-14 w-auto rounded-lg shadow-lg shadow-cyan-500/30"
                                />
                                <span className="hidden sm:block text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-400 to-lime-400">Juegalo</span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                La plataforma definitiva para torneos, reservas de locales y gaming merchandise.
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    aria-label="Discord"
                                    className="inline-flex p-2 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-white transition-colors"
                                >
                                    💬
                                </a>
                                <a
                                    href="#"
                                    aria-label="Twitter"
                                    className="inline-flex p-2 rounded-lg bg-white/10 hover:bg-cyan-400/30 text-white transition-colors"
                                >
                                    𝕏
                                </a>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="inline-flex p-2 rounded-lg bg-white/10 hover:bg-orange-500/30 text-white transition-colors"
                                >
                                    📷
                                </a>
                                <a
                                    href="#"
                                    aria-label="Twitch"
                                    className="inline-flex p-2 rounded-lg bg-white/10 hover:bg-purple-500/30 text-white transition-colors"
                                >
                                    🎮
                                </a>
                            </div>
                        </div>

                        {/* Links - Plataforma */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-4">Plataforma</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/shop" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Torneos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Locales
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Tienda Gaming
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/search" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Buscar
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Links - Empresa */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-4">Empresa</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Acerca de
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Contacto
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Soporte
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Links - Legal */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-4">Legal</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Términos de Servicio
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Política de Privacidad
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                        Política de Cookies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Bottom Footer */}
                <div className="py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-center md:text-left">
                    {/* Copyright */}
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Colisium Gaming. Todos los derechos reservados.
                    </p>

                    {/* Payment & Trust Badges */}
                    <div className="flex items-center justify-center md:justify-end gap-6 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            🔒 SSL Secure
                        </span>
                        <span className="flex items-center gap-1">
                            ✓ Verified
                        </span>
                        <span className="flex items-center gap-1">
                            🌍 Available Worldwide
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
