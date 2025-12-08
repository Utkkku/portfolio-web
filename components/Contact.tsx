'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

// Constants
const PHONE_NUMBER = '+905317306397'
const WHATSAPP_NUMBER = '905317306397'

// Animation variants
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Contact card configuration
interface ContactCardConfig {
  type: 'whatsapp' | 'phone'
  title: string
  description: string
  href: string
  buttonText: string
  buttonColor: string
  hoverColor: string
  glowColor: string
  gradientColor: string
}

const contactCards: ContactCardConfig[] = [
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Hemen mesaj gönderin ve hızlıca yanıt alın',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    buttonText: 'Mesaj Gönder',
    buttonColor: 'bg-green-500',
    hoverColor: 'group-hover:text-green-400',
    glowColor: 'rgba(37, 211, 102, 0.3)',
    gradientColor: 'from-green-500/10',
  },
  {
    type: 'phone',
    title: 'Telefon',
    description: 'Doğrudan arayın veya mesaj gönderin',
    href: `tel:${PHONE_NUMBER}`,
    buttonText: 'Ara',
    buttonColor: 'bg-primary',
    hoverColor: 'group-hover:text-primary',
    glowColor: 'rgba(0, 255, 255, 0.3)',
    gradientColor: 'from-primary/10',
  },
]

export default function Contact() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Scroll-based animations (optimized)
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
        const rect = (ref.current as HTMLElement).getBoundingClientRect()
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
          console.warn('Contact scroll progress error:', error)
        }
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [isMounted])

  const sectionY = scrollProgress * 160 - 80
  const sectionOpacity = scrollProgress < 0.3 ? scrollProgress / 0.3 : scrollProgress > 0.7 ? (1 - scrollProgress) / 0.3 : 1
  const sectionScale = scrollProgress < 0.5 ? 0.98 + scrollProgress * 0.04 : 1 - (scrollProgress - 0.5) * 0.04

  return (
    <motion.section
      id="contact"
      ref={ref}
      style={{
        y: sectionY,
        opacity: sectionOpacity,
        scale: sectionScale,
      }}
      className="py-20 sm:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <BackgroundOrbs />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <SectionHeader variants={itemVariants} />

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {contactCards.map((card) => (
              <ContactCard
                key={card.type}
                config={card}
                variants={itemVariants}
                phoneNumber={card.type === 'phone' ? PHONE_NUMBER : undefined}
              />
            ))}
          </div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Genellikle 24 saat içinde yanıt veriyorum
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// Background Orbs Component
function BackgroundOrbs() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/30 to-dark-bg" />
      <motion.div
        className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
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
      <motion.div
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </>
  )
}

// Section Header Component
function SectionHeader({ variants }: { variants: typeof itemVariants }) {
  const { t } = useLanguage()
  return (
    <motion.div variants={variants} className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
        <span className="text-primary">{t('contact.title')}</span>
      </h2>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        {t('contact.subtitle')}
      </p>
    </motion.div>
  )
}

// Contact Card Component
interface ContactCardProps {
  config: ContactCardConfig
  variants: typeof itemVariants
  phoneNumber?: string
}

function ContactCard({ config, variants, phoneNumber }: ContactCardProps) {
  const isExternal = config.type === 'whatsapp'

  return (
    <motion.div variants={variants}>
      <motion.a
        href={config.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
          className="
          block relative overflow-hidden
          bg-dark-card/60 backdrop-blur-md
          border border-dark-border rounded-2xl p-8
          group cursor-pointer
          transition-all duration-300
          h-full flex flex-col
        "
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.gradientColor} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 0px ${config.glowColor.replace('0.3', '0')}`,
              `0 0 30px ${config.glowColor}`,
              `0 0 0px ${config.glowColor.replace('0.3', '0')}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 justify-between">
          <div>
            {/* Icon */}
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {config.type === 'whatsapp' ? (
                <WhatsAppIcon />
              ) : (
                <PhoneIcon />
              )}
            </motion.div>

            {/* Title */}
            <h3
              className={`text-2xl font-bold text-gray-100 mb-3 ${config.hoverColor} transition-colors`}
            >
              {config.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 mb-6">{config.description}</p>

            {/* Phone Number (only for phone card) */}
            {phoneNumber && (
              <div className="mb-6">
                <p className="text-primary font-mono text-lg font-semibold">
                  {phoneNumber}
                </p>
              </div>
            )}
          </div>

          {/* Button */}
          <motion.div
            className={`inline-flex items-center justify-center px-6 py-3 ${config.buttonColor} ${
              config.type === 'phone' ? 'text-dark-bg' : 'text-white'
            } font-semibold rounded-lg w-full`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{config.buttonText}</span>
          </motion.div>
        </div>
      </motion.a>
    </motion.div>
  )
}

// WhatsApp Icon Component
function WhatsAppIcon() {
  return (
    <svg
      className="w-16 h-16 text-green-500"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// Phone Icon Component
function PhoneIcon() {
  return (
    <svg
      className="w-16 h-16 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

