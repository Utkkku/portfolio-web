'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { api } from '@/lib/api'

import type { Skill } from '@/types'

export default function Skills() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const data = await api.skills.getAll<Skill[]>()
      setSkills(data)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching skills:', error)
      }
      // Fallback to empty array if API fails
      setSkills([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // 3D Tilt effect for cards
  const Card3D = ({ children }: { children: React.ReactNode }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
    const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const xPct = mouseX / width - 0.5
      const yPct = mouseY / height - 0.5
      
      x.set(xPct)
      y.set(yPct)
    }
    
    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }
    
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)',
      borderColor: 'rgba(0, 255, 255, 0.5)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  // Smooth parallax scrolling effect (NicePage style)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || !ref.current) return

    const updateProgress = () => {
      // Debounce for smooth performance
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        if (!ref.current) return
        try {
          const rect = (ref.current as HTMLElement).getBoundingClientRect()
          const windowHeight = window.innerHeight
          const elementTop = rect.top
          const elementHeight = rect.height
          
          // Calculate progress: 0 when section is below viewport, 1 when above
          // Smooth transition as section enters and exits viewport
          const progress = Math.max(
            0,
            Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
          )
          
          setScrollProgress(progress)
                } catch (error) {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn('Skills scroll progress error:', error)
                  }
                }
      }, 10) // Smooth debounce
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isMounted])

  // Smooth parallax values - NicePage style
  // As you scroll down, background moves up smoothly (parallax effect)
  const backgroundY = scrollProgress * -400 + 200 // Smooth upward movement (more pronounced)
  const sectionOpacity = scrollProgress < 0.15 ? scrollProgress / 0.15 : scrollProgress > 0.85 ? (1 - scrollProgress) / 0.15 : 1

  return (
    <motion.section
      id="skills"
      ref={ref}
      style={{
        opacity: sectionOpacity,
      } as React.CSSProperties}
      className="py-20 sm:py-24 lg:py-32 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/30 to-dark-bg" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{t('skills.title')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Yükleniyor...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
              variants={itemVariants}
              className="group relative"
            >
              <Card3D>
                <motion.div
                  variants={cardHoverVariants}
                  whileHover="hover"
                  className="bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-xl p-6 sm:p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  {/* Glassmorphism glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                    style={{
                      boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative z-10 w-full">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">
                      {skill.name}
                    </h3>
                    <div className="w-full bg-dark-surface rounded-full h-2 mt-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-primary via-primary-light to-primary h-2 rounded-full relative"
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      </motion.div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">{skill.level}%</span>
                  </div>
                </motion.div>
              </Card3D>
            </motion.div>
          ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

