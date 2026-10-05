/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#071A13',
          900: '#0F382A',
          850: '#113E2F',
          800: '#144635',
          700: '#1C5B46',
          600: '#2A7A5F',
        },
        lime: {
          300: '#E4FA8A',
          400: '#D4F55C',
          500: '#C2E83E',
          600: '#A3CA27',
        },
        linen: {
          50: '#FBFBF7',
          100: '#F6F5EE',
          200: '#ECE9DD',
          300: '#DFDC CE',
        },
        charcoal: {
          900: '#11221B',
          800: '#1E3228',
          700: '#2D4439',
        },
        sage: {
          300: '#A1B2A9',
          400: '#7E9187',
          500: '#5A6B63',
          600: '#46564E',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
};
