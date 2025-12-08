'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CertificateManagement from '@/components/admin/CertificateManagement'
import ProjectManagement from '@/components/admin/ProjectManagement'
import SkillManagement from '@/components/admin/SkillManagement'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'certificates' | 'projects' | 'skills'>('certificates')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Token'ı doğrula
    fetch('/api/admin/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('admin_token')
          router.push('/admin/login')
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      })
      .finally(() => setIsLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Ana Sayfa
              </a>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Çıkış Yap
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-dark-border">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'certificates'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sertifikalar
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'projects'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Projeler
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'skills'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Yetkinlikler
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'certificates' ? (
              <CertificateManagement />
            ) : activeTab === 'projects' ? (
              <ProjectManagement />
            ) : (
              <SkillManagement />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

