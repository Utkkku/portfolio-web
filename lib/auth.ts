// Simple authentication helper
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  return password === adminPassword
}

export function verifyToken(token: string | null): boolean {
  const adminToken = process.env.ADMIN_TOKEN || 'admin-token-123'
  return token === adminToken
}



