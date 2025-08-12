
export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Profile {
  id: string;
  organizationId: string;
  fullName: string;
  role: 'admin' | 'member';
}

export interface Farm {
  id: string;
  organizationId: string;
  name: string;
  location: string;
}

export interface Flock {
  id: string;
  farmId: string;
  nameOrCode: string;
  entryDate: string;
  initialPopulation: number;
}

export interface DailyRecord {
  id:string;
  flockId: string;
  recordDate: string;
  mortality: number;
  cull: number;
  transferIn: number;
  transferOut: number;
  eggProduction: number;
  eggWeight: number; // in kg
  averageBodyWeight: number;
  feedId: string | null;
  feedConsumption: number;
  medicationId: string | null;
  medicationDose: string | null;
  notes: string | null;
}

export type InventoryItemType = 'Pakan' | 'Telur' | 'Obat' | 'Vaksin' | 'Vitamin';
export type InventorySummaryCategory = 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur';

export interface InventoryItem {
    id: string;
    name: string;
    type: InventoryItemType;
    category: InventorySummaryCategory;
    quantity: number;
    unit: 'kg' | 'butir' | 'dus' | 'botol' | 'saset' | 'tray';
}

// Log Types for Inventory Modal
export interface PakanLog {
    id: string;
    tanggal: string;
    kodePakan: string;
    masuk: number;
    keluar: number;
    stok: number;
    supplier: string;
    harga: number;
    note: string;
}

export interface VaksinLog {
    id: string;
    tanggal: string;
    namaBarang: string;
    masuk: number;
    keluar: number;
    stok: number;
    supplier: string;
    harga: number;
    note: string;
}

export interface MedikasiLog {
    id: string;
    tanggal: string;
    namaBarang: string;
    masuk: number;
    keluar: number;
    stok: number;
    supplier: string;
    harga: number;
    note: string;
}

export interface TelurLog {
    id: string;
    tanggal: string;
    masuk: number;
    flock: string;
    keluar: number;
    harga: number;
    customer: string;
    stok: number;
    note: string;
}

export type InventoryLogs = {
  pakan: PakanLog[];
  vaksin: VaksinLog[];
  medikasi: MedikasiLog[];
  telur: TelurLog[];
};

export type WorkforceRole = 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface WorkforceMember {
  id: string;
  name: string;
  role: WorkforceRole;
  contact: string; // phone or email
  achievements: number;
}

export interface AttendanceLog {
    id: string;
    date: string;
    workforceMemberId: string;
    status: AttendanceStatus;
    notes?: string;
}

export interface WorkforceKPIs {
    totalWorkforce: number;
    attendanceToday: number;
    totalAchievements: number;
    absentThisMonth: number;
}


export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum View {
    DASHBOARD = 'DASHBOARD',
    FARMS = 'FARMS',
    ADD_FARM = 'ADD_FARM',
    DAILY_REPORTS = 'DAILY_REPORTS',
    INVENTORY = 'INVENTORY',
    WORKFORCE = 'WORKFORCE',
    ANALYSIS = 'ANALYSIS',
    SETTINGS = 'SETTINGS',
}

export type InventoryTransactionType = 'Masuk' | 'Keluar';

export interface CombinedInventoryLog {
    id: string;
    tanggal: string;
    kategori: InventorySummaryCategory;
    namaBarang: string;
    tipe: InventoryTransactionType;
    jumlah: number;
    keterangan: string;
}
