/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}", // Asegúrate que la carpeta layouts esté
  ],
  theme: {
    extend: {
      // --- ESTOS SON LOS COLORES CORRECTOS ---
      // (Basados en tu último HTML de Lista de Autores)
      colors: {
        "primary": "#3B82F6",
        "background-light": "#F9FAFB",
        "background-dark": "#1F2937",
        "neutral-gray": "#6B7280",
        "dark-charcoal": "#1F2937",
        "destructive-red": "#EF4444",
        "border-light": "#E5E7EB",
        "border-dark": "#374151"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}