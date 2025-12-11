# 🔑 Supabase Key'leri Açıklaması

## Hangi Key'i Kullanmalısınız?

### ✅ **anon public** (Publishable Key) - Bu Key'i Kullanın

**Neden:**
- ✅ `NEXT_PUBLIC_` prefix ile kullanıyoruz (Next.js client-side expose için)
- ✅ Row Level Security (RLS) ile korunuyor
- ✅ Client-side'da güvenli (public ama RLS ile korunuyor)
- ✅ API route'larımızda yeterli (admin auth zaten var)

**Netlify'da:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc... (anon public key)
Scope: All scopes veya Runtime
Secret: ❌ HAYIR (NEXT_PUBLIC_ prefix'i varsa secret olmamalı)
```

### ❌ **service_role** (Secret Key) - Kullanmayın

**Neden kullanmıyoruz:**
- ❌ RLS'i bypass eder (güvenlik riski)
- ❌ Client-side'a ASLA gönderilmemeli
- ❌ Bizim use case'imizde gerekli değil (admin auth zaten var)

**Eğer kullanılsaydı (AMA KULLANMAYIN):**
```
Key: SUPABASE_SERVICE_ROLE_KEY  (NEXT_PUBLIC_ OLMAMALI!)
Value: eyJhbGc... (service_role key)
Secret: ✅ EVET (mutlaka secret olmalı)
```

## 🔒 Güvenlik Açıklaması

### anon public key neden güvenli?

1. **Row Level Security (RLS) var:**
   - `supabase-schema.sql`'de RLS aktif
   - Public read access var (herkes okuyabilir)
   - Write işlemleri admin auth ile korunuyor (API route'larında)

2. **Admin Authentication:**
   - API route'larımızda `adminAuth` middleware var
   - Sadece admin token ile write işlemi yapılabilir
   - Client-side'dan direkt Supabase'e write yok

3. **Next.js Environment Variables:**
   - `NEXT_PUBLIC_` prefix'i = client-side'a expose edilir
   - Browser'da görülebilir ama bu normal ve güvenli (RLS sayesinde)

## 📋 Netlify'da Nasıl Ayarlayacaksınız?

### Doğru Ayarlama:

1. **Supabase Dashboard'dan alın:**
   - Settings → API
   - **"anon public"** key'i kopyalayın (Publishable değil, anon public)
   - Project URL'i kopyalayın

2. **Netlify'da ekleyin:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Secret işaretlemeyin:**
   - ✅ Scope: "All scopes" veya "Runtime"
   - ❌ "Secret" checkbox'ını işaretlemeyin
   - `NEXT_PUBLIC_` prefix'i varsa secret olmamalı

## ⚠️ Önemli Notlar

1. **anon public key = Publishable key:**
   - Aynı şey, farklı isimler
   - Supabase dashboard'da "anon public" veya "publishable" olarak gösterilir

2. **NEXT_PUBLIC_ prefix neden var?**
   - Next.js client-side component'lerde kullanmak için
   - API route'larımız server-side ama prefix olmadan da çalışır
   - Ama tutarlılık için `NEXT_PUBLIC_` kullanıyoruz

3. **RLS koruması:**
   - Public key olsa bile RLS ile korunuyor
   - Admin yazma işlemleri API route'larda token ile korunuyor
   - Bu yüzden güvenli

## 🎯 Özet

**Kullanın:**
- ✅ `anon public` key (publishable key)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` olarak Netlify'da
- ✅ Secret işaretlemeyin

**Kullanmayın:**
- ❌ `service_role` key
- ❌ Secret olarak işaretlemeyin (NEXT_PUBLIC_ varsa)

