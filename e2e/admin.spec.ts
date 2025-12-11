import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/.*\/admin\/login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByLabel(/şifre/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /giriş/i })).toBeVisible()
  })

  test('should show error on incorrect password', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/şifre/i).fill('wrong-password')
    await page.getByRole('button', { name: /giriş/i }).click()
    
    // Wait for error message
    await page.waitForTimeout(1000)
    const errorMessage = page.getByText(/geçersiz/i)
    await expect(errorMessage).toBeVisible()
  })

  test('should require password field', async ({ page }) => {
    await page.goto('/admin/login')
    const submitButton = page.getByRole('button', { name: /giriş/i })
    await submitButton.click()
    
    // HTML5 validation should prevent submission
    const passwordInput = page.getByLabel(/şifre/i)
    await expect(passwordInput).toHaveAttribute('required')
  })
})

