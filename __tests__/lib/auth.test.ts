import { verifyPassword, verifyToken } from '@/lib/auth'

describe('Auth Utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset env before each test
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('verifyPassword', () => {
    it('should return true when password matches', () => {
      process.env.ADMIN_PASSWORD = 'test-password-123'
      expect(verifyPassword('test-password-123')).toBe(true)
    })

    it('should return false when password does not match', () => {
      process.env.ADMIN_PASSWORD = 'test-password-123'
      expect(verifyPassword('wrong-password')).toBe(false)
    })

    it('should return false when ADMIN_PASSWORD is not set', () => {
      delete process.env.ADMIN_PASSWORD
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      expect(verifyPassword('any-password')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle empty password correctly', () => {
      process.env.ADMIN_PASSWORD = 'test-password'
      expect(verifyPassword('')).toBe(false)
    })

    it('should be case-sensitive', () => {
      process.env.ADMIN_PASSWORD = 'Test-Password'
      expect(verifyPassword('test-password')).toBe(false)
      expect(verifyPassword('Test-Password')).toBe(true)
    })
  })

  describe('verifyToken', () => {
    it('should return true when token matches', () => {
      process.env.ADMIN_TOKEN = 'test-token-123'
      expect(verifyToken('test-token-123')).toBe(true)
    })

    it('should return false when token does not match', () => {
      process.env.ADMIN_TOKEN = 'test-token-123'
      expect(verifyToken('wrong-token')).toBe(false)
    })

    it('should return false when token is null', () => {
      process.env.ADMIN_TOKEN = 'test-token-123'
      expect(verifyToken(null)).toBe(false)
    })

    it('should return false when ADMIN_TOKEN is not set', () => {
      delete process.env.ADMIN_TOKEN
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      expect(verifyToken('any-token')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle empty token string', () => {
      process.env.ADMIN_TOKEN = 'test-token'
      expect(verifyToken('')).toBe(false)
    })
  })
})

