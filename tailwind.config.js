/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['**/*.tsx', '**/*.ts'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
