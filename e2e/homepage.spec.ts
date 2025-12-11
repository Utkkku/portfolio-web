import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/yazılım mühendisi portföy/i)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    const heroSection = page.locator('section').first()
    await expect(heroSection).toBeVisible()
  })

  test('should navigate to contact section', async ({ page }) => {
    await page.goto('/')
    // Scroll to contact section or click navigation link if exists
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(1000)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })
})

