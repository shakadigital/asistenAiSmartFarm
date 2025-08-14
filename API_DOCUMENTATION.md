# API Documentation - Supabase Services

Dokumentasi ini menjelaskan semua service dan fungsi yang tersedia untuk berinteraksi dengan database Supabase.

## Setup

```typescript
import { supabase } from '../lib/supabase';
import { 
  organizationService,
  profileService,
  farmService,
  flockService,
  dailyRecordService,
  inventoryService,
  workforceService,
  attendanceService
} from '../services/supabaseService';
```

## Organization Service

### `organizationService.get(id: string)`
Mengambil data organisasi berdasarkan ID.

**Parameters:**
- `id` (string): ID organisasi

**Returns:** `Promise<Organization | null>`

**Example:**
```typescript
const org = await organizationService.get('550e8400-e29b-41d4-a716-446655440000');
```

### `organizationService.update(id: string, name: string, logoUrl?: string)`
Memperbarui data organisasi.

**Parameters:**
- `id` (string): ID organisasi
- `name` (string): Nama organisasi baru
- `logoUrl` (string, optional): URL logo baru

**Returns:** `Promise<Organization>`

**Example:**
```typescript
const updatedOrg = await organizationService.update(
  '550e8400-e29b-41d4-a716-446655440000',
  'PT. Lokasi Baru',
  'https://example.com/logo.png'
);
```

## Profile Service

### `profileService.getByOrganization(organizationId: string)`
Mengambil profil berdasarkan ID organisasi.

**Parameters:**
- `organizationId` (string): ID organisasi

**Returns:** `Promise<Profile | null>`

**Example:**
```typescript
const profile = await profileService.getByOrganization('550e8400-e29b-41d4-a716-446655440000');
```

## Farm Service

### `farmService.getByOrganization(organizationId: string)`
Mengambil semua farm dalam organisasi.

**Parameters:**
- `organizationId` (string): ID organisasi

**Returns:** `Promise<Farm[]>`

**Example:**
```typescript
const farms = await farmService.getByOrganization('550e8400-e29b-41d4-a716-446655440000');
```

### `farmService.create(organizationId: string, name: string, location: string)`
Membuat farm baru.

**Parameters:**
- `organizationId` (string): ID organisasi
- `name` (string): Nama farm
- `location` (string): Lokasi farm

**Returns:** `Promise<Farm>`

**Example:**
```typescript
const newFarm = await farmService.create(
  '550e8400-e29b-41d4-a716-446655440000',
  'Farm Baru',
  'Jakarta, Indonesia'
);
```

## Flock Service

### `flockService.getByFarm(farmId: string)`
Mengambil semua flock dalam farm.

**Parameters:**
- `farmId` (string): ID farm

**Returns:** `Promise<Flock[]>`

### `flockService.getByOrganization(organizationId: string)`
Mengambil semua flock dalam organisasi.

**Parameters:**
- `organizationId` (string): ID organisasi

**Returns:** `Promise<Flock[]>`

### `flockService.create(farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number)`
Membuat flock baru.

**Parameters:**
- `farmId` (string): ID farm
- `nameOrCode` (string): Nama atau kode flock
- `entryDate` (string): Tanggal masuk (YYYY-MM-DD)
- `initialPopulation` (number): Populasi awal

**Returns:** `Promise<Flock>`

**Example:**
```typescript
const newFlock = await flockService.create(
  '550e8400-e29b-41d4-a716-446655440002',
  'Farm C-301',
  '2024-06-01',
  5000
);
```

## Daily Record Service

### `dailyRecordService.getByFlock(flockId: string)`
Mengambil semua catatan harian untuk flock tertentu.

**Parameters:**
- `flockId` (string): ID flock

**Returns:** `Promise<DailyRecord[]>`

### `dailyRecordService.getByOrganization(organizationId: string)`
Mengambil semua catatan harian dalam organisasi.

**Parameters:**
- `organizationId` (string): ID organisasi

**Returns:** `Promise<DailyRecord[]>`

### `dailyRecordService.create(record: Omit<DailyRecord, 'id'>)`
Membuat catatan harian baru.

**Parameters:**
- `record` (DailyRecord): Data catatan harian (tanpa ID)

**Returns:** `Promise<DailyRecord>`

