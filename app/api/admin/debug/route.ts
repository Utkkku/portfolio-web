import { NextRequest, NextResponse } from 'next/server'

// Debug endpoint - Admin şifre sorununu tespit etmek için
export async function GET(request: NextRequest) {
  // Güvenlik: Sadece development veya belirli bir debug token ile erişilebilir
  const debugToken = request.nextUrl.searchParams.get('token')
  const allowedToken = process.env.DEBUG_TOKEN || 'debug-only-local'
  
  // Production'da bu endpoint'i gizli tut
  if (process.env.NODE_ENV === 'production' && debugToken !== allowedToken) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    adminTokenSet: !!process.env.ADMIN_TOKEN,
    adminTokenLength: process.env.ADMIN_TOKEN?.length || 0,
    // Güvenlik: Gerçek değerleri gösterme, sadece varlığını kontrol et
    note: 'Bu endpoint sadece debug amaçlıdır. Production\'da kullanmayın.'
  })
}

