-- Mevcut JSON verilerini Supabase'e migrate etmek için SQL script
-- Supabase SQL Editor'de çalıştırın

-- Certificates
INSERT INTO certificates (name, issuer, date, verify_url, image)
VALUES 
  ('Tüm Yönleriyle MySql Ve Veri Tabanı Programlama', 'Udemy', '2024-03', 'https://www.udemy.com/certificate/UC-5b4178c6-7245-4e41-93d5-991f56fa25d4/', '/certificates/cert-1765194217883.png')
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (title, description, technologies, image, link, github, featured)
VALUES 
  ('Akıllı Tarım Sistemleri', 'Bitki Öneri Modülü: Toprak analizine (NPK, pH, sıcaklık, nem, yağış) dayalı olarak, Random Forest algoritmasıyla en uygun bitki türünü önerir. Yaprak Hastalık Tespiti: PlantVillage veri seti ile eğitilmiş CNN modeli sayesinde kullanıcıların yüklediği yaprak görsellerinden hastalık tespiti yapar. Tarımsal Planlama Modülü: Hava durumu verilerine göre ekim, sulama ve ilaçlama gibi faaliyetlere dair öneriler sunar', ARRAY['Swift', 'Random Forest', 'CNN'], '☘', 'https://utkugocer.com', '', true),
  
  ('Şirket Tanıtım Amaçlı Web Sitesi', 'Havalandırma sistemleri şirketi için yaptığım küçük çaplı web sitesi.', ARRAY['Next.js'], '༄', 'https://mesbay.com', '', false),
  
  ('Akıllı Mama Sistemi', 'Evcil hayvanlar için geliştirilen bu projede, belirli saatlerde otomatik olarak mama verebilen bir sistem tasarladım. Arduino ile çalışarak motor yardımıyla mama bırakıyor, sensörlerle de mama seviyesini kontrol ediyor. Aynı zamanda kullanıcıya bilgilendirme yapılabiliyor.', ARRAY['IoT'], '💼', 'https://utkugocer.com', '', false),
  
  ('Borsa Analiz Sistemi', 'Borsa verilerini kullanarak hisse senetleri için al-sat sinyalleri veren bir yapay zeka modeli geliştirdim. Geçmiş fiyatlar ve teknik göstergeler üzerinde çalıştım. Python ile veri temizliği, model eğitimi ve test aşamalarını yaptım. Sonuçları grafiklerle gösteren basit bir arayüz de oluşturdum', ARRAY['Scikit-learn', 'TensorFlow'], '💼', 'https://utkugocer.com', '', false),
  
  ('İş Bulma Sitesi', 'Aktif olarak geliştirdiğim tekstil sektörü üzerinde büyük çaplı bir iş bulma sitesi.', ARRAY['Next.js', 'TypeScript', 'SQL', 'API Client'], '💼', 'https://utkugocer.com', '', false)
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (name, level)
VALUES 
  ('Next.js', 85),
  ('TypeScript', 85),
  ('SQL', 86),
  ('Tailwind CSS', 90),
  ('Python', 75),
  ('C++', 72),
  ('React', 69)
ON CONFLICT DO NOTHING;

