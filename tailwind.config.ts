import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk RPG Theme
        primary: {
          DEFAULT: '#00F0FF',
          50: '#E6FEFF',
          100: '#B3FCFF',
          200: '#80FAFF',
          300: '#4DF7FF',
          400: '#26F4FF',
          500: '#00F0FF',
          600: '#00C4D4',
          700: '#0098A8',
          800: '#006D7D',
          900: '#004152',
        },
        secondary: {
          DEFAULT: '#FF00FF',
          50: '#FFE6FF',
          100: '#FFB3FF',
          200: '#FF80FF',
          300: '#FF4DFF',
          400: '#FF26FF',
          500: '#FF00FF',
          600: '#D400D4',
          700: '#A800A8',
          800: '#7D007D',
          900: '#520052',
        },
        accent: {
          DEFAULT: '#FFD700',
          50: '#FFFCE6',
          100: '#FFF7B3',
          200: '#FFF180',
          300: '#FFEC4D',
          400: '#FFE426',
          500: '#FFD700',
          600: '#D4B300',
          700: '#A88F00',
          800: '#7D6A00',
          900: '#524600',
        },
        background: {
          DEFAULT: '#0A0E27',
          50: '#1A1F3D',
          100: '#151933',
          200: '#10142A',
          300: '#0A0E27',
          400: '#080B1F',
          500: '#060817',
          600: '#04050F',
          700: '#020307',
          800: '#000000',
          900: '#000000',
        },
        surface: {
          DEFAULT: '#1A1F3D',
          light: '#252B4D',
          dark: '#10142A',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Attribute colors
        creativity: '#FF6B6B',
        logic: '#4ECDC4',
        focus: '#45B7D1',
        communication: '#96CEB4',
        // Rarity colors
        common: '#9CA3AF',
        rare: '#3B82F6',
        epic: '#A855F7',
        legendary: '#F59E0B',
        // Border color
        border: '#252B4D',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 240, 255, 0.3)',
        'glow-secondary': '0 0 20px rgba(255, 0, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'xp-gain': 'xp-gain 1s ease-out forwards',
        'level-up': 'level-up 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'xp-gain': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.8)' },
          '50%': { opacity: '1', transform: 'translateY(-20px) scale(1.2)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1)' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
