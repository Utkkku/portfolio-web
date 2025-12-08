// Centralized type definitions

export interface Certificate {
  id: number
  name: string
  issuer: string
  date: string
  verifyUrl: string
  image: string
}

export interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
  link: string
  github?: string
  featured: boolean
}

export interface Skill {
  id: number
  name: string
  level: number
}

export interface Stat {
  value: number
  label: string
  suffix?: string
  icon: string
}


