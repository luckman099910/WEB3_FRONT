/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tech-black': '#0B0F1C',
        'card-bg': '#111826',
        'neon-green': '#00FFB2',
        'neon-aqua': '#00CFFF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#C0C0C0',
        'text-highlight': '#B3FFAB',
        'fintech-green': '#00FFB2',
        'electric-blue': '#00CFFF',
        'deep-navy': '#0B0F1C',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      fontWeight: {
        'ultralight': '200',
        'light': '300',
        'normal': '400',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFB2, 0 0 10px #00FFB2, 0 0 15px #00FFB2' },
          '100%': { boxShadow: '0 0 10px #00FFB2, 0 0 20px #00FFB2, 0 0 30px #00FFB2' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 255, 178, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(0, 255, 178, 0.8)' }
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        neonPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px #00FFB2, 0 0 10px #00FFB2, 0 0 15px #00FFB2, 0 0 20px #00FFB2',
            textShadow: '0 0 5px #00FFB2'
          },
          '50%': { 
            boxShadow: '0 0 10px #00FFB2, 0 0 20px #00FFB2, 0 0 30px #00FFB2, 0 0 40px #00FFB2',
            textShadow: '0 0 10px #00FFB2'
          }
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};