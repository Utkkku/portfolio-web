import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function adminAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('admin_token')?.value ||
                null

  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim' },
      { status: 401 }
    )
  }

  return null
}



