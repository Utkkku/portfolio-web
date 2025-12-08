'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { api } from '@/lib/api'
import type { Project } from '@/types'

export default function Projects() {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [projectsData, setProjectsData] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.projects.getAll<Project[]>()
        setProjectsData(data)
              } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error fetching projects:', err)
                }
                setProjectsData([])
              }
    }
    fetchProjects()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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

  const featuredProjects = projectsData.filter((p) => p.featured)
  const otherProjects = projectsData.filter((p) => !p.featured)

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
          const rect = ref.current.getBoundingClientRect()
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
                    console.warn('Projects scroll progress error:', error)
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
      id="projects"
      ref={ref}
      style={{
        opacity: sectionOpacity,
      } as React.CSSProperties}
      className="py-20 sm:py-24 lg:py-32 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/30 to-dark-bg" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{t('projects.title')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12"
        >
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variants={itemVariants}
              isHovered={hoveredId === project.id}
              onHover={() => setHoveredId(project.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </motion.div>

        {/* Other Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {otherProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variants={itemVariants}
              isHovered={hoveredId === project.id}
              onHover={() => setHoveredId(project.id)}
              onLeave={() => setHoveredId(null)}
              featured={false}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

function ProjectCard({
  project,
  variants,
  isHovered,
  onHover,
  onLeave,
  featured = true,
}: {
  project: Project
  variants: any
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  featured?: boolean
}) {
  const { t } = useLanguage()
  return (
    <motion.div
      variants={variants}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        className={`
          relative overflow-hidden rounded-2xl border border-dark-border
          bg-dark-card/50 backdrop-blur-sm
          transition-all duration-300 cursor-pointer
          ${featured ? 'h-full' : ''}
        `}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovered
              ? '0 0 50px rgba(0, 255, 255, 0.3)'
              : '0 0 0px rgba(0, 255, 255, 0)',
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Project Icon/Image */}
          <motion.div
            className="text-6xl sm:text-7xl mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {project.image}
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 text-xs sm:text-sm bg-dark-surface border border-dark-border rounded-full text-primary font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary text-dark-bg font-semibold rounded-lg text-sm hover:bg-primary-light transition-colors"
            >
              {t('projects.liveDemo')}
            </motion.a>
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-primary text-primary font-semibold rounded-lg text-sm hover:bg-primary/10 transition-colors"
              >
                {t('projects.github')}
              </motion.a>
            )}
          </div>
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

