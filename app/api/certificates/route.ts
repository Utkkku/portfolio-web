import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { adminAuth } from '../admin/middleware'
import { supabase, CertificateRow } from '@/lib/supabase'

const CERTIFICATES_FILE = join(process.cwd(), 'data', 'certificates.json')

// Fallback: File system functions (for development or when Supabase not configured)
function readCertificatesFromFile() {
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

function writeCertificatesToFile(data: any[]) {
  try {
    const dir = join(process.cwd(), 'data')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(CERTIFICATES_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('File write error:', error)
    return false
  }
}

// Database functions
async function readCertificates() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        // Fallback to file system
        return readCertificatesFromFile()
      }

      // Convert database rows to app format
      return (data || []).map((row: CertificateRow) => ({
        id: row.id,
        name: row.name,
        issuer: row.issuer,
        date: row.date,
        verifyUrl: row.verify_url || '',
        image: row.image || '/certificates/placeholder.jpg',
      }))
    } catch (error) {
      console.error('Error reading from Supabase:', error)
      return readCertificatesFromFile()
    }
  }
  
  // No Supabase, use file system
  return readCertificatesFromFile()
}

async function writeCertificates(certificates: any[]) {
  if (supabase) {
    try {
      // Convert app format to database rows
      const rows: CertificateRow[] = certificates.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        verify_url: cert.verifyUrl || '',
        image: cert.image || '/certificates/placeholder.jpg',
      }))

      // Delete all existing records
      await supabase.from('certificates').delete().neq('id', 0)

      // Insert all records
      const { error } = await supabase.from('certificates').insert(rows)

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

  // No Supabase, try file system (will fail on Netlify)
  return writeCertificatesToFile(certificates)
}

// GET - Tüm sertifikaları getir
export async function GET() {
  try {
    const certificates = await readCertificates()
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

    const certificates = await readCertificates()

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
      await writeCertificates(certificates)
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

    return NextResponse.json(newCertificate, { status: 201 })
  } catch (error) {
    console.error('POST /api/certificates error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Sertifika eklenemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
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
    const certificates = await readCertificates()

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
      verifyUrl: body.verifyUrl || '',
      image: body.image || certificates[index].image,
    }

    try {
      await writeCertificates(certificates)
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
    return NextResponse.json(certificates[index])
  } catch (error) {
    console.error('PUT /api/certificates error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Sertifika güncellenemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
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

    if (supabase) {
      // Use Supabase
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        return NextResponse.json(
          { error: 'Sertifika silinemedi' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // Fallback: File system
    const certificates = await readCertificates()
    const filtered = certificates.filter((c: any) => c.id !== id)

    if (certificates.length === filtered.length) {
      return NextResponse.json(
        { error: 'Sertifika bulunamadı' },
        { status: 404 }
      )
    }

    try {
      await writeCertificates(filtered)
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
    console.error('DELETE /api/certificates error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Sertifika silinemedi'
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
