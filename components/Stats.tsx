'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

import type { Stat } from '@/types'

export default function Stats() {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Stats array - recreated when language changes
  const stats: Stat[] = [
    { value: 50, label: t('stats.completedProjects'), suffix: '+', icon: '🚀' },
    { value: 30, label: t('stats.happyClients'), suffix: '+', icon: '😊' },
    { value: 5, label: t('stats.yearsExperience'), suffix: '+', icon: '⭐' },
    { value: 100, label: t('stats.codeQuality'), suffix: '%', icon: '💎' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Simple scroll-based parallax (no useScroll hook)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || !ref.current) return

    const updateProgress = () => {
      if (!ref.current) return
      try {
        const rect = ref.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const elementTop = rect.top
        const elementHeight = rect.height
        
        const progress = Math.max(
          0,
          Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
        )
        setScrollProgress(progress)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Stats scroll progress error:', error)
          }
        }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [isMounted])

  const y = scrollProgress * 100 - 50
  const opacity = scrollProgress < 0.3 ? scrollProgress / 0.3 : scrollProgress > 0.7 ? (1 - scrollProgress) / 0.3 : 1

  return (
    <motion.section
      id="stats"
      ref={ref}
      style={{ y, opacity }}
      className="py-20 sm:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/50 to-dark-bg" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={`stat-${index}-${stat.value}`}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
              >
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
                  }}
                />

                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl mb-4">{stat.icon}</div>
                  
                  <motion.div
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      {isInView && (
                        <CountUp
                          end={stat.value}
                          suffix={stat.suffix}
                          duration={2}
                          delay={index * 0.2}
                        />
                      )}
                    </motion.span>
                  </motion.div>
                  
                  <p className="text-gray-400 text-sm sm:text-base font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

// CountUp component for animated numbers
function CountUp({
  end,
  suffix = '',
  duration = 2,
  delay = 0,
}: {
  end: number
  suffix?: string
  duration?: number
  delay?: number
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const elapsed = (now - startTime) / 1000 - delay
      const progress = Math.min(elapsed / duration, 1)

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(startValue + (end - startValue) * easeOutQuart)

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    const timeout = setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [end, duration, delay])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

