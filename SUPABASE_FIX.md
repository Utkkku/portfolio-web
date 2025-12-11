# 🔧 Supabase Write Hatası Çözümü

## ❌ Sorun

Admin dashboard'dan veri eklemeye çalıştığınızda "Veritabanına yazılamadı" hatası alıyorsunuz.

**Neden:**
- Row Level Security (RLS) aktif
- RLS politikaları sadece SELECT (read) için var
- INSERT/UPDATE/DELETE işlemleri için policy yok
- `anon public` key ile write işlemi yapılamıyor

## ✅ Çözüm

API route'larında write işlemleri için `service_role` key kullanılacak. Bu key:
- ✅ RLS'i bypass eder (server-side'da güvenli)
- ✅ Sadece API route'larında kullanılır (client-side'a expose edilmez)
- ✅ Admin authentication ile korunuyor

## 📋 Yapmanız Gerekenler

### 1. Supabase Service Role Key Alın

1. **Supabase Dashboard** → **Settings** → **API**
2. **"service_role" secret** key'i kopyalayın
   - ⚠️ **ÖNEMLİ:** Bu key'i asla client-side'da kullanmayın!
   - ⚠️ Sadece server-side (API routes) için

### 2. Netlify'da Environment Variable Ekleyin

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGc... (service_role secret key)
Scope: Runtime (sadece server-side)
✅ Secret: EVET (mutlaka secret olarak işaretleyin!)
```

**ÖNEMLİ:** 
- ❌ `NEXT_PUBLIC_` prefix'i OLMAMALI
- ✅ Secret checkbox'ını işaretleyin
- ✅ Scope: Runtime (All scopes da olabilir ama Runtime yeterli)

### 3. Deploy'u Yeniden Başlatın

1. Netlify Dashboard → **Deploys**
2. **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Deploy'un tamamlanmasını bekleyin

### 4. Test Edin

1. Admin panelden yeni bir sertifika/proje eklemeyi deneyin
2. Artık hata almamalısınız! ✅

## 🔒 Güvenlik

**Neden güvenli:**
1. ✅ `SUPABASE_SERVICE_ROLE_KEY` client-side'a expose edilmez (`NEXT_PUBLIC_` yok)
2. ✅ Sadece API route'larında kullanılır (server-side)
3. ✅ API route'ları admin authentication ile korunuyor
4. ✅ RLS read işlemleri için hala aktif (public read)

## 📝 Environment Variables Özeti

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  → Public, client-side'a expose edilir
  → Scope: All scopes, Secret: ❌

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (anon public)
  → Public, client-side'a expose edilir
  → Scope: All scopes, Secret: ❌
  → RLS ile korunuyor (read only)

SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role)
  → Private, sadece server-side
  → Scope: Runtime, Secret: ✅
  → RLS'i bypass eder (admin write operations için)
```

