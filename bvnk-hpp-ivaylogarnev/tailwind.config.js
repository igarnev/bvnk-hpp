/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3f53dd',
        warning: '#ff785f',
        success: '#22c55e',
        error: '#ef4444'
      }
    }
  },
  plugins: []
};
