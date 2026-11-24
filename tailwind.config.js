/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#091710",
          900: "#112A1E",
          800: "#1B3B2B",
          700: "#27503B",
          600: "#366B50",
          500: "#498967",
          400: "#68A783",
          300: "#92C5A6",
          200: "#C1E1CD",
          100: "#E3F3EA",
          50: "#F3F9F5",
        },
        sage: {
          50: "#F8FAF8",
          100: "#EDF3EE",
          200: "#DCE7DE",
          300: "#BFD3C3",
          400: "#9EBAA4",
          500: "#7A9E82",
        },
        aqi: {
          good: "#10b981", // emerald-500
          moderate: "#f59e0b", // amber-500
          sensitive: "#f97316", // orange-500
          unhealthy: "#ef4444", // red-500
          veryUnhealthy: "#9333ea", // purple-600
          hazardous: "#991b1b", // red-800
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 185, 129, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(16, 185, 129, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 20px 40px -6px rgba(16, 185, 129, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'breezy': '0 10px 25px -5px rgba(5, 150, 105, 0.4), 0 8px 10px -6px rgba(5, 150, 105, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
};
