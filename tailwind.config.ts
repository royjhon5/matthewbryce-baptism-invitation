import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#35506c',
        skyPaper: '#eef7ff',
        skyCloud: '#cfe5f9',
        skyAccent: '#6ea6d8',
        skyLine: '#c7ddf0',
        skyGlow: '#e7f4ff'
      },
      boxShadow: {
        luxe: '0 24px 70px rgba(96, 136, 173, 0.18)'
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif']
      }
    }
  },
  plugins: []
};

export default config;
