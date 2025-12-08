'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-md text-center"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl font-bold text-primary mb-4"
        >
          404
        </motion.h1>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-400 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-primary text-dark-bg font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            Ana Sayfaya Dön
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

