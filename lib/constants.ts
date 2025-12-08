// Application-wide constants

export const APP_CONFIG = {
  name: 'Utku Göçer',
  title: 'Yazılım Mühendisi Portföy',
  description: 'Modern ve yüksek performanslı yazılım mühendisi portföy web sitesi',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com',
  author: 'Utku Göçer',
} as const

export const ANIMATION_CONFIG = {
  defaultDuration: 0.5,
  defaultEasing: [0.22, 1, 0.36, 1] as [number, number, number, number],
  staggerDelay: 0.1,
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const COLORS = {
  primary: '#00FFFF',
  primaryLight: '#33FFFF',
  primaryDark: '#00CCCC',
  dark: {
    bg: '#0A0A0A',
    surface: '#111111',
    card: '#1A1A1A',
    border: '#2A2A2A',
  },
} as const



