# 🔒 Admin Dashboard Kullanım Kılavuzu

## Kurulum

1. **Environment Variables Oluştur**
   
   Proje kök dizininde `.env.local` dosyası oluşturun:
   ```env
   ADMIN_PASSWORD=your-secure-password
   ADMIN_TOKEN=your-secure-token
   ```

2. **Gerekli Klasörler**
   
   Aşağıdaki klasörler otomatik oluşturulacaktır:
   - `data/` - JSON veri dosyaları için
   - `public/certificates/` - Yüklenen sertifika fotoğrafları için

## Kullanım

### 1. Admin Paneline Giriş

1. Tarayıcınızda `/admin/login` adresine gidin
2. `.env.local` dosyasında belirlediğiniz şifreyi girin
3. Giriş yaptıktan sonra `/admin` sayfasına yönlendirileceksiniz

### 2. Sertifika Yönetimi

#### Yeni Sertifika Ekleme

1. Admin panelinde "Yeni Sertifika Ekle" formunu doldurun:
   - **Sertifika Adı**: Sertifikanın tam adı
   - **Kurum**: Sertifikayı veren kurum/platform
   - **Tarih**: Kazanım tarihi (YYYY-MM formatında)
   - **Doğrulama URL'si**: Sertifikanın resmi doğrulama web sitesi
   - **Sertifika Fotoğrafı**: Fotoğraf yükleyin (JPG/PNG)

2. "Ekle" butonuna tıklayın

#### Sertifika Düzenleme

1. Mevcut sertifikalar listesinde "Düzenle" butonuna tıklayın
2. Form otomatik olarak doldurulacaktır
3. İstediğiniz alanları değiştirin
4. "Güncelle" butonuna tıklayın

#### Sertifika Silme

1. Mevcut sertifikalar listesinde "Sil" butonuna tıklayın
2. Onay mesajını kabul edin

### 3. Fotoğraf Yükleme

- Desteklenen formatlar: JPG, PNG
- Fotoğraflar `public/certificates/` klasörüne kaydedilir
- Dosya adları otomatik olarak `cert-{timestamp}.{extension}` formatında oluşturulur
- Yüklenen fotoğraflar anında önizleme olarak gösterilir

## API Endpoints

### Sertifikalar

- `GET /api/certificates` - Tüm sertifikaları getir (Auth gerekmez)
- `POST /api/certificates` - Yeni sertifika ekle (Auth gerekli)
- `PUT /api/certificates` - Sertifika güncelle (Auth gerekli)
- `DELETE /api/certificates?id={id}` - Sertifika sil (Auth gerekli)
- `POST /api/certificates/upload` - Fotoğraf yükle (Auth gerekli)

### Authentication

- `POST /api/admin/login` - Admin girişi
- `GET /api/admin/verify` - Token doğrulama

## Güvenlik Notları

⚠️ **ÖNEMLİ**: Bu sistem basit bir authentication kullanmaktadır. Production ortamında:

1. JWT token kullanın
2. Şifreleri hash'leyin (bcrypt)
3. Rate limiting ekleyin
4. HTTPS kullanın
5. Daha güvenli bir veritabanı kullanın (PostgreSQL, MongoDB vb.)

## Veri Yapısı

### Certificate JSON Yapısı

```json
{
  "id": 1,
  "name": "Sertifika Adı",
  "issuer": "Kurum Adı",
  "date": "2024-01",
  "verifyUrl": "https://example.com/verify",
  "image": "/certificates/cert-1234567890.jpg"
}
```

## Sorun Giderme

### "Yetkisiz erişim" hatası alıyorum

- Token'ın süresi dolmuş olabilir, tekrar giriş yapın
- `.env.local` dosyasındaki `ADMIN_TOKEN` değerini kontrol edin

### Fotoğraf yüklenmiyor

- `public/certificates/` klasörünün yazma izni olduğundan emin olun
- Dosya boyutunu kontrol edin (maksimum önerilen: 5MB)
- Dosya formatının JPG veya PNG olduğundan emin olun

### Sertifikalar görünmüyor

- `data/certificates.json` dosyasının var olduğundan emin olun
- JSON formatının geçerli olduğunu kontrol edin

## Sonraki Adımlar

- [ ] Proje yönetimi ekle
- [ ] Daha gelişmiş authentication (JWT)
- [ ] Veritabanı entegrasyonu
- [ ] Bulk import/export özelliği
- [ ] Fotoğraf düzenleme (crop, resize)



