const plugin = require('tailwindcss/plugin');

const capitalizeFirst = plugin(function ({ addUtilities }) {
  const newUtilities = {
    '.text-capitalize-first:first-letter': {
      textTransform: 'uppercase',
    },
  }
  addUtilities(newUtilities, ['responsive', 'hover'])
})

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      container: {
        center: true,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [capitalizeFirst],
}
