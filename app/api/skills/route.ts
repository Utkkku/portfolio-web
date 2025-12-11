import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { adminAuth } from '../admin/middleware'
import { supabase, supabaseAdmin, SkillRow } from '@/lib/supabase'

const SKILLS_FILE = join(process.cwd(), 'data', 'skills.json')

// Fallback: File system functions
function readSkillsFromFile() {
  try {
    if (!existsSync(SKILLS_FILE)) {
      return []
    }
    const data = readFileSync(SKILLS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function writeSkillsToFile(data: any[]) {
  try {
    const dir = join(process.cwd(), 'data')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(SKILLS_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('File write error:', error)
    return false
  }
}

// Database functions
async function readSkills() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        return readSkillsFromFile()
      }

      return (data || []).map((row: SkillRow) => ({
        id: row.id,
        name: row.name,
        level: row.level,
      }))
    } catch (error) {
      console.error('Error reading from Supabase:', error)
      return readSkillsFromFile()
    }
  }

  return readSkillsFromFile()
}

async function writeSkills(skills: any[]) {
  // Use admin client for write operations (bypasses RLS)
  const writeClient = supabaseAdmin || supabase
  
  if (writeClient) {
    try {
      const rows: SkillRow[] = skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: Math.max(0, Math.min(100, parseInt(String(skill.level)) || 0)),
      }))

      await writeClient.from('skills').delete().neq('id', 0)
      const { error } = await writeClient.from('skills').insert(rows)

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

  return writeSkillsToFile(skills)
}

// GET - Tüm yetkinlikleri getir
export async function GET() {
  try {
    const skills = await readSkills()
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json(
      { error: 'Yetkinlikler yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni yetkinlik ekle
export async function POST(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const skills = await readSkills()

    // Yeni ID oluştur
    const newId = skills.length > 0
      ? Math.max(...skills.map((s: any) => s.id)) + 1
      : 1

    const newSkill = {
      id: newId,
      name: body.name,
      level: Math.max(0, Math.min(100, parseInt(body.level) || 0)),
    }

    skills.push(newSkill)

    try {
      await writeSkills(skills)
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

    return NextResponse.json(newSkill, { status: 201 })
  } catch (error) {
    console.error('POST /api/skills error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Yetkinlik eklenemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}

// PUT - Yetkinlik güncelle
export async function PUT(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const skills = await readSkills()

    const index = skills.findIndex((s: any) => s.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Yetkinlik bulunamadı' },
        { status: 404 }
      )
    }

    skills[index] = {
      ...skills[index],
      name: body.name,
      level: Math.max(0, Math.min(100, parseInt(body.level) || 0)),
    }

    try {
      await writeSkills(skills)
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
    return NextResponse.json(skills[index])
  } catch (error) {
    console.error('PUT /api/skills error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Yetkinlik güncellenemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}

// DELETE - Yetkinlik sil
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
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        return NextResponse.json(
          { error: 'Yetkinlik silinemedi' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // Fallback: File system
    const skills = await readSkills()
    const filtered = skills.filter((s: any) => s.id !== id)

    if (skills.length === filtered.length) {
      return NextResponse.json(
        { error: 'Yetkinlik bulunamadı' },
        { status: 404 }
      )
    }

    try {
      await writeSkills(filtered)
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
    console.error('DELETE /api/skills error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Yetkinlik silinemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
