'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'tr' | 'en' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr')
  const [translations, setTranslations] = useState<Record<string, any>>({})

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translation = await import(`@/locales/${language}.json`)
        setTranslations(translation.default || {})
      } catch (error) {
        console.error('Error loading translations:', error)
        // Fallback to Turkish
        try {
          const fallback = await import('@/locales/tr.json')
          setTranslations(fallback.default || {})
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError)
          setTranslations({})
        }
      }
    }
    loadTranslations()
  }, [language])

  // Load saved language from localStorage (runs first, before translations load)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLanguage = localStorage.getItem('language') as Language | null
        if (savedLanguage && ['tr', 'en', 'de'].includes(savedLanguage)) {
          setLanguageState(savedLanguage)
        }
      } catch (error) {
        console.warn('Error reading language from localStorage:', error)
        // Keep default 'tr'
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return key // Return key if translations not loaded yet
    }
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

