import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || null

  if (verifyToken(token)) {
    return NextResponse.json({ verified: true })
  } else {
    return NextResponse.json(
      { error: 'Geçersiz token' },
      { status: 401 }
    )
  }
}



