/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: "#10b981", // 0-50
          moderate: "#eab308", // 51-100
          sensitive: "#f97316", // 101-150
          unhealthy: "#ef4444", // 151-200
          veryUnhealthy: "#8b5cf6", // 201-300
          hazardous: "#7f1d1d", // 301+
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