**Example:**
```typescript
const newRecord = await dailyRecordService.create({
  flockId: '550e8400-e29b-41d4-a716-446655440004',
  recordDate: '2024-06-01',
  mortality: 3,
  cull: 1,
  transferIn: 0,
  transferOut: 0,
  eggProduction: 4500,
  eggWeight: 58.5,
  averageBodyWeight: 1850,
  feedId: null,
  feedConsumption: 320.5,
  medicationId: null,
  medicationDose: null,
  notes: 'Kondisi normal'
});
```

## Inventory Service

### `inventoryService.getAll()`
Mengambil semua item inventori.

**Returns:** `Promise<InventoryItem[]>`

### `inventoryService.addTransaction(itemId, type, quantity, price, party, note)`
Menambah transaksi inventori.

**Parameters:**
- `itemId` (string): ID item inventori
- `type` (InventoryTransactionType): 'Masuk' atau 'Keluar'
- `quantity` (number): Jumlah
- `price` (number): Harga
- `party` (string): Supplier atau customer
- `note` (string): Catatan

**Returns:** `Promise<void>`

**Example:**
```typescript
await inventoryService.addTransaction(
  '550e8400-e29b-41d4-a716-446655440007',
  'Masuk',
  1000,
  8500000,
  'PT. Pakan Jaya',
  'Pembelian rutin'
);
```

## Workforce Service

### `workforceService.getAll()`
Mengambil semua anggota tim.

**Returns:** `Promise<WorkforceMember[]>`

### `workforceService.create(name: string, role: string, contact: string)`
Membuat anggota tim baru.

**Parameters:**
- `name` (string): Nama anggota
- `role` (string): Peran/jabatan
- `contact` (string): Kontak

**Returns:** `Promise<WorkforceMember>`

**Example:**
```typescript
const newMember = await workforceService.create(
  'John Doe',
  'Pekerja Lapangan',
  '081234567890'
);
```

## Attendance Service

### `attendanceService.getAll()`
Mengambil semua log absensi.

**Returns:** `Promise<AttendanceLog[]>`

### `attendanceService.addAttendance(records, date)`
Menambah catatan absensi.

**Parameters:**
- `records` (Array): Array objek dengan `memberId`, `status`, dan `notes` opsional
- `date` (string): Tanggal absensi (YYYY-MM-DD)

**Returns:** `Promise<void>`

**Example:**
```typescript
await attendanceService.addAttendance([
  {
    memberId: '550e8400-e29b-41d4-a716-446655440016',
    status: 'Hadir',
    notes: 'Tepat waktu'
  },
  {
    memberId: '550e8400-e29b-41d4-a716-446655440017',
    status: 'Sakit',
    notes: 'Demam'
  }
], '2024-06-01');
```

## Error Handling

Semua service function dapat melempar error. Pastikan untuk menggunakan try-catch:

```typescript
try {
  const farms = await farmService.getByOrganization(orgId);
  // Handle success
} catch (error) {
  console.error('Error loading farms:', error);
  // Handle error
}
```

## Common Error Types

1. **Network Error**: Koneksi ke Supabase gagal
2. **Authentication Error**: Kredensial tidak valid
3. **Permission Error**: Tidak memiliki akses ke resource
4. **Validation Error**: Data tidak sesuai constraint database
5. **Not Found Error**: Resource tidak ditemukan

## Best Practices

1. **Always handle errors**: Gunakan try-catch untuk semua operasi database
2. **Use loading states**: Tampilkan loading indicator saat operasi berlangsung
3. **Validate input**: Validasi data sebelum mengirim ke database
4. **Use transactions**: Untuk operasi yang melibatkan multiple tables
5. **Cache data**: Gunakan state management untuk menghindari fetch berulang

## Database Schema Reference

### Tables
- `organizations`: Data organisasi
- `profiles`: Profil pengguna
- `farms`: Data lokasi
- `flocks`: Data farm
- `daily_records`: Catatan harian
- `inventory_items`: Item inventori
- `workforce_members`: Anggota tim
- `attendance_logs`: Log absensi
- `inventory_transaction_logs`: Log transaksi inventori

### Relationships
- Organization → Profiles (1:N)
- Organization → Farms (1:N)
- Farm → Flocks (1:N)
- Flock → Daily Records (1:N)
- Workforce Member → Attendance Logs (1:N)
- Inventory Item → Transaction Logs (1:N)

## Environment Variables

Pastikan variabel berikut sudah diset di `.env.local`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```