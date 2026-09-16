import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#121212',
        paper: '#f4f4f0',
        signal: '#e7fb54',
        line: '#d7d7d0',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
