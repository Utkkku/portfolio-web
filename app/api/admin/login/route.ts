import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Şifre gerekli' },
        { status: 400 }
      )
    }

    if (verifyPassword(password)) {
      // Generate a simple token (in production, use JWT)
      const token = process.env.ADMIN_TOKEN
      
      if (!token) {
        console.error('ADMIN_TOKEN environment variable is not set!')
        return NextResponse.json(
          { error: 'Sunucu yapılandırma hatası' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ token, success: true })
    } else {
      return NextResponse.json(
        { error: 'Geçersiz şifre' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}





