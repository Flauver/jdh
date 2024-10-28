/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

