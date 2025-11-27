import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Elegant Islamic fashion color palette
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc7',
          300: '#a3afa3',
          400: '#7d8c7d',
          500: '#5f6e5f',
          600: '#4a574a',
          700: '#3c473c',
          800: '#323a32',
          900: '#2b312b',
        },
        sand: {
          50: '#faf8f5',
          100: '#f2ede5',
          200: '#e6dac9',
          300: '#d6c0a3',
          400: '#c4a076',
          500: '#b68757',
          600: '#a8724b',
          700: '#8c5d40',
          800: '#714c38',
          900: '#5d3f30',
        },
        burgundy: {
          50: '#faf5f7',
          100: '#f5e9ee',
          200: '#edd6e0',
          300: '#deb5c8',
          400: '#cb8ca8',
          500: '#b66a8b',
          600: '#9f506f',
          700: '#853f5a',
          800: '#6f384c',
          900: '#5d3242',
        },
        gold: {
          50: '#fefbf3',
          100: '#fdf5e1',
          200: '#fbe9c2',
          300: '#f7d898',
          400: '#f1bd5e',
          500: '#eba944',
          600: '#dd8b2f',
          700: '#b96e28',
          800: '#945626',
          900: '#794722',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'Almarai', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
