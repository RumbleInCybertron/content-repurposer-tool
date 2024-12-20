import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14213d', // Oxford Blue
          light: '#435b7c',
        },
        secondary: {
          DEFAULT: '#fca311', // Orange Web
          light: '#ffbe47',
          dark: '#c77d00',
        },
        neutral: {
          dark: '#000000', // Black
          light: '#e5e5e5', // Platinum
          white: '#ffffff',
        },
        semantic: {
          success: '#4caf50', // Green
          error: '#e53935',   // Red
          warning: '#ff9800', // Orange
          info: '#2196f3',    // Blue
        },
        accent: {
          lightBlue: '#8ecae6',
          coral: '#ffb4a2',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
