'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

// Only selected images: ai-generated, ai-robot, and 2149
const backgroundImages = [
  '/images/hero/ai-generated-concept-human.jpg',
  '/images/hero/portrait-person-ai-robot1.jpg',
  '/images/hero/2149739750.jpg',
]

// Fallback gradients
const fallbackGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
]

export default function HeroSection() {
  const { t } = useLanguage()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentRole, setCurrentRole] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(backgroundImages.length).fill(false))
  const [isMounted, setIsMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const roles = [
    'Full Stack Developer',
    'React Specialist',
    'Next.js Expert',
    'TypeScript Developer',
    'UI/UX Enthusiast',
  ]

  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  // Transform values for parallax effect
  const orb1X = useTransform(x, [-20, 20], [-10, 10])
  const orb1Y = useTransform(y, [-20, 20], [-10, 10])
  const orb2X = useTransform(x, [-20, 20], [10, -10])
  const orb2Y = useTransform(y, [-20, 20], [10, -10])

  // Mount check
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return
    
    const handleMouseMove = (e: MouseEvent) => {
      try {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        
        // Normalize mouse position to -1 to 1 range
        const normalizedX = (clientX / innerWidth) * 2 - 1
        const normalizedY = (clientY / innerHeight) * 2 - 1
        
        mouseX.set(normalizedX * 20)
        mouseY.set(normalizedY * 20)
        
        setMousePosition({ x: clientX, y: clientY })
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Mouse move error:', error)
          }
        }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, isMounted])

  // Auto-rotate roles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // NicePage-style smooth scroll-based image transitions (debounced for memory efficiency)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    const handleScroll = () => {
      // Debounce scroll events to reduce memory usage
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        try {
          const scrollY = window.scrollY || window.pageYOffset || 0
          const windowHeight = window.innerHeight || 1000
          const documentHeight = document.documentElement?.scrollHeight || windowHeight * 3
          const maxScroll = Math.max(1, documentHeight - windowHeight)
          
          // Calculate scroll progress (0 to 1)
          const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll))
          
          // Smooth transition between images - each image gets 1/3 of scroll
          const imageTransitionPoint = 1 / backgroundImages.length
          let newIndex = 0
          
          for (let i = 0; i < backgroundImages.length; i++) {
            if (scrollProgress >= i * imageTransitionPoint) {
              newIndex = i
            }
          }
          
          // Only update if changed
          if (newIndex !== currentImageIndex) {
            setCurrentImageIndex(newIndex)
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Scroll handler error:', error)
          }
        }
      }, 50) // Debounce 50ms to reduce memory usage
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isMounted, currentImageIndex])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
  }

  if (!isMounted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-primary">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Fixed Background Images with scroll-based transitions */}
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((image, index) => {
          const isActive = index === currentImageIndex
          const hasError = imageErrors[index] || false
          
          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isActive ? 1 : 0,
              }}
              transition={{ 
                duration: 2.5, 
                ease: [0.25, 0.46, 0.45, 0.94], // NicePage-style smooth ease
              }}
              style={{
                backgroundImage: !hasError ? `url(${image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed', // Fixed background effect - stays in place while scrolling
                willChange: 'opacity',
              }}
            >
              {hasError && (
                <div
                  className="w-full h-full"
                  style={{
                    background: fallbackGradients[index] || fallbackGradients[0],
                    backgroundAttachment: 'fixed',
                  }}
                />
              )}
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/85 via-dark-bg/70 to-dark-bg/90" />
              <div className="absolute inset-0 bg-primary/5" />
            </motion.div>
          )
        })}
      </div>

      {/* Animated gradient mesh overlay */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Mouse follow effect */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 255, 0.15), transparent 40%)`,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        style={{
          x: orb1X,
          y: orb1Y,
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        style={{
          x: orb2X,
          y: orb2Y,
        }}
      />

      {/* Content - flows over fixed background */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
                  {/* Greeting */}
                  <motion.p
                    variants={itemVariants}
                    className="text-primary font-mono text-sm sm:text-base mb-4"
                  >
                    {t('hero.greeting')}
                  </motion.p>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 relative"
          >
            <motion.span
              className="bg-gradient-to-r from-gray-100 via-primary to-gray-100 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% auto',
              }}
            >
              Utku
            </motion.span>
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            />
          </motion.h1>

          {/* Animated Role Title */}
          <motion.div
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-300 mb-6 h-16 sm:h-20 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentRole}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.5 }}
                className="text-primary"
              >
                {roles[currentRole]}
              </motion.h2>
            </AnimatePresence>
          </motion.div>

                  {/* Description */}
                  <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg"
                  >
                    {t('hero.description')}
                  </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={ctaVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
                    <motion.a
                      href="#projects"
                      variants={ctaVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="px-8 py-4 bg-primary text-dark-bg font-semibold rounded-lg shadow-lg shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg backdrop-blur-sm"
                    >
                      {t('hero.cta.projects')}
                    </motion.a>
                    <motion.a
                      href="#contact"
                      variants={ctaVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg backdrop-blur-sm bg-dark-bg/30"
                    >
                      {t('hero.cta.contact')}
                    </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll progress indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {backgroundImages.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary/30'
            }`}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </motion.section>
  )
}
