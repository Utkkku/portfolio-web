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
      verifyUrl: body.verifyUrl,
      image: body.image || '/certificates/placeholder.jpg',
    }

    certificates.push(newCertificate)
    writeCertificates(certificates)

    return NextResponse.json(newCertificate, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Sertifika eklenemedi' },
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

    writeCertificates(certificates)
    return NextResponse.json(certificates[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Sertifika güncellenemedi' },
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

    writeCertificates(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Sertifika silinemedi' },
      { status: 500 }
    )
  }
}

