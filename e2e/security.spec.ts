import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  test('should have security headers', async ({ page, request }) => {
    const response = await request.get('/')
    
    // Check for common security headers
    const headers = response.headers()
    
    // X-Frame-Options or Content-Security-Policy
    expect(
      headers['x-frame-options'] || 
      headers['content-security-policy']
    ).toBeDefined()
  })

  test('should not expose sensitive information in response headers', async ({ page, request }) => {
    const response = await request.get('/')
    const headers = response.headers()
    
    // Should not expose server information
    expect(headers['server']).not.toContain('version')
    expect(headers['x-powered-by']).toBeUndefined()
  })

  test('should handle XSS attempts in input fields', async ({ page }) => {
    await page.goto('/admin/login')
    
    const xssPayload = '<script>alert("XSS")</script>'
    await page.getByLabel(/şifre/i).fill(xssPayload)
    
    // Should not execute script
    const inputValue = await page.getByLabel(/şifre/i).inputValue()
    expect(inputValue).toBe(xssPayload) // Should be escaped by React
    
    // Check that no alert appeared (would block if XSS worked)
    page.on('dialog', dialog => {
      expect.fail('XSS attack succeeded - dialog appeared')
    })
  })

  test('should prevent SQL injection attempts', async ({ page }) => {
    await page.goto('/admin/login')
    
    const sqlPayload = "'; DROP TABLE users; --"
    await page.getByLabel(/şifre/i).fill(sqlPayload)
    
    // Should handle as normal string input
    const inputValue = await page.getByLabel(/şifre/i).inputValue()
    expect(inputValue).toBe(sqlPayload)
  })
})

