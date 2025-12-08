import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { adminAuth } from '../../admin/middleware'

export async function POST(request: NextRequest) {
  // Auth check
  const authError = adminAuth(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece resim dosyaları yüklenebilir' },
        { status: 400 }
      )
    }

    // Dosya adını oluştur
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `cert-${timestamp}.${extension}`

    // Dosyayı public/certificates klasörüne kaydet
    const uploadDir = join(process.cwd(), 'public', 'certificates')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadPath = join(uploadDir, fileName)

    await writeFile(uploadPath, buffer)

    // Public URL'i döndür
    const publicUrl = `/certificates/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenemedi' },
      { status: 500 }
    )
  }
}

