'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { api } from '@/lib/api'
import type { Certificate } from '@/types'

export default function CertificateManagement() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    verifyUrl: '',
    image: '',
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const data = await api.certificates.getAll<Certificate[]>()
      setCertificates(data)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching certificates:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthToken = () => {
    return localStorage.getItem('admin_token') || ''
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = getAuthToken()
      const response = await fetch('/api/certificates/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }))
        alert('Fotoğraf başarıyla yüklendi!')
      } else {
        alert('Fotoğraf yüklenemedi: ' + data.error)
      }
    } catch (error) {
      alert('Fotoğraf yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = getAuthToken()
    try {
      const headers = { Authorization: `Bearer ${token}` }
      
      if (editingId) {
        await api.certificates.update({ ...formData, id: editingId }, headers)
        alert('Sertifika güncellendi!')
      } else {
        await api.certificates.create(formData, headers)
        alert('Sertifika eklendi!')
      }
      
      await fetchCertificates()
      resetForm()
    } catch (error: any) {
      console.error('Certificate save error:', error)
      const message = error?.message || error?.error || 'Bir hata oluştu'
      const details = error?.details || ''
      alert(`Hata: ${message}${details ? '\n\nDetay: ' + details : ''}`)
    }
  }

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id)
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      verifyUrl: cert.verifyUrl,
      image: cert.image,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu sertifikayı silmek istediğinize emin misiniz?')) return

    const token = getAuthToken()
    try {
      await api.certificates.delete(id, { Authorization: `Bearer ${token}` })
      await fetchCertificates()
      alert('Sertifika silindi!')
    } catch (error) {
      alert('Sertifika silinemedi')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: '',
      issuer: '',
      date: '',
      verifyUrl: '',
      image: '',
    })
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-primary mb-6">
          {editingId ? 'Sertifika Düzenle' : 'Yeni Sertifika Ekle'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sertifika Adı *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kurum *
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) =>
                  setFormData({ ...formData, issuer: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tarih (YYYY-MM) *
              </label>
              <input
                type="month"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Doğrulama URL'si *
              </label>
              <input
                type="url"
                value={formData.verifyUrl}
                onChange={(e) =>
                  setFormData({ ...formData, verifyUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/verify"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sertifika Fotoğrafı
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark-bg hover:file:bg-primary-light disabled:opacity-50"
              />
              {uploading && (
                <p className="text-sm text-gray-400">Yükleniyor...</p>
              )}
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400 mb-2">Seçili fotoğraf:</p>
                  <div className="relative w-32 h-24 border border-dark-border rounded-lg overflow-hidden">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-primary text-dark-bg font-semibold rounded-lg hover:bg-primary-light transition-colors"
            >
              {editingId ? 'Güncelle' : 'Ekle'}
            </motion.button>
            {editingId && (
              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-dark-surface border border-dark-border text-gray-300 font-semibold rounded-lg hover:bg-dark-border transition-colors"
              >
                İptal
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* List */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">
          Mevcut Sertifikalar ({certificates.length})
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-4"
            >
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-dark-surface">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>

              <h3 className="text-lg font-bold text-gray-100 mb-2">
                {cert.name}
              </h3>
              <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
              <p className="text-xs text-gray-500 mb-4">{cert.date}</p>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEdit(cert)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Düzenle
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(cert.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Sil
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {certificates.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            Henüz sertifika eklenmemiş
          </p>
        )}
      </div>
    </div>
  )
}

