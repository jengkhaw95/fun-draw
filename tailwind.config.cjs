/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    "bg-red-200",
    "border-red-500",
    "bg-blue-200",
    "border-blue-500",
    "bg-green-200",
    "border-green-500",
    "bg-yellow-200",
    "border-yellow-500",
    "bg-indigo-200",
    "border-indigo-500",
    "bg-pink-200",
    "border-pink-500",
  ],
  plugins: [],
};
