// Simple authentication helper
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set!')
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('ADMIN')))
    return false
  }
  
  return password === adminPassword
}

export function verifyToken(token: string | null): boolean {
  const adminToken = process.env.ADMIN_TOKEN
  
  if (!adminToken) {
    console.error('ADMIN_TOKEN environment variable is not set!')
    return false
  }
  
  return token === adminToken
}





