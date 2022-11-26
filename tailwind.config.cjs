/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        red: '#5A0A00',
        'red-light': '#AB1300',
        'red-extra-light': '#E85C4A',
        main: '#FFF7F6',
      },
    },
    fontSize: {
      xs: ['.75rem', '120%'],
      sm: ['.75rem', '1.375rem'],
      tiny: ['1rem', '160%'],
      base: ['1rem', '120%'],
      lg: ['1.125rem', '120%'],
      xl: ['1.25rem', '120%'],
      '2xl': ['1.25rem', '160%'],
      '3xl': ['1.25rem', '2.25rem'],
      '4xl': ['1.5rem', '120%'],
      '5xl': ['1.75rem', '120%'],
      '6xl': ['2rem', '120%'],
      '7xl': ['2.5rem', '120%'],
    },
  },
  plugins: [],
};
