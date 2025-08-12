# 🚀 Setup Supabase Database untuk Asisten AI SmartFarm

## 📋 Prerequisites

Sebelum memulai setup, pastikan Anda memiliki:
- Akun Supabase (https://supabase.com)
- Project Supabase yang sudah dibuat
- Node.js dan npm terinstall

## 🔧 Langkah-langkah Setup

### 1. **Buat Project Supabase**

1. Buka [https://supabase.com](https://supabase.com)
2. Login atau Sign Up
3. Klik "New Project"
4. Pilih organization
5. Isi detail project:
   - **Name**: `asisten-ai-smartfarm`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih region terdekat (Asia Southeast untuk Indonesia)
6. Klik "Create new project"
7. Tunggu project selesai dibuat (biasanya 2-3 menit)

### 2. **Dapatkan Credentials**

Setelah project selesai, buka **Settings** → **API**:

1. **Project URL**: Copy URL yang muncul
   ```
   https://abcdefghijklmnop.supabase.co
   ```

2. **anon public key**: Copy anon key yang muncul
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. **Setup Environment Variables**

1. Buat file `.env.local` di root project
2. Isi dengan credentials Supabase:

```bash
# Gemini AI API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ PENTING**: Ganti `your_gemini_api_key_here` dengan API key Gemini yang sebenarnya!

### 4. **Jalankan SQL Schema**

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Buka **SQL Editor**
4. Copy seluruh isi file `database/schema.sql`
5. Paste ke SQL Editor
6. Klik **Run** untuk menjalankan script

### 5. **Verifikasi Setup**

Setelah SQL schema berhasil dijalankan, Anda akan melihat:

✅ **9 tabel** berhasil dibuat:
- `organizations` - Data organisasi
- `profiles` - Data profil pengguna
- `farms` - Data lokasi peternakan
- `flocks` - Data kawanan ternak
- `daily_records` - Laporan harian
- `inventory_items` - Item inventori
- `inventory_transactions` - Transaksi inventori
- `workforce_members` - Data tenaga kerja
- `attendance_logs` - Log absensi

✅ **Sample data** berhasil diinsert
✅ **Indexes** berhasil dibuat
✅ **Triggers** berhasil dibuat
✅ **RLS policies** berhasil dibuat

## 🗄️ Struktur Database

### **Relasi Antar Tabel**

```
organizations (1) ←→ (N) profiles
organizations (1) ←→ (N) farms
organizations (1) ←→ (N) inventory_items
organizations (1) ←→ (N) workforce_members

farms (1) ←→ (N) flocks
flocks (1) ←→ (N) daily_records

inventory_items (1) ←→ (N) inventory_transactions
workforce_members (1) ←→ (N) attendance_logs
```

### **Fitur Database**

- **UUID Primary Keys** - Untuk keamanan dan scalability
- **Foreign Key Constraints** - Untuk data integrity
- **Auto-timestamps** - `created_at` dan `updated_at`
- **Business Logic Triggers** - Auto-update population dan inventory
- **Row Level Security (RLS)** - Untuk keamanan data
- **Indexes** - Untuk performance query

## 🧪 Testing Koneksi

### **1. Test di Browser Console**

Buka browser console dan jalankan:

```javascript
// Test koneksi Supabase
const { data, error } = await supabase
  .from('organizations')
  .select('*')
  .limit(1);

if (error) {
  console.error('Error:', error);
} else {
  console.log('Success:', data);
}
```

### **2. Test di Aplikasi**

1. Jalankan aplikasi: `npm run dev`
2. Buka browser console
3. Lihat apakah ada error koneksi
4. Cek apakah data berhasil dimuat

## 🔒 Security & Permissions

### **Row Level Security (RLS)**

Semua tabel sudah di-enable RLS dengan policy dasar:
- Users dapat melihat data organisasi mereka sendiri
- Policy akan diupdate sesuai kebutuhan authentication

### **Environment Variables**

- File `.env.local` tidak akan di-commit ke git
- API keys tersimpan dengan aman
- Credentials tidak terekspos di client-side

## 🚨 Troubleshooting

### **Error: "Invalid API key"**
- Pastikan `VITE_SUPABASE_ANON_KEY` sudah benar
- Copy ulang dari Supabase Dashboard

### **Error: "Invalid URL"**
- Pastikan `VITE_SUPABASE_URL` sudah benar
- Format: `https://project-id.supabase.co`

### **Error: "Table doesn't exist"**
- Pastikan SQL schema sudah dijalankan
- Cek di Supabase Dashboard → Table Editor

### **Error: "Permission denied"**
- Cek RLS policies di Supabase
- Pastikan user memiliki akses yang tepat

## 📚 Referensi

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

Jika mengalami masalah:

1. **Cek Console Browser** - Lihat error messages
2. **Cek Supabase Dashboard** - Lihat logs dan status
3. **Buat Issue** di GitHub repository
4. **Hubungi Support** Supabase jika diperlukan

---

**Selamat! Database Supabase Anda sudah siap digunakan! 🎉**
