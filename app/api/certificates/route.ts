import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { adminAuth } from '../admin/middleware'

const CERTIFICATES_FILE = join(process.cwd(), 'data', 'certificates.json')

function readCertificates() {
  try {
    if (!existsSync(CERTIFICATES_FILE)) {
      return []
    }
    const data = readFileSync(CERTIFICATES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function writeCertificates(data: any[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(CERTIFICATES_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET - Tüm sertifikaları getir
export async function GET() {
  try {
    const certificates = readCertificates()
    return NextResponse.json(certificates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Sertifikalar yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni sertifika ekle
export async function POST(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.issuer || !body.date) {
      return NextResponse.json(
        { error: 'Name, issuer ve date alanları zorunludur' },
        { status: 400 }
      )
    }
    
    const certificates = readCertificates()

    // Yeni ID oluştur
    const newId = certificates.length > 0
      ? Math.max(...certificates.map((c: any) => c.id)) + 1
      : 1

    const newCertificate = {
      id: newId,
      name: body.name,
      issuer: body.issuer,
      date: body.date,
      verifyUrl: body.verifyUrl || '',
      image: body.image || '/certificates/placeholder.jpg',
    }

    certificates.push(newCertificate)
    
    try {
      writeCertificates(certificates)
    } catch (writeError) {
      console.error('File write error:', writeError)
      // Netlify'da file system write sorunları olabilir
      return NextResponse.json(
        { 
          error: 'Dosya yazılamadı. Netlify serverless functions dosya sistemine yazamaz. Lütfen database kullanın veya Netlify desteğine başvurun.',
          details: process.env.NODE_ENV === 'development' ? String(writeError) : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(newCertificate, { status: 201 })
  } catch (error) {
    console.error('POST /api/certificates error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Sertifika eklenemedi'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Sertifika güncelle
export async function PUT(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const certificates = readCertificates()

    const index = certificates.findIndex((c: any) => c.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Sertifika bulunamadı' },
        { status: 404 }
      )
    }

    certificates[index] = {
      ...certificates[index],
      name: body.name,
      issuer: body.issuer,
      date: body.date,
      verifyUrl: body.verifyUrl,
      image: body.image || certificates[index].image,
    }

    try {
      writeCertificates(certificates)
    } catch (writeError) {
      console.error('File write error:', writeError)
      return NextResponse.json(
        { 
          error: 'Dosya yazılamadı. Netlify serverless functions dosya sistemine yazamaz.',
          details: process.env.NODE_ENV === 'development' ? String(writeError) : undefined
        },
        { status: 500 }
      )
    }
    return NextResponse.json(certificates[index])
  } catch (error) {
    console.error('PUT /api/certificates error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Sertifika güncellenemedi'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE - Sertifika sil
export async function DELETE(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const certificates = readCertificates()
    const filtered = certificates.filter((c: any) => c.id !== id)

    if (certificates.length === filtered.length) {
      return NextResponse.json(
        { error: 'Sertifika bulunamadı' },
        { status: 404 }
      )
    }

    try {
      writeCertificates(filtered)
    } catch (writeError) {
      console.error('File write error:', writeError)
      return NextResponse.json(
        { 
          error: 'Dosya yazılamadı. Netlify serverless functions dosya sistemine yazamaz.',
          details: process.env.NODE_ENV === 'development' ? String(writeError) : undefined
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/certificates error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Sertifika silinemedi'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

