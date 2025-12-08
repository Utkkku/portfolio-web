'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import type { Skill } from '@/types'

export default function SkillManagement() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
  })

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
    try {
      const headers = { Authorization: `Bearer ${token}` }
      
      if (editingId) {
        await api.skills.update({ ...formData, id: editingId }, headers)
        alert('Yetkinlik güncellendi!')
      } else {
        await api.skills.create(formData, headers)
        alert('Yetkinlik eklendi!')
      }
      
      await fetchSkills()
      resetForm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu'
      alert('Hata: ' + message)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setFormData({
      name: skill.name,
      level: skill.level,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yetkinliği silmek istediğinize emin misiniz?')) return

    const token = getAuthToken()
    try {
      await api.skills.delete(id, { Authorization: `Bearer ${token}` })
      await fetchSkills()
      alert('Yetkinlik silindi!')
    } catch (error) {
      alert('Yetkinlik silinemedi')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: '',
      level: 50,
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
          {editingId ? 'Yetkinlik Düzenle' : 'Yeni Yetkinlik Ekle'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yetkinlik Adı *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="React, TypeScript, Node.js..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seviye: {formData.level}% *
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
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
          Mevcut Yetkinlikler ({skills.length})
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-100 mb-4">
                {skill.name}
              </h3>
              
              <div className="w-full bg-dark-surface rounded-full h-3 mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-primary via-primary-light to-primary h-3 rounded-full"
                />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">{skill.level}%</span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEdit(skill)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Düzenle
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(skill.id)}
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

        {skills.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            Henüz yetkinlik eklenmemiş
          </p>
        )}
      </div>
    </div>
  )
}


