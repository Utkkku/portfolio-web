import { POST } from '@/app/api/admin/login/route'
import { NextRequest } from 'next/server'
import { verifyPassword } from '@/lib/auth'

jest.mock('@/lib/auth')

describe('/api/admin/login', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, ADMIN_TOKEN: 'test-token-123' }
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return token on successful login', async () => {
    ;(verifyPassword as jest.Mock).mockReturnValue(true)

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'correct-password' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.token).toBe('test-token-123')
  })

  it('should return 401 on incorrect password', async () => {
    ;(verifyPassword as jest.Mock).mockReturnValue(false)

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'wrong-password' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Geçersiz şifre')
    expect(data.success).toBeUndefined()
  })

  it('should return 400 when password is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Şifre gerekli')
  })

  it('should return 500 when ADMIN_TOKEN is not set', async () => {
    delete process.env.ADMIN_TOKEN
    ;(verifyPassword as jest.Mock).mockReturnValue(true)

    const request = new NextRequest('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'correct-password' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Sunucu yapılandırma hatası')
  })
})

