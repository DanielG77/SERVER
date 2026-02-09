import React from 'react';
import { Link } from 'react-router-dom';
import {
  // TrophyIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  TwitterIcon,
  DiscordIcon,
  YoutubeIcon
} from './SocialIcons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-light border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"> */}
              {/* <TrophyIcon className="w-7 h-7 text-white" /> */}
              {/* </div> */}
              <div>
                <div className="text-xl font-bold text-white">GameTournamentHub</div>
                <div className="text-sm text-gray-400">Competitive Gaming Platform</div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              La plataforma líder para torneos de videojuegos. Conectamos jugadores y organizadores de todo el mundo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <DiscordIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/tournaments" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Torneos Activos
                </Link>
              </li>
              <li>
                <Link to="/tournaments/create" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Crear Torneo
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/tournaments?category=shooter" className="text-gray-400 hover:text-primary transition-colors">
                  Shooter
                </Link>
              </li>
              <li>
                <Link to="/tournaments?category=moba" className="text-gray-400 hover:text-primary transition-colors">
                  MOBA
                </Link>
              </li>
              <li>
                <Link to="/tournaments?category=battle-royale" className="text-gray-400 hover:text-primary transition-colors">
                  Battle Royale
                </Link>
              </li>
              <li>
                <Link to="/tournaments?category=sports" className="text-gray-400 hover:text-primary transition-colors">
                  Deportes
                </Link>
              </li>
              <li>
                <Link to="/tournaments?category=strategy" className="text-gray-400 hover:text-primary transition-colors">
                  Estrategia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-primary" />
                <span className="text-gray-400">contacto@gametournamenthub.com</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-primary" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-primary" />
                <span className="text-gray-400">Ciudad de México, MX</span>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-dark rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Suscríbete a nuestro newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo"
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white text-sm font-medium transition-colors">
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>&copy; {currentYear} GameTournamentHub. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link to="/terms" className="text-sm hover:text-white transition-colors">
              Términos
            </Link>
            <Link to="/cookies" className="text-sm hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;