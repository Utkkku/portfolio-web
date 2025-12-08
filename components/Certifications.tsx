'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { api } from '@/lib/api'
import type { Certificate } from '@/types'

export default function Certifications() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await api.certificates.getAll<Certificate[]>()
        setCertificates(data)
              } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error fetching certificates:', err)
                }
                setCertificates([])
              }
    }
    fetchCertificates()
  }, [])

  // Simple scroll-based parallax (no useScroll hook)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || !containerRef.current) return

    const updateProgress = () => {
      if (!containerRef.current) return
      try {
        const rect = containerRef.current.getBoundingClientRect()
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
                  console.warn('Certifications scroll progress error:', error)
                }
              }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [isMounted])


  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Scroll buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 400
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
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
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Scroll values calculated from scrollProgress state (already set above)
  const sectionY = scrollProgress * 200 - 100
  const sectionOpacity = scrollProgress < 0.3 ? scrollProgress / 0.3 : scrollProgress > 0.7 ? (1 - scrollProgress) / 0.3 : 1

  return (
    <motion.section
      id="certifications"
      ref={containerRef}
      style={{
        transform: `translateY(${sectionY}px)`,
        opacity: sectionOpacity,
      }}
      className="py-20 sm:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/30 to-dark-bg" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{t('certifications.title')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('certifications.subtitle')}
          </p>
        </motion.div>

        {/* Scroll Container with Navigation */}
        <div className="relative">
          {/* Left Scroll Button */}
          <motion.button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-full p-3 text-primary hover:bg-primary/10 transition-all duration-300 hidden md:flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll left"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Right Scroll Button */}
          <motion.button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-full p-3 text-primary hover:bg-primary/10 transition-all duration-300 hidden md:flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll right"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`
              overflow-x-auto overflow-y-hidden
              scrollbar-hide
              scroll-smooth
              cursor-grab active:cursor-grabbing
              -mx-4 px-4
              pb-4
              ${isDragging ? 'select-none' : ''}
            `}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex gap-6 sm:gap-8"
              style={{ width: 'max-content' }}
            >
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  variants={itemVariants}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 gap-2"
        >
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>← Kaydırarak daha fazlasını görün →</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  )
}

// Certificate Image Component with fallback
function CertificateImage({ certificate }: { certificate: Certificate }) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      className="relative w-full h-48 sm:h-56 mb-6 rounded-lg overflow-hidden bg-dark-surface border border-dark-border"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {!imageError ? (
        <Image
          src={certificate.image}
          alt={certificate.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 320px, 380px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="text-6xl">🎓</div>
        </div>
      )}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

function CertificateCard({
  certificate,
  variants,
}: {
  certificate: Certificate
  variants: any
}) {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
  }

  return (
    <motion.div
      variants={variants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 w-[320px] sm:w-[380px]"
    >
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        className={`
          relative overflow-hidden rounded-2xl border border-dark-border
          bg-dark-card/60 backdrop-blur-md
          p-6 sm:p-8
          transition-all duration-300
          group
        `}
        style={{
          boxShadow: isHovered
            ? '0 20px 60px rgba(0, 255, 255, 0.2), 0 0 0 1px rgba(0, 255, 255, 0.1)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovered
              ? 'inset 0 0 30px rgba(0, 255, 255, 0.1)'
              : 'inset 0 0 0px rgba(0, 255, 255, 0)',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          {/* Certificate Image */}
          <CertificateImage certificate={certificate} />

          {/* Certificate Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 group-hover:text-primary transition-colors duration-300">
            {certificate.name}
          </h3>

          {/* Issuer */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-1 bg-primary rounded-full" />
            <p className="text-gray-400 text-sm sm:text-base font-medium">
              {certificate.issuer}
            </p>
          </div>

          {/* Date */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">{formatDate(certificate.date)}</p>
          </div>

          {/* Verify Button */}
          <motion.a
            href={certificate.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              inline-flex items-center gap-2
              px-5 py-3
              bg-primary/10 border border-primary/30
              text-primary font-semibold rounded-lg
              hover:bg-primary/20 hover:border-primary/50
              transition-all duration-300
              group/button
            "
          >
            <span>{t('certifications.verify')}</span>
          </motion.a>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{
            x: isHovered ? '100%' : '-100%',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

