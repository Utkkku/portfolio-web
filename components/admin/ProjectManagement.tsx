'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import type { Project } from '@/types'

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    link: '',
    github: '',
    featured: false,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await api.projects.getAll<Project[]>()
      setProjects(data)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching projects:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthToken = () => {
    return localStorage.getItem('admin_token') || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = getAuthToken()
    const headers = { Authorization: `Bearer ${token}` }
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        await api.projects.update({ ...payload, id: editingId }, headers)
        alert('Proje güncellendi!')
      } else {
        await api.projects.create(payload, headers)
        alert('Proje eklendi!')
      }
      
      await fetchProjects()
      resetForm()
    } catch (error: any) {
      console.error('Project save error:', error)
      const message = error?.message || error?.error || 'Bir hata oluştu'
      const details = error?.details || ''
      alert(`Hata: ${message}${details ? '\n\nDetay: ' + details : ''}`)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      image: project.image,
      link: project.link,
      github: project.github || '',
      featured: project.featured,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return

    const token = getAuthToken()
    try {
      await api.projects.delete(id, { Authorization: `Bearer ${token}` })
      await fetchProjects()
      alert('Proje silindi!')
    } catch (error) {
      alert('Proje silinemedi')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image: '',
      link: '',
      github: '',
      featured: false,
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
          {editingId ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proje Başlığı *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="E-Ticaret Platformu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Açıklama *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Projenin kısa açıklaması..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teknolojiler (virgülle ayırın) *
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Next.js, TypeScript, Tailwind CSS"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Örnek: React, Node.js, MongoDB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                İkon/Emoji
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="🛒 veya /images/project.jpg"
                maxLength={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                Emoji (tek karakter) veya görsel URL'si
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Canlı Demo URL'si *
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub URL'si (opsiyonel)
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded border-dark-border bg-dark-surface text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-300">
                Öne Çıkan Proje (Featured)
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-8">
              Öne çıkan projeler ana sayfada daha büyük kartlarda gösterilir
            </p>
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
          Mevcut Projeler ({projects.length})
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">{project.image}</div>
                {project.featured && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                    Öne Çıkan
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-100 mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-dark-surface border border-dark-border rounded text-xs text-gray-400"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEdit(project)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Düzenle
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(project.id)}
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

        {projects.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            Henüz proje eklenmemiş
          </p>
        )}
      </div>
    </div>
  )
}

