import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { adminAuth } from '../admin/middleware'

const PROJECTS_FILE = join(process.cwd(), 'data', 'projects.json')

function readProjects() {
  try {
    if (!existsSync(PROJECTS_FILE)) {
      return []
    }
    const data = readFileSync(PROJECTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function writeProjects(data: any[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET - Tüm projeleri getir
export async function GET() {
  try {
    const projects = readProjects()
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json(
      { error: 'Projeler yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni proje ekle
export async function POST(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const projects = readProjects()

    // Yeni ID oluştur
    const newId = projects.length > 0
      ? Math.max(...projects.map((p: any) => p.id)) + 1
      : 1

    const newProject = {
      id: newId,
      title: body.title,
      description: body.description,
      technologies: Array.isArray(body.technologies)
        ? body.technologies
        : body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
      image: body.image || '💼',
      link: body.link || '#',
      github: body.github || '',
      featured: body.featured === true || body.featured === 'true',
    }

    projects.push(newProject)
    writeProjects(projects)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje eklenemedi' },
      { status: 500 }
    )
  }
}

// PUT - Proje güncelle
export async function PUT(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const projects = readProjects()

    const index = projects.findIndex((p: any) => p.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      )
    }

    projects[index] = {
      ...projects[index],
      title: body.title,
      description: body.description,
      technologies: Array.isArray(body.technologies)
        ? body.technologies
        : body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
      image: body.image || projects[index].image,
      link: body.link || projects[index].link,
      github: body.github || projects[index].github || '',
      featured: body.featured === true || body.featured === 'true',
    }

    writeProjects(projects)
    return NextResponse.json(projects[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Proje sil
export async function DELETE(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const projects = readProjects()
    const filtered = projects.filter((p: any) => p.id !== id)

    if (projects.length === filtered.length) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      )
    }

    writeProjects(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Proje silinemedi' },
      { status: 500 }
    )
  }
}





