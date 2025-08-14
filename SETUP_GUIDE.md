# Complete Setup Guide - Asisten AI Smartfarm

Panduan lengkap untuk mengatur aplikasi Asisten AI Smartfarm dengan database Supabase.

## Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Akun Supabase (gratis)


## 1. Clone dan Install Dependencies

```bash
# Clone repository (jika belum)
git clone <repository-url>
cd asisten-ai-smartfarm

# Install dependencies
npm install
```

## 2. Setup Supabase Database

### 2.1 Buat Project Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik "Start your project" dan buat akun
3. Buat project baru:
   - **Name**: `asisten-ai-smartfarm`
   - **Database Password**: Buat password kuat (simpan dengan aman)
   - **Region**: Pilih yang terdekat
4. Tunggu hingga project selesai dibuat

### 2.2 Dapatkan Kredensial API

1. Di dashboard project, klik "Settings" → "API"
2. Salin:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public key** (dimulai dengan `eyJ...`)

### 2.3 Setup Environment Variables

Buat atau edit file `.env.local`:

```env


# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.4 Buat Database Schema

**Opsi 1: Menggunakan SQL Editor (Recommended)**

1. Di dashboard Supabase, klik "SQL Editor"
2. Klik "New query"
3. Salin seluruh isi file `supabase/migrations/001_initial_schema.sql`
4. Klik "Run" untuk menjalankan script

**Opsi 2: Menggunakan Schema File**

1. Salin isi file `supabase/schema.sql`
2. Jalankan di SQL Editor Supabase

### 2.5 Insert Sample Data

1. Di SQL Editor, buat query baru
2. Salin isi file `supabase/seed.sql`
3. Klik "Run" untuk insert data sample

### 2.6 Verifikasi Setup

1. Klik "Table Editor" di sidebar
2. Pastikan tabel-tabel berikut ada:
   - `organizations`
   - `profiles`
   - `farms`
   - `flocks`
   - `daily_records`
   - `inventory_items`
   - `workforce_members`
   - `attendance_logs`
   - `inventory_transaction_logs`

3. Periksa data sample di tabel `organizations` dan `farms`

## 3. Switch dari Mock Data ke Supabase

### 3.1 Update App.tsx

Edit file `App.tsx`, ganti import hook:

```typescript
// Ganti ini:
import { useSmartfarmData } from './hooks/useSmartfarmData';

// Dengan ini:
import { useSupabaseData as useSmartfarmData } from './hooks/useSupabaseData';
```

### 3.2 Restart Development Server

```bash
npm run dev
```

## 4. Testing

### 4.1 Test Koneksi Database

1. Buka aplikasi di browser (`http://localhost:5173`)
2. Pastikan data ditampilkan dengan benar
3. Periksa console browser untuk error

### 4.2 Test CRUD Operations

1. **Create**: Coba tambah farm baru
2. **Read**: Pastikan data farm ditampilkan
3. **Update**: Edit data organisasi di Settings
4. **Delete**: (Belum diimplementasi, opsional)

### 4.3 Verifikasi di Supabase

1. Buka Supabase Table Editor
2. Periksa apakah data baru tersimpan
3. Refresh aplikasi, pastikan data persisten

## 5. Features yang Tersedia

### 5.1 Dashboard
- Overview farm dan flock
- Statistik produksi telur
- Grafik performa

### 5.2 Farm Management
- Tambah farm baru
- Lihat daftar farm
- Tambah flock ke farm

### 5.3 Daily Reports
- Input catatan harian
- Mortalitas, produksi telur
- Konsumsi pakan

### 5.4 Inventory Management
- Kelola stok pakan, obat, dll
- Transaksi masuk/keluar
- History transaksi

### 5.5 Workforce Management
- Daftar karyawan
- Absensi harian
- KPI workforce

### 5.6 AI Assistant
- Chat dengan AI
- Analisis data
- Rekomendasi

## 6. API Documentation

Lihat file `API_DOCUMENTATION.md` untuk detail lengkap semua service dan fungsi yang tersedia.

## 7. Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan `.env.local` sudah diisi dengan benar
- Restart development server
- Periksa nama variabel (harus exact match)

### Error: "Failed to fetch data"
- Periksa koneksi internet
- Verifikasi kredensial Supabase
- Cek console browser untuk detail error

### Data tidak muncul
- Pastikan schema database sudah dibuat
- Jalankan seed data
- Periksa foreign key relationships

### Performance Issues
- Enable Row Level Security (RLS) di Supabase
- Tambah index pada kolom yang sering di-query
- Gunakan pagination untuk data besar

## 8. Next Steps

### 8.1 Security (Recommended)

1. **Enable Row Level Security**:
   ```sql
   ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
   -- Repeat for all tables
   ```

2. **Create RLS Policies**:
   ```sql
   CREATE POLICY "Users can view own organization" ON organizations
   FOR SELECT USING (auth.uid() IN (
     SELECT user_id FROM profiles WHERE organization_id = organizations.id
   ));
   ```

### 8.2 Authentication (Optional)

1. Setup Supabase Auth
2. Implement login/logout
3. Protect routes

### 8.3 Real-time Features (Optional)

1. Enable real-time subscriptions
2. Live updates untuk dashboard
3. Collaborative editing

### 8.4 File Storage (Optional)

1. Setup Supabase Storage
2. Upload logo organisasi
3. Attach files ke daily reports

## 9. Deployment

### 9.1 Build Production

```bash
npm run build
```

### 9.2 Deploy Options

- **Vercel**: Automatic deployment dari GitHub
- **Netlify**: Drag & drop build folder
- **Supabase Hosting**: Built-in hosting

### 9.3 Environment Variables Production

Pastikan set environment variables di platform hosting:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`


## Support

Jika mengalami masalah:
1. Periksa console browser untuk error
2. Cek Supabase logs di dashboard
3. Review API documentation
4. Test dengan data sample terlebih dahulu

---

**Selamat! Aplikasi Asisten AI Smartfarm sudah siap digunakan dengan database Supabase.**