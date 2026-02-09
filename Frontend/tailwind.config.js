/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores vibrantes para gaming
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff9d',
        'neon-purple': '#9d00ff',
        'neon-orange': '#ff6b00',
        'neon-yellow': '#ffd700',

        // Colores de fondo
        'dark': '#0a0a0f',
        'dark-light': '#12121a',
        'dark-lighter': '#1a1a24',

        // Colores de UI
        'primary': '#00f3ff',       // Neon Blue
        'secondary': '#ff00ff',     // Neon Pink
        'accent': '#00ff9d',        // Neon Green
        'warning': '#ff6b00',       // Neon Orange
        'success': '#00ff9d',
        'danger': '#ff3860',

        // Gradientes
        'gradient-start': '#00f3ff',
        'gradient-mid': '#ff00ff',
        'gradient-end': '#9d00ff',
      },
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Orbitron', 'Poppins', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'neon-pulse': 'neonPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 243, 255, 0.5)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 243, 255, 0.8)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        neonPulse: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 5px currentColor)',
            opacity: '1'
          },
          '50%': {
            filter: 'drop-shadow(0 0 15px currentColor)',
            opacity: '0.8'
          },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 243, 255, 0.1) 1px, transparent 1px)",
        'hero-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #12121a 30%, #1a1a24 70%, #0a0a0f 100%)',
        'neon-gradient': 'linear-gradient(45deg, #00f3ff, #ff00ff, #9d00ff, #00f3ff)',
        'card-gradient': 'linear-gradient(145deg, #12121a 0%, #1a1a24 100%)',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 243, 255, 0.5)',
        'neon-pink': '0 0 15px rgba(255, 0, 255, 0.5)',
        'neon-green': '0 0 15px rgba(0, 255, 157, 0.5)',
        'glow': '0 0 30px rgba(0, 243, 255, 0.4)',
        'inner-neon': 'inset 0 0 20px rgba(0, 243, 255, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}