/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-blue-600',
    'text-green-600', 
    'text-yellow-600',
    'text-red-600'
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#0d0e14',
        'bg2': '#13151f',
        'bg3': '#1c1f2e',
        'bg4': '#242840',
        'border': '#2a2f4a',
        'border2': '#353b5a',
        'text': '#f0f2ff',
        'text2': '#9ba3c8',
        'text3': '#5c6494',
        'accent': '#5ce8b4',
        'purple': '#7c6aff',
        'purple2': '#3d3480',
        'green': '#22c97a',
        'yellow': '#f5c518',
        'red': '#e8455a',
        'orange': '#f97316',
      },
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
