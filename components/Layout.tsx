'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useLanguage()

  useEffect(() => {
    // Dark mode'u varsayılan olarak aktif et - only on client
    if (typeof window !== 'undefined' && document.documentElement) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.a
              href="#"
              className="group relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                utkugocer
              </motion.span>
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary-light"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, #00FFFF, #00CCCC)',
                }}
              />
            </motion.a>
            <div className="hidden md:flex items-center space-x-6">
              <LanguageSwitcher />
              <motion.ul
                className="flex items-center space-x-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <li>
                  <a
                    href="#about"
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {t('nav.about')}
                  </a>
                </li>
                <li>
                  <a
                    href="#skills"
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {t('nav.skills')}
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {t('nav.projects')}
                  </a>
                </li>
                <li>
                  <a
                    href="#certifications"
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {t('nav.certifications')}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {t('nav.contact')}
                  </a>
                </li>
              </motion.ul>
            </div>
          </div>
        </nav>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>

      <footer className="border-t border-dark-border bg-dark-surface py-8 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="GitHub"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="mailto:email@example.com"
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="Email"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

