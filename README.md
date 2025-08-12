# 🚀 Asisten AI SmartFarm

Aplikasi manajemen peternakan cerdas dengan integrasi AI untuk analisis data dan pengambilan keputusan.

## ✨ Fitur Utama

- 🏡 **Manajemen Farm** - CRUD untuk data peternakan
- 🐔 **Manajemen Flock** - Tracking kawanan ternak
- 👥 **Manajemen Workforce** - Pengelolaan tenaga kerja
- 📦 **Inventory Management** - Manajemen stok dan transaksi
- 🤖 **Smart AI Assistant** - Asisten AI menggunakan Google Gemini
- 📊 **Analisis & Laporan** - Dashboard chart dan laporan harian
- ⚙️ **Settings & Konfigurasi** - Pengaturan aplikasi

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **UI Components**: Custom components + Lucide React icons
- **AI Integration**: Google Gemini AI
- **Charts**: Recharts
- **Styling**: CSS Modules

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Installation
1. Clone repository:
   ```bash
   git clone https://github.com/shakadigital/asistenAiSmartFarm.git
   cd asistenAiSmartFarm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Buat file `.env.local` dengan isi:
   ```bash
   # Gemini AI API
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Supabase (untuk implementasi database nanti)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

5. Buka browser dan akses: `http://localhost:5173`

## 📁 Struktur Project

```
asisten-ai-smartfarm/
├── components/          # React components
│   ├── ui/             # UI components (Button, Card, Input, dll)
│   ├── Dashboard.tsx   # Dashboard utama
│   ├── SmartAssistant.tsx # AI Assistant
│   └── ...             # Komponen lainnya
├── hooks/               # Custom React hooks
├── services/            # External services (Gemini AI)
├── types/               # TypeScript type definitions
├── constants.tsx        # Konstanta aplikasi
└── App.tsx             # Root component
```

## 🔧 Scripts

- `npm run dev` - Development server
- `npm run build` - Build production
- `npm run preview` - Preview production build

## 📝 Status Development

- ✅ **Frontend UI** - Selesai
- ✅ **Component Structure** - Selesai
- ✅ **AI Integration** - Selesai (perlu API key)
- ⏳ **Database Integration** - Dalam pengembangan (Supabase)
- ⏳ **Authentication** - Belum diimplementasi
- ⏳ **Data Persistence** - Belum diimplementasi

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan MIT License.

## 🆘 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ untuk manajemen peternakan yang lebih cerdas**
