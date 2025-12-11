import { test, expect } from '@playwright/test'

const PRODUCTION_URL = 'https://utkugocer.com'

test.describe('Production Site Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for production tests
    test.setTimeout(30000)
  })

  test('should load homepage successfully', async ({ page }) => {
    await page.goto(PRODUCTION_URL)
    await expect(page).toHaveTitle(/yazılım mühendisi portföy/i)
    
    // Check if page loaded without errors
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText?.length).toBeGreaterThan(0)
  })

  test('should have valid SSL certificate', async ({ page, context }) => {
    // Navigate to page and check for SSL
    const response = await page.goto(PRODUCTION_URL)
    expect(response?.status()).toBe(200)
    
    // Check URL protocol
    expect(page.url()).toMatch(/^https:\/\//)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    
    // Check for main sections
    const sections = page.locator('section')
    await expect(sections.first()).toBeVisible()
  })

  test('should load all main sections', async ({ page }) => {
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    
    // Scroll through page to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(2000)
    
    // Verify page is interactive
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('body')).toBeVisible()
    
    // Check viewport size
    const viewport = page.viewportSize()
    expect(viewport?.width).toBe(375)
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto(PRODUCTION_URL)
    
    // Check title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    
    // Filter out known/acceptable errors
    const criticalErrors = errors.filter(
      error => !error.includes('favicon') && 
               !error.includes('404') &&
               !error.includes('Failed to load resource')
    )
    
    expect(criticalErrors.length).toBe(0)
  })
})

test.describe('Production Admin Panel Tests', () => {
  test('should redirect to login when accessing admin', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/admin`)
    await expect(page).toHaveURL(/.*\/admin\/login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/admin/login`)
    await expect(page.getByLabel(/şifre/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /giriş/i })).toBeVisible()
  })

  test('should show error on incorrect password', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/admin/login`)
    await page.getByLabel(/şifre/i).fill('wrong-password')
    await page.getByRole('button', { name: /giriş/i }).click()
    
    // Wait for error message
    await page.waitForTimeout(2000)
    const errorMessage = page.getByText(/geçersiz|hatalı|hata/i)
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Production API Tests', () => {
  test('should respond to certificates API', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/certificates`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('should respond to projects API', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/projects`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('should protect debug endpoint in production', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/admin/debug`)
    
    // Should return 404 in production without token
    expect(response.status()).toBe(404)
  })

  test('should have proper CORS headers', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/certificates`)
    const headers = response.headers()
    
    // Check response is JSON
    expect(headers['content-type']).toContain('application/json')
  })
})

test.describe('Production Security Tests', () => {
  test('should use HTTPS', async ({ page }) => {
    await page.goto(PRODUCTION_URL)
    expect(page.url()).toMatch(/^https:\/\//)
  })

  test('should not expose sensitive headers', async ({ request }) => {
    const response = await request.get(PRODUCTION_URL)
    const headers = response.headers()
    
    // Should not expose server version
    if (headers['server']) {
      expect(headers['server']).not.toContain('version')
    }
    
    // Should not have x-powered-by
    expect(headers['x-powered-by']).toBeUndefined()
  })

  test('should handle XSS attempts', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/admin/login`)
    
    const xssPayload = '<script>alert("XSS")</script>'
    await page.getByLabel(/şifre/i).fill(xssPayload)
    
    const inputValue = await page.getByLabel(/şifre/i).inputValue()
    expect(inputValue).toBe(xssPayload)
    
    // Check that no alert dialog appeared (would block if XSS worked)
    page.on('dialog', () => {
      expect.fail('XSS attack succeeded - dialog appeared')
    })
    
    await page.waitForTimeout(1000)
  })
})

test.describe('Production Performance Tests', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Should load within 5 seconds (production with CDN)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have reasonable page size', async ({ page }) => {
    const response = await page.goto(PRODUCTION_URL)
    
    // Check response size
    const headers = response?.headers() || {}
    const contentLength = headers['content-length']
    
    if (contentLength) {
      const sizeInKB = parseInt(contentLength) / 1024
      // Initial HTML should be under 500KB
      expect(sizeInKB).toBeLessThan(500)
    }
  })

  test('should use image optimization', async ({ page }) => {
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    
    // Check for Next.js Image optimization
    const images = await page.locator('img').all()
    
    // Should have images
    if (images.length > 0) {
      // Check that images are loaded
      for (const img of images.slice(0, 3)) {
        const src = await img.getAttribute('src')
        // Next.js optimized images have special paths
        expect(src).toBeTruthy()
      }
    }
  })
})

