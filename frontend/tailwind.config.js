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
        primary: '#10B981', // Emerald Green
        secondary: '#1E3A8A', // Deep Blue
        accent: '#06B6D4', // Cyan/Teal
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
