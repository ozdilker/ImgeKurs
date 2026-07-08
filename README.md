# Bahçelievler İmge VIP Kurs Merkezi

Modern, profesyonel eğitim kurumu web sitesi ve yönetim paneli.

## Teknolojiler

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Firebase** (Firestore, Auth, Storage)
- **Vercel** (Deployment)

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

Site `http://localhost:3000` adresinde çalışır.

## Sayfa Yapısı

| Sayfa | URL |
|-------|-----|
| Anasayfa | `/` |
| Hakkımızda | `/sayfa/hakkimizda` |
| Eğitim Programları | `/egitim-programi` |
| Eğitim Detay | `/egitim-detay/[slug]` |
| Başarılarımız | `/basarilarimiz` |
| Galeri | `/galeri` |
| Eğitim Videoları | `/egitim/[slug]` |
| İletişim | `/iletisim` |
| Admin Panel | `/admin` |

## Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com) üzerinde yeni proje oluşturun
2. Firestore Database ve Authentication (Email/Password) etkinleştirin
3. Storage bucket oluşturun
4. Web app config bilgilerini `.env.local` dosyasına ekleyin
5. Firestore ve Storage kurallarını deploy edin:

```bash
npx firebase-tools login
npx firebase-tools use <PROJECT_ID>
npx firebase-tools deploy --only firestore:rules,storage
```

6. Firebase Authentication'da admin kullanıcısı oluşturun

## Admin Panel

`/admin/login` adresinden giriş yapın.

Firebase yapılandırılmamışsa demo modunda panele erişilebilir.

Yönetim paneli özellikleri:
- Genel bakış dashboard
- Kurs yönetimi (CRUD)
- Öğrenci/kayıt başvuru listesi
- Başarı hikayeleri yönetimi
- Galeri yönetimi
- Sayfa içerik düzenleme
- Site ayarları

## Vercel Deployment

1. [GitHub reposunu](https://github.com/ozdilker/ImgeKurs) Vercel'e bağlayın
2. Environment variables ekleyin (`.env.example` dosyasındaki değerler)
3. Deploy edin

```bash
npx vercel
```

## Tasarım

Tasarım standartları `Design.md` dosyasında tanımlıdır:
- **Renkler:** Deep Navy (#1A3D5D), Gold (#D4AF37), Accent Orange (#F15A24)
- **Font:** Montserrat
- **Layout:** 1200px max container, 8px spacing scale

## Lisans

© Bahçelievler İmge Eğitim Kurumları
