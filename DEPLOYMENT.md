# 🚀 Panduan Deployment ke Vercel

Panduan lengkap untuk deploy aplikasi Smartfarm AI Assistant ke Vercel.

## 📋 Prasyarat

- [x] Akun Vercel (gratis di [vercel.com](https://vercel.com))
- [x] Repository GitHub/GitLab dengan kode aplikasi
- [x] Environment variables yang diperlukan
- [x] Supabase project yang sudah setup

## 🔧 Persiapan Environment Variables

Sebelum deploy, pastikan Anda memiliki environment variables berikut:

```bash

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Langkah-langkah Deployment

### 1. Push ke Repository

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project ke Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"New Project"**
3. Import repository GitHub/GitLab Anda
4. Vercel akan otomatis mendeteksi framework **Vite**

### 3. Konfigurasi Environment Variables

Di Vercel Dashboard:

1. Masuk ke **Settings** → **Environment Variables**
2. Tambahkan environment variables:
   
   - `SUPABASE_URL` = URL project Supabase
   - `SUPABASE_ANON_KEY` = Anonymous key Supabase

### 4. Deploy

1. Klik **"Deploy"**
2. Tunggu proses build selesai (±2-3 menit)
3. Aplikasi akan tersedia di URL yang diberikan Vercel

## 📱 Fitur Responsif

Aplikasi telah dioptimalkan untuk semua perangkat:

- **📱 Mobile**: Layout responsif dengan sidebar collapsible
- **💻 Tablet**: Grid layout yang menyesuaikan
- **🖥️ Desktop**: Full layout dengan semua fitur

## 🔧 Konfigurasi yang Sudah Disiapkan

### `vercel.json`
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing dengan rewrites
- Environment variables mapping
- CORS headers untuk API

### `.vercelignore`
- Mengecualikan file development
- Mengecualikan environment files
- Mengecualikan scripts dan dokumentasi

## 🌐 Custom Domain (Opsional)

1. Di Vercel Dashboard → **Settings** → **Domains**
2. Tambahkan domain custom Anda
3. Ikuti instruksi DNS yang diberikan

## 🔍 Monitoring & Analytics

Vercel menyediakan:
- **Real-time Analytics**: Traffic dan performance
- **Function Logs**: Debug serverless functions
- **Speed Insights**: Core Web Vitals

## 🚨 Troubleshooting

### Build Gagal
```bash
# Cek build lokal terlebih dahulu
npm run build

# Jika berhasil lokal, cek environment variables di Vercel
```

### Environment Variables Tidak Terbaca
- Pastikan nama environment variables sama persis
- Redeploy setelah menambah environment variables

### 404 pada Route
- Pastikan `vercel.json` sudah ada dengan konfigurasi rewrites
- SPA routing sudah dikonfigurasi dengan benar

## 📊 Performance Tips

1. **Image Optimization**: Gunakan Vercel Image Optimization
2. **Caching**: Leverage Vercel Edge Network
3. **Bundle Size**: Monitor dengan Vercel Analytics

## 🔄 Auto-Deployment

Setelah setup awal:
- Setiap push ke branch `main` akan trigger auto-deployment
- Preview deployments untuk setiap pull request
- Rollback mudah ke versi sebelumnya

## 📞 Support

Jika mengalami masalah:
1. Cek [Vercel Documentation](https://vercel.com/docs)
2. Review logs di Vercel Dashboard
3. Pastikan semua environment variables sudah benar

---

✅ **Aplikasi siap untuk production dengan performa optimal!**