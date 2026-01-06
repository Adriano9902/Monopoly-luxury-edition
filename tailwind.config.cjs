/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#fcf6ba', // Champagne Light
          200: '#fbf5b7', // Pale Gold
          300: '#bf953f', // Classic Gold
          400: '#aa771c', // Dark Gold
          500: '#d99a1c', // Base (legacy support)
          600: '#b38728', // Metallic Shadow
          700: '#8a6e2f', // Antique Bronze
          800: '#4a3b18', // Deep Bronze
          900: '#2a1d0a', // Darkest Amber
        },
        luxury: {
          black: '#050505',   // Rich Black (not #000)
          charcoal: '#0f0f11', // Warm Graphite
          obsidian: '#0a0a0c', // Deep Blue-Black
          card: '#141414',     // Surface Color
          glass: 'rgba(15, 15, 17, 0.6)', // Premium Glass
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
        'gold-text': 'linear-gradient(to bottom, #fcf6ba, #bf953f, #aa771c)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #d99a1c' },
          '50%': { boxShadow: '0 0 20px #e4b63e' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        tumble: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.9)' },
          '25%': { transform: 'rotateX(90deg) rotateY(45deg) rotateZ(10deg) scale(1.1)' },
          '50%': { transform: 'rotateX(180deg) rotateY(90deg) rotateZ(-20deg) scale(1)' },
          '75%': { transform: 'rotateX(270deg) rotateY(135deg) rotateZ(10deg) scale(1.1)' },
          '100%': { transform: 'rotateX(360deg) rotateY(180deg) rotateZ(0deg) scale(0.9)' },
        },
        tumble3d: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(720deg) rotateZ(360deg)' },
        },
        diceLand: {
          '0%': { transform: 'translateY(-150px) scale(1.8) rotate(-45deg)', filter: 'blur(10px)', opacity: '0' },
          '40%': { transform: 'translateY(0) scale(0.7, 1.2) rotate(10deg)', filter: 'blur(0)', opacity: '1' },
          '60%': { transform: 'translateY(-20px) scale(1.1, 0.9) rotate(-5deg)' },
          '80%': { transform: 'translateY(0) scale(0.95, 1.05) rotate(2deg)' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
        },
        cardDraw: {
          '0%': { transform: 'translate(var(--start-x), var(--start-y)) rotate(var(--start-rot)) scale(0.2)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px) rotate(-1deg)' },
          '75%': { transform: 'translateX(4px) rotate(1deg)' },
        },
        shockwave: {
          '0%': { transform: 'scale(0.5)', opacity: '1', border: '1px solid gold' },
          '100%': { transform: 'scale(3)', opacity: '0', border: '0px solid transparent' },
        },
        speedStreak: {
          '0%': { transform: 'translateY(100%) translateX(-50%) scaleY(0)', opacity: '0' },
          '50%': { transform: 'translateY(0) translateX(-50%) scaleY(1.5)', opacity: '0.5' },
          '100%': { transform: 'translateY(-100%) translateX(-50%) scaleY(0)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        levitate: {
          '0%, 100%': { transform: 'translateY(0) rotateX(0deg) rotateZ(0deg)' },
          '50%': { transform: 'translateY(-8px) rotateX(5deg) rotateZ(2deg)' },
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        tumble: 'tumble 0.3s linear infinite',
        'tumble-3d': 'tumble3d 0.6s linear infinite',
        'dice-land': 'diceLand 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        shake: 'shake 0.4s ease-in-out infinite',
        shockwave: 'shockwave 0.8s ease-out forwards',
        'speed-streak': 'speedStreak 0.2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        levitate: 'levitate 4s ease-in-out infinite',
        'card-draw': 'cardDraw 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
};
