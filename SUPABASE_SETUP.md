# Setup Supabase Database

Panduan ini akan membantu Anda mengatur database Supabase untuk aplikasi Asisten AI Smartfarm.

## 1. Buat Akun Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik "Start your project" dan buat akun baru
3. Verifikasi email Anda

## 2. Buat Project Baru

1. Setelah login, klik "New Project"
2. Pilih organization atau buat yang baru
3. Isi detail project:
   - **Name**: `asisten-ai-smartfarm`
   - **Database Password**: Buat password yang kuat (simpan dengan aman)
   - **Region**: Pilih yang terdekat dengan lokasi Anda
4. Klik "Create new project"
5. Tunggu beberapa menit hingga project selesai dibuat

## 3. Dapatkan Kredensial API

1. Di dashboard project, klik "Settings" di sidebar kiri
2. Klik "API" di menu settings
3. Salin informasi berikut:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public key** (key yang panjang dimulai dengan `eyJ...`)

## 4. Setup Environment Variables

1. Buka file `.env.local` di root project
2. Ganti placeholder dengan kredensial Supabase Anda:

```env


# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Buat Database Schema

1. Di dashboard Supabase, klik "SQL Editor" di sidebar
2. Klik "New query"
3. Salin seluruh isi file `supabase/schema.sql` ke editor
4. Klik "Run" untuk menjalankan script
5. Pastikan semua tabel berhasil dibuat tanpa error

## 6. Verifikasi Setup

1. Klik "Table Editor" di sidebar
2. Anda harus melihat tabel-tabel berikut:
   - `organizations`
   - `profiles`
   - `farms`
   - `flocks`
   - `daily_records`
   - `inventory_items`
   - `workforce_members`
   - `attendance_logs`
   - `inventory_transaction_logs`

3. Periksa apakah data sample sudah ada di tabel `organizations`, `profiles`, `farms`, dll.

## 7. Update Aplikasi untuk Menggunakan Supabase

Untuk menggunakan Supabase sebagai pengganti data mock:

1. Buka file `App.tsx`
2. Ganti import hook:

```typescript
// Ganti ini:
import { useSmartfarmData } from './hooks/useSmartfarmData';

// Dengan ini:
import { useSupabaseData as useSmartfarmData } from './hooks/useSupabaseData';
```

3. Restart development server:

```bash
npm run dev
```

## 8. Testing

1. Buka aplikasi di browser
2. Pastikan data ditampilkan dengan benar
3. Coba tambah farm, flock, atau data lainnya
4. Periksa di Supabase Table Editor apakah data tersimpan

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env.local` sudah diisi dengan benar
- Restart development server setelah mengubah environment variables

### Error: "Failed to load data"
- Periksa koneksi internet
- Pastikan kredensial Supabase benar
- Periksa console browser untuk error detail

### Data tidak muncul
- Pastikan schema SQL sudah dijalankan dengan benar
- Periksa apakah data sample sudah ada di database
- Periksa console untuk error API

## Fitur Tambahan (Opsional)

### Row Level Security (RLS)
Untuk keamanan yang lebih baik, aktifkan RLS:

1. Di Table Editor, pilih tabel
2. Klik "Settings" tab
3. Enable "Row Level Security"
4. Buat policies sesuai kebutuhan

### Real-time Subscriptions
Untuk update data real-time:

1. Di dashboard, klik "Database"
2. Klik "Replication"
3. Enable replication untuk tabel yang diinginkan

### Storage untuk File Upload
Untuk upload logo organisasi:

1. Klik "Storage" di sidebar
2. Buat bucket baru: `organization-logos`
3. Set bucket sebagai public
4. Update kode untuk menggunakan Supabase Storage

## Support

Jika mengalami masalah:
1. Periksa [dokumentasi Supabase](https://supabase.com/docs)
2. Cek [community forum](https://github.com/supabase/supabase/discussions)
3. Lihat console browser untuk error messages