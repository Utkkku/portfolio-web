# 🧪 Test Rehberi

Bu proje için kapsamlı bir test altyapısı kurulmuştur. Güvenlik, performans, verimlilik ve fonksiyonellik testleri içerir.

## 📋 Test Türleri

### 1. Unit Tests (Jest + React Testing Library)
- **Lokasyon:** `__tests__/` klasörü
- **Kapsam:** Utility fonksiyonlar, component'ler, helper'lar
- **Çalıştırma:** `npm run test`

### 2. Integration Tests
- **Lokasyon:** `__tests__/api/` klasörü
- **Kapsam:** API route'lar, authentication, middleware
- **Çalıştırma:** `npm run test`

### 3. E2E Tests (Playwright)
- **Lokasyon:** `e2e/` klasörü
- **Kapsam:** Kullanıcı akışları, sayfa navigasyonu
- **Çalıştırma:** `npm run test:e2e`

### 4. Security Tests
- **Lokasyon:** `e2e/security.spec.ts`
- **Kapsam:** XSS, SQL injection, security headers
- **Çalıştırma:** `npm run test:e2e` veya `npm run test:security`

### 5. Performance Tests
- **Lokasyon:** `e2e/performance.spec.ts`
- **Kapsam:** Sayfa yükleme süresi, network requests, lazy loading
- **Çalıştırma:** `npm run test:e2e`

---

## 🚀 Hızlı Başlangıç

### Tüm Testleri Çalıştırma

```bash
# Tüm testleri çalıştır
npm run test:all

# Sadece unit testler
npm run test

# Sadece E2E testler
npm run test:e2e

# Coverage raporu ile unit testler
npm run test:coverage
```

### Watch Mode (Geliştirme Sırasında)

```bash
# Testleri watch mode'da çalıştır
npm run test:watch
```

### E2E Testleri UI ile

```bash
# Playwright UI ile testleri çalıştır
npm run test:e2e:ui

# Headed mode (browser görünür)
npm run test:e2e:headed
```

---

## 📊 Test Coverage

Test coverage raporunu görmek için:

```bash
npm run test:coverage
```

Coverage raporu `coverage/` klasöründe oluşturulacaktır.

**Hedef Coverage:**
- Branches: %70
- Functions: %70
- Lines: %70
- Statements: %70

---

## 🔒 Güvenlik Testleri

### NPM Audit

```bash
# Güvenlik açıklarını kontrol et
npm run test:security
```

### Security Headers Kontrolü

E2E testleri içinde security headers kontrol edilir:
- X-Frame-Options
- Content-Security-Policy
- X-Powered-By (kaldırılmalı)

### XSS ve SQL Injection Testleri

`e2e/security.spec.ts` dosyasında otomatik testler bulunur.

---

## ⚡ Performans Testleri

### Lighthouse CI

```bash
# Lighthouse performans testi (localhost:3000 çalışıyor olmalı)
npm run test:performance
```

### Playwright Performans Testleri

`e2e/performance.spec.ts` dosyasında:
- Sayfa yükleme süresi (< 3 saniye)
- Network request sayısı (< 50)
- Image lazy loading kontrolü
- Page weight kontrolü

---

## 🧩 Test Senaryoları

### 1. Authentication Tests

**Dosya:** `__tests__/lib/auth.test.ts`

- ✅ Password doğrulama
- ✅ Token doğrulama
- ✅ Environment variable kontrolü
- ✅ Case sensitivity
- ✅ Null/empty value handling

### 2. Utility Tests

**Dosya:** `__tests__/lib/utils.test.ts`

- ✅ Date formatting
- ✅ Class name utility (cn)
- ✅ Debounce function
- ✅ Throttle function

### 3. Component Tests

**Dosya:** `__tests__/components/ui/Button.test.tsx`

- ✅ Button rendering
- ✅ Click events
- ✅ Disabled state
- ✅ Loading state
- ✅ Variant ve size props
- ✅ Ref forwarding

### 4. API Route Tests

**Dosya:** `__tests__/api/admin/login.test.ts`

- ✅ Successful login
- ✅ Incorrect password
- ✅ Missing password
- ✅ Missing environment variables

### 5. E2E Tests

**Homepage Tests:** `e2e/homepage.spec.ts`
- ✅ Sayfa yükleme
- ✅ Hero section görünürlüğü
- ✅ Responsive tasarım

**Admin Tests:** `e2e/admin.spec.ts`
- ✅ Authentication redirect
- ✅ Login form
- ✅ Error handling
- ✅ Form validation

**Security Tests:** `e2e/security.spec.ts`
- ✅ Security headers
- ✅ XSS protection
- ✅ SQL injection protection

**Performance Tests:** `e2e/performance.spec.ts`
- ✅ Load time
- ✅ Network requests
- ✅ Lazy loading
- ✅ Page weight

---

## 🔧 Yeni Test Ekleme

### Unit Test Örneği

```typescript
// __tests__/myFunction.test.ts
import { myFunction } from '@/lib/myFunction'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected)
  })
})
```

### Component Test Örneği

```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test Örneği

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test'

test('should work correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
```

---

## 🚨 CI/CD Entegrasyonu

GitHub Actions workflow'u `.github/workflows/test.yml` dosyasında tanımlanmıştır.

**Otomatik çalışır:**
- Her push'ta
- Pull request'lerde
- Main ve develop branch'lerinde

**Çalıştırdığı testler:**
1. Unit tests (coverage ile)
2. E2E tests
3. Security audit

---

## 📝 Best Practices

1. **Test İsimlendirme:**
   - Açıklayıcı test isimleri kullanın
   - "should" veya "it" ile başlayın

2. **AAA Pattern:**
   ```typescript
   it('should calculate sum', () => {
     // Arrange
     const a = 1
     const b = 2
     
     // Act
     const result = sum(a, b)
     
     // Assert
     expect(result).toBe(3)
   })
   ```

3. **Cleanup:**
   - `afterEach` ve `afterAll` ile temizlik yapın
   - Mock'ları reset edin

4. **Isolation:**
   - Her test bağımsız olmalı
   - Global state kullanmayın

---

## 🆘 Sorun Giderme

### Testler Çalışmıyor

1. Dependencies kurulu mu?
   ```bash
   npm install
   ```

2. Node.js versiyonu doğru mu? (18+)
   ```bash
   node --version
   ```

### Playwright Testleri Çalışmıyor

1. Browser'lar kurulu mu?
   ```bash
   npx playwright install
   ```

2. Development server çalışıyor mu?
   ```bash
   npm run dev
   ```

### Coverage Düşük

1. Yeni testler ekleyin
2. Coverage threshold'ları kontrol edin (`jest.config.js`)
3. Önemli fonksiyonları test edin

---

## 📚 Kaynaklar

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

## ✅ Test Checklist

Her yeni özellik eklerken:

- [ ] Unit testler yazıldı mı?
- [ ] Component testleri yazıldı mı?
- [ ] E2E test senaryosu eklendi mi?
- [ ] Güvenlik testleri güncellendi mi?
- [ ] Performans etkisi test edildi mi?
- [ ] Coverage %70'in üzerinde mi?

