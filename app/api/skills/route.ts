import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { adminAuth } from '../admin/middleware'

const SKILLS_FILE = join(process.cwd(), 'data', 'skills.json')

function readSkills() {
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

function writeSkills(data: any[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(SKILLS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET - Tüm yetkinlikleri getir
export async function GET() {
  try {
    const skills = readSkills()
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
    const skills = readSkills()

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
    writeSkills(skills)

    return NextResponse.json(newSkill, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Yetkinlik eklenemedi' },
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
    const skills = readSkills()

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

    writeSkills(skills)
    return NextResponse.json(skills[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Yetkinlik güncellenemedi' },
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

    const skills = readSkills()
    const filtered = skills.filter((s: any) => s.id !== id)

    if (skills.length === filtered.length) {
      return NextResponse.json(
        { error: 'Yetkinlik bulunamadı' },
        { status: 404 }
      )
    }

    writeSkills(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Yetkinlik silinemedi' },
      { status: 500 }
    )
  }
}


