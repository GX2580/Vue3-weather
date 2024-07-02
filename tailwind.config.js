/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#00668a',
        'weather-secondary': '#004e71',
      },
      borderColor: {
        'weather-secondary': '#333333',
      },
    },
  },
  plugins: [],
}
