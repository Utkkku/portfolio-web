import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { adminAuth } from '../admin/middleware'
import { supabase, supabaseAdmin, ProjectRow } from '@/lib/supabase'

const PROJECTS_FILE = join(process.cwd(), 'data', 'projects.json')

// Fallback: File system functions
function readProjectsFromFile() {
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

function writeProjectsToFile(data: any[]) {
  try {
    const dir = join(process.cwd(), 'data')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('File write error:', error)
    return false
  }
}

// Database functions
async function readProjects() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        return readProjectsFromFile()
      }

      // Convert database rows to app format
      return (data || []).map((row: ProjectRow) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        technologies: row.technologies || [],
        image: row.image || '💼',
        link: row.link || '#',
        github: row.github || '',
        featured: row.featured || false,
      }))
    } catch (error) {
      console.error('Error reading from Supabase:', error)
      return readProjectsFromFile()
    }
  }

  return readProjectsFromFile()
}

async function writeProjects(projects: any[]) {
  // Use admin client for write operations (bypasses RLS)
  const writeClient = supabaseAdmin || supabase
  
  if (writeClient) {
    try {
      const rows: ProjectRow[] = projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : [],
        image: project.image || '💼',
        link: project.link || '#',
        github: project.github || '',
        featured: project.featured || false,
      }))

      await writeClient.from('projects').delete().neq('id', 0)
      const { error } = await writeClient.from('projects').insert(rows)

      if (error) {
        console.error('Supabase write error:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error writing to Supabase:', error)
      throw error
    }
  }

  return writeProjectsToFile(projects)
}

// GET - Tüm projeleri getir
export async function GET() {
  try {
    const projects = await readProjects()
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

    // Validation
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title ve description alanları zorunludur' },
        { status: 400 }
      )
    }

    const projects = await readProjects()

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
        : (body.technologies || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      image: body.image || '💼',
      link: body.link || '#',
      github: body.github || '',
      featured: body.featured === true || body.featured === 'true',
    }

    projects.push(newProject)

    try {
      await writeProjects(projects)
    } catch (writeError) {
      console.error('Write error:', writeError)
      return NextResponse.json(
        {
          error: supabase
            ? 'Veritabanına yazılamadı. Lütfen Supabase yapılandırmasını kontrol edin.'
            : 'Dosya yazılamadı. Netlify serverless functions dosya sistemine yazamaz. Lütfen Supabase veritabanı kurulumunu yapın.',
          details: process.env.NODE_ENV === 'development' ? String(writeError) : undefined,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('POST /api/projects error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Proje eklenemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
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
    const projects = await readProjects()

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

    try {
      await writeProjects(projects)
    } catch (writeError) {
      console.error('Write error:', writeError)
      return NextResponse.json(
        {
          error: supabase
            ? 'Veritabanına yazılamadı.'
            : 'Dosya yazılamadı. Lütfen Supabase veritabanı kurulumunu yapın.',
          details: process.env.NODE_ENV === 'development' ? String(writeError) : undefined,
        },
        { status: 500 }
      )
    }
    return NextResponse.json(projects[index])
  } catch (error) {
    console.error('PUT /api/projects error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Proje güncellenemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
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

    const writeClient = supabaseAdmin || supabase
    
    if (writeClient) {
      const { error } = await writeClient
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        return NextResponse.json(
          { error: 'Proje silinemedi' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // Fallback: File system
    const projects = await readProjects()
    const filtered = projects.filter((p: any) => p.id !== id)

    if (projects.length === filtered.length) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      )
    }

    try {
      await writeProjects(filtered)
    } catch (writeError) {
      console.error('Write error:', writeError)
      return NextResponse.json(
        {
          error: 'Dosya yazılamadı. Lütfen Supabase veritabanı kurulumunu yapın.',
          details: process.env.NODE_ENV === 'development' ? String(writeError) : undefined,
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/projects error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Proje silinemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
