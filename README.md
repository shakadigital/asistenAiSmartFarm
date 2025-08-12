# Asisten AI Smartfarm

Aplikasi manajemen peternakan pintar dengan AI assistant yang membantu dalam:
- Manajemen farm dan kawanan
- Pencatatan harian produksi
- Analisis performa
- Manajemen inventori
- Manajemen tenaga kerja
- Konsultasi AI untuk optimasi peternakan

## 🚀 Quick Start

### Option 1: Dengan Mock Data (Cepat untuk Testing)
```bash
# Clone dan install
git clone <repository-url>
cd asisten-ai-smartfarm
npm install

# Setup Gemini API (opsional untuk AI features)
echo "GEMINI_API_KEY=your_gemini_api_key" > .env.local

# Run dengan mock data
npm run dev
```

### Option 2: Dengan Database Supabase (Production Ready)
```bash
# Install dependencies
npm install

# Setup database (ikuti SETUP_GUIDE.md)
npm run setup:check

# Migrate ke Supabase
npm run migrate:supabase

# Run aplikasi
npm run dev
```

## 📖 Dokumentasi Lengkap

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Panduan setup lengkap dengan Supabase
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Dokumentasi API dan services
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Setup khusus Supabase

## 🛠️ Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database Migration
npm run migrate:supabase # Switch to Supabase database
npm run migrate:mock     # Switch back to mock data
npm run setup:check      # Check environment setup
```

## 🎯 Fitur Utama

### 🏠 Dashboard
- Overview statistik farm
- Grafik produksi telur
- Monitoring kesehatan kawanan
- KPI performa

### 🚜 Manajemen Farm
- Tambah dan kelola multiple farm
- Tracking kawanan per farm
- Lokasi dan detail farm

### 📊 Laporan Harian
- Input data produksi telur
- Pencatatan mortalitas
- Konsumsi pakan
- Berat rata-rata
- Catatan medikasi

### 📦 Manajemen Inventori
- Tracking stok pakan, obat, dan supplies
- Transaksi masuk/keluar
- History dan audit trail
- Alert stok minimum

### 👥 Manajemen Tenaga Kerja
- Database karyawan
- Sistem absensi
- KPI produktivitas
- Tracking performa

### 🤖 AI Assistant
- Konsultasi berbasis data
- Rekomendasi optimasi
- Analisis tren
- Prediksi performa

## 🏗️ Teknologi

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Charts**: Recharts
- **AI**: Google Gemini API
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks

## 🔧 Environment Variables

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key

# Required for Supabase (production)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

## 📁 Project Structure

```
asisten-ai-smartfarm/
├── components/          # React components
├── hooks/              # Custom React hooks
│   ├── useSmartfarmData.ts    # Mock data hook
│   └── useSupabaseData.ts     # Supabase data hook
├── services/           # API services
├── supabase/          # Database schema & migrations
├── scripts/           # Migration scripts
├── lib/               # Utilities
└── types.ts           # TypeScript types
```

## 🔄 Switching Between Mock and Supabase

### To Supabase (Production)
```bash
npm run migrate:supabase
```

### Back to Mock Data (Development)
```bash
npm run migrate:mock
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo for auto-deploy
- **Netlify**: Drag & drop `dist` folder
- **Supabase**: Built-in hosting

### Environment Variables (Production)
Set these in your hosting platform:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

Jika mengalami masalah:
1. Cek [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk troubleshooting
2. Periksa console browser untuk error
3. Verifikasi environment variables
4. Test dengan mock data terlebih dahulu

---

**Happy Farming! 🐔🥚**
