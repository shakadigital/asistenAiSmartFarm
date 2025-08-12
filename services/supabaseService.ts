import { createClient } from '@supabase/supabase-js';

// Environment variables untuk Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL atau Anon Key tidak ditemukan. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diset di .env.local');
}

// Buat Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Types untuk database tables
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          full_name: string;
          role: 'admin' | 'manager' | 'worker';
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          full_name: string;
          role: 'admin' | 'manager' | 'worker';
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          full_name?: string;
          role?: 'admin' | 'manager' | 'worker';
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      farms: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          location: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      flocks: {
        Row: {
          id: string;
          farm_id: string;
          name_or_code: string;
          entry_date: string;
          initial_population: number;
          current_population: number;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name_or_code: string;
          entry_date: string;
          initial_population: number;
          current_population?: number;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name_or_code?: string;
          entry_date?: string;
          initial_population?: number;
          current_population?: number;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_records: {
        Row: {
          id: string;
          flock_id: string;
          record_date: string;
          mortality: number;
          cull: number;
          transfer_in: number;
          transfer_out: number;
          egg_production: number;
          egg_weight: number;
          feed_consumption: number;
          average_body_weight: number;
          feed_id: string | null;
          medication_id: string | null;
          medication_dose: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          flock_id: string;
          record_date: string;
          mortality: number;
          cull: number;
          transfer_in: number;
          transfer_out: number;
          egg_production: number;
          egg_weight: number;
          feed_consumption: number;
          average_body_weight: number;
          feed_id?: string | null;
          medication_id?: string | null;
          medication_dose?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          flock_id?: string;
          record_date?: string;
          mortality?: number;
          cull?: number;
          transfer_in?: number;
          transfer_out?: number;
          egg_production?: number;
          egg_weight?: number;
          feed_consumption?: number;
          average_body_weight?: number;
          feed_id?: string | null;
          medication_id?: string | null;
          medication_dose?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          type: 'Pakan' | 'Vaksin' | 'Vitamin' | 'Obat' | 'Telur' | 'Lainnya';
          category: 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur' | 'Lainnya';
          quantity: number;
          unit: string;
          min_stock: number;
          max_stock: number;
          price_per_unit: number;
          supplier: string | null;
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          type: 'Pakan' | 'Vaksin' | 'Vitamin' | 'Obat' | 'Telur' | 'Lainnya';
          category: 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur' | 'Lainnya';
          quantity: number;
          unit: string;
          min_stock?: number;
          max_stock?: number;
          price_per_unit?: number;
          supplier?: string | null;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          type?: 'Pakan' | 'Vaksin' | 'Vitamin' | 'Obat' | 'Telur' | 'Lainnya';
          category?: 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur' | 'Lainnya';
          quantity?: number;
          unit?: string;
          min_stock?: number;
          max_stock?: number;
          price_per_unit?: number;
          supplier?: string | null;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          inventory_item_id: string;
          organization_id: string;
          transaction_type: 'Masuk' | 'Keluar' | 'Adjustment';
          quantity: number;
          price_per_unit: number;
          total_amount: number;
          party: string; // Supplier atau Customer
          reference: string | null; // Invoice, PO, dll
          notes: string | null;
          transaction_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          inventory_item_id: string;
          organization_id: string;
          transaction_type: 'Masuk' | 'Keluar' | 'Adjustment';
          quantity: number;
          price_per_unit: number;
          total_amount: number;
          party: string;
          reference?: string | null;
          notes?: string | null;
          transaction_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          inventory_item_id?: string;
          organization_id?: string;
          transaction_type?: 'Masuk' | 'Keluar' | 'Adjustment';
          quantity?: number;
          price_per_unit?: number;
          total_amount?: number;
          party?: string;
          reference?: string | null;
          notes?: string | null;
          transaction_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workforce_members: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          role: 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
          contact: string;
          email: string | null;
          achievements: number;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          role: 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
          contact: string;
          email?: string | null;
          achievements?: number;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          role?: 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
          contact?: string;
          email?: string | null;
          achievements?: number;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance_logs: {
        Row: {
          id: string;
          workforce_member_id: string;
          organization_id: string;
          date: string;
          status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
          check_in: string | null;
          check_out: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workforce_member_id: string;
          organization_id: string;
          date: string;
          status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
          check_in?: string | null;
          check_out?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workforce_member_id?: string;
          organization_id?: string;
          date?: string;
          status?: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
          check_in?: string | null;
          check_out?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Export types
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Farm = Database['public']['Tables']['farms']['Row'];
export type Flock = Database['public']['Tables']['flocks']['Row'];
export type DailyRecord = Database['public']['Tables']['daily_records']['Row'];
export type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];
export type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row'];
export type WorkforceMember = Database['public']['Tables']['workforce_members']['Row'];
export type AttendanceLog = Database['public']['Tables']['attendance_logs']['Row'];
