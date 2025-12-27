import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFF5F7',
        'dusty-rose': '#D8829D',
        'soft-mauve': '#C5A3AB',
        'chocolate-text': '#5D4037',
        'cream-white': '#FFFDFA',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-quicksand)', 'sans-serif'],
      },
      boxShadow: {
        'pink-soft': '0 10px 30px -10px rgba(216, 130, 157, 0.25)',
        'pink-glow': '0 0 20px rgba(216, 130, 157, 0.15)',
      }
    },
  },
  plugins: [],
}
export default config