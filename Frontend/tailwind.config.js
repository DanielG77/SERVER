// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Asegurar que blue-950 esté disponible (valor estándar de Tailwind)
        blue: {
          950: '#172554', // Puedes ajustar este tono si lo deseas
        },
        // Tus colores vivid (opcional, no afectan al diseño)
        vivid: {
          blue: '#3b82f6',
          green: '#22c55e',
          red: '#ef4444',
          yellow: '#eab308',
          purple: '#a855f7',
          pink: '#ec4899',
          orange: '#f97316',
        },
      },
    },
  },
  plugins: [],
}