/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          saffron: {
            DEFAULT: '#E65100',
            light: '#FF8A50',
            dark: '#AC1900',
            50: '#FFF3E0',
            100: '#FFE0B2',
            500: '#FF6D00',
            600: '#E65100',
            700: '#BF360C'
          },
          maroon: {
            DEFAULT: '#7B1113',
            light: '#9E2A2B',
            dark: '#540809',
            900: '#38040E'
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F3E5AB',
            dark: '#AA820A',
            amber: '#B45309'
          },
          cream: {
            DEFAULT: '#FDFBF7',
            50: '#FFFEFA',
            100: '#FAF6EE',
            200: '#F4ECE1',
            300: '#E8DCC8',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        kannada: ['"Noto Sans Kannada"', 'system-ui', 'sans-serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'spiritual': '0 4px 20px -2px rgba(230, 81, 0, 0.12), 0 2px 6px -1px rgba(123, 17, 19, 0.08)',
        'spiritual-lg': '0 10px 25px -3px rgba(230, 81, 0, 0.2), 0 4px 10px -2px rgba(123, 17, 19, 0.12)',
      }
    },
  },
  plugins: [],
}

