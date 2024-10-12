/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "border-move": "borderMove 3s linear infinite",
      },
      keyframes: {
        borderMove: {
          "0%": { borderColor: "rgba(236, 72, 153, 1)" }, // pink-500
          "25%": { borderColor: "rgba(0, 153, 255, 1)" }, // light blue
          "50%": { borderColor: "rgba(75, 85, 99, 1)" }, // gray-600
          "75%": { borderColor: "rgba(236, 72, 153, 1)" }, // pink-500
          "100%": { borderColor: "rgba(0, 153, 255, 1)" }, // light blue
        },
      },
      colors: {
        "scroll-thumb": "#4b5563",
        "scroll-track": "#1f1f1f",
        "scroll-hover": "#6b7280",
      },
    },
  },
  plugins: [],
};
