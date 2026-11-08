/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070d',
        panel: '#0b101c',
        line: '#20293a',
        cyan: '#62e9ff',
        violet: '#9b8cff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 32px rgba(98,233,255,.14)',
      },
    },
  },
  plugins: [],
}
