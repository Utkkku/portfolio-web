// Theming system for consistent design tokens

export const theme = {
  colors: {
    primary: {
      DEFAULT: '#00FFFF',
      light: '#33FFFF',
      dark: '#00CCCC',
    },
    dark: {
      bg: '#0A0A0A',
      surface: '#111111',
      card: '#1A1A1A',
      border: '#2A2A2A',
    },
    gray: {
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    glow: '0 0 30px rgba(0, 255, 255, 0.3)',
  },
  animations: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    easing: {
      default: [0.22, 1, 0.36, 1] as [number, number, number, number],
      easeInOut: 'easeInOut',
      easeOut: 'easeOut',
    },
  },
} as const

export type Theme = typeof theme



