'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-md text-center"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">
          Bir Hata Oluştu
        </h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'Beklenmeyen bir hata oluştu'}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-4">
            Hata ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-dark-bg font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            Tekrar Dene
          </motion.button>
          <motion.button
            onClick={() => (window.location.href = '/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            Ana Sayfaya Dön
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

