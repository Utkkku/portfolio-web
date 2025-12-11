import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have reasonable page weight', async ({ page }) => {
    const response = await page.goto('/')
    
    // Check response size (should be reasonable for a Next.js page)
    const contentLength = response?.headers()['content-length']
    if (contentLength) {
      const sizeInKB = parseInt(contentLength) / 1024
      // Initial HTML should be under 200KB
      expect(sizeInKB).toBeLessThan(200)
    }
  })

  test('should not have too many network requests', async ({ page }) => {
    const requests: string[] = []
    
    page.on('request', (request) => {
      requests.push(request.url())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should have reasonable number of requests
    expect(requests.length).toBeLessThan(50)
  })

  test('should use lazy loading for images', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    const lazyImages = await Promise.all(
      images.map(async (img) => {
        const loading = await img.getAttribute('loading')
        return loading === 'lazy'
      })
    )

    // At least some images should be lazy loaded
    expect(lazyImages.some(Boolean)).toBeTruthy()
  })
})

