# 🌐 Manuel Production Test Rehberi

## ✅ Site Canlı: `https://utkugocer.com`

Otomatik testler SSL sertifika doğrulaması nedeniyle çalışmıyor (normal - SSL henüz tam yayılmamış olabilir). Bu yüzden manuel testler yapalım.

---

## 🔍 Hızlı Test Checklist

### 1. Ana Sayfa Testi (2 dakika)

**URL:** `https://utkugocer.com`

Browser'da açın ve kontrol edin:

- [ ] Sayfa yükleniyor mu?
- [ ] Hero section görünüyor mu?
- [ ] Skills, Projects, Certifications, Contact bölümleri var mı?
- [ ] Sayfa scroll edilebiliyor mu?
- [ ] Tüm içerik görünüyor mu?

**Mobil Test:**
- [ ] F12 → Device Toolbar (Ctrl+Shift+M)
- [ ] Mobile (375x667) seçin
- [ ] Sayfa düzgün görünüyor mu?
- [ ] Menü çalışıyor mu?

---

### 2. Admin Paneli Testi (3 dakika)

**URL:** `https://utkugocer.com/admin/login`

#### A) Login Sayfası:
- [ ] Login sayfası açılıyor mu?
- [ ] Şifre input'u görünüyor mu?
- [ ] "Giriş" butonu var mı?

#### B) Yanlış Şifre Testi:
1. Şifre alanına `wrong-password` yazın
2. "Giriş" butonuna tıklayın
3. **Beklenen:** Hata mesajı görünmeli

#### C) Doğru Şifre Testi:
1. Netlify Dashboard → Environment Variables
2. `ADMIN_PASSWORD` değerini kopyalayın
3. Şifre alanına yapıştırın
4. "Giriş" butonuna tıklayın
5. **Beklenen:** Dashboard'a yönlendirilmeli

#### D) Dashboard Testi:
- [ ] Dashboard açıldı mı?
- [ ] Certificate Management görünüyor mu?
- [ ] Project Management görünüyor mu?
- [ ] Skill Management görünüyor mu?

---

### 3. API Endpoint Testleri (2 dakika)

Browser'da bu URL'leri açın:

#### A) Certificates API:
```
https://utkugocer.com/api/certificates
```
**Beklenen:** JSON array görünmeli
```json
[{"id":1,"name":"...","issuer":"...",...}]
```

#### B) Projects API:
```
https://utkugocer.com/api/projects
```
**Beklenen:** JSON array görünmeli

#### C) Debug Endpoint (Güvenlik Testi):
```
https://utkugocer.com/api/admin/debug
```
**Beklenen:** 404 Not Found (Production'da gizli olmalı)

---

### 4. SSL/Güvenlik Kontrolü (1 dakika)

Browser adres çubuğunda:

- [ ] URL `https://` ile başlıyor mu?
- [ ] 🔒 (kilit) simgesi görünüyor mu?
- [ ] Kilit simgesine tıklayın → "Connection is secure" yazıyor mu?

**Eğer uyarı görüyorsanız:**
- SSL sertifikası henüz tam yayılmamış olabilir
- 24 saat bekleyin veya Netlify'da SSL durumunu kontrol edin

---

### 5. Performans Testi (3 dakika)

#### A) Page Speed Insights:
1. https://pagespeed.web.dev/ adresine gidin
2. `https://utkugocer.com` URL'ini girin
3. "Analyze" butonuna tıklayın
4. Sonuçları kontrol edin:
   - Performance score > 70
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90

#### B) Browser Developer Tools:
1. F12 → Network sekmesi
2. Sayfayı yenileyin (F5)
3. Yükleme süresini kontrol edin
4. Network requests sayısını kontrol edin

---

## ✅ Test Sonuçları

Tüm testleri tamamladıktan sonra sonuçları buraya yazın:

### Başarılı:
```
✅ Ana sayfa yüklendi
✅ Admin paneli çalışıyor
✅ API endpoint'leri çalışıyor
✅ SSL aktif (veya beklemede)
```

### Sorunlar:
```
❌ [Sorun açıklaması]
❌ [Sorun açıklaması]
```

---

## 🆘 Sorun Giderme

### SSL Sertifikası Yoksa:
1. Netlify Dashboard → Domain settings → HTTPS
2. SSL durumunu kontrol edin
3. "Verify DNS configuration" butonuna tıklayın
4. 1-2 saat bekleyin

### Site Yüklenmiyorsa:
1. DNS checker: https://dnschecker.org
2. Domain: `utkugocer.com`, Record: A
3. Tüm lokasyonlarda `75.2.60.5` görünmeli

### Admin Paneli Çalışmıyorsa:
1. Netlify Dashboard → Environment Variables
2. `ADMIN_PASSWORD` ve `ADMIN_TOKEN` var mı?
3. Runtime scope işaretli mi?
4. Deploy log'larını kontrol edin

---

## 📊 Beklenen Sonuçlar

### ✅ Başarılı Test:
- Ana sayfa yükleniyor
- Admin paneli çalışıyor
- API endpoint'leri JSON döndürüyor
- SSL aktif (veya yayılıyor)
- Mobil görünüm çalışıyor

---

**Manuel testleri yapıp sonuçları paylaşın!**

