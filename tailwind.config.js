/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        adcorange: {
          DEFAULT: '#FF6B00',
          hover: '#e55a00',
          light: '#ff8533',
          glow: 'rgba(255, 107, 0, 0.35)'
        },
        adclime: {
          DEFAULT: '#DFFF00',
          hover: '#c8e600',
          dark: '#9eb800',
          glow: 'rgba(223, 255, 0, 0.3)'
        },
        adcocean: {
          light: '#38bdf8',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
          deep: '#0c4a6e'
        },
        darkbg: {
          950: '#070c18',
          900: '#0b1329',
          850: '#0f172a',
          800: '#15203b',
          700: '#1e293b',
          600: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sport: ['"Montserrat"', '"Barlow Condensed"', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.8s ease-in-out 1',
      }
    },
  },
  plugins: [],
}
