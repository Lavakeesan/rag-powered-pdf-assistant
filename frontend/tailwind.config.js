/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#059669', // Emerald-600 (darker)
        secondary: '#1E3A8A', // Deep Blue (unchanged)
        accent: '#0d9488', // Teal-600 (darker)
        background: '#F9FAFB', // Light gray / white
        foreground: '#111827' // Dark gray text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
