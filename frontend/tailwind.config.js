/** @type {import('tailwindcss').Config} */
export default {
  // تأكد أن هذه الكلمة 'class' وليست 'media'
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}