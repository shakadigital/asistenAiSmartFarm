import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          full_name: string;
          role: 'admin' | 'member';
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          full_name: string;
          role: 'admin' | 'member';
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          full_name?: string;
          role?: 'admin' | 'member';
          created_at?: string;
        };
      };
      farms: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          location: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          location: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          location?: string;
          created_at?: string;
        };
      };
      flocks: {
        Row: {
          id: string;
          farm_id: string;
          name_or_code: string;
          entry_date: string;
          initial_population: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name_or_code: string;
          entry_date: string;
          initial_population: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name_or_code?: string;
          entry_date?: string;
          initial_population?: number;
          created_at?: string;
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
          average_body_weight: number;
          feed_id: string | null;
          feed_consumption: number;
          medication_id: string | null;
          medication_dose: string | null;
          notes: string | null;
          created_at: string;
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
          average_body_weight: number;
          feed_id?: string | null;
          feed_consumption: number;
          medication_id?: string | null;
          medication_dose?: string | null;
          notes?: string | null;
          created_at?: string;
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
          average_body_weight?: number;
          feed_id?: string | null;
          feed_consumption?: number;
          medication_id?: string | null;
          medication_dose?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          name: string;
          type: 'Pakan' | 'Telur' | 'Obat' | 'Vaksin' | 'Vitamin';
          category: 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur';
          quantity: number;
          unit: 'kg' | 'butir' | 'dus' | 'botol' | 'saset' | 'tray';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'Pakan' | 'Telur' | 'Obat' | 'Vaksin' | 'Vitamin';
          category: 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur';
          quantity: number;
          unit: 'kg' | 'butir' | 'dus' | 'botol' | 'saset' | 'tray';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'Pakan' | 'Telur' | 'Obat' | 'Vaksin' | 'Vitamin';
          category?: 'Pakan' | 'Vaksin' | 'Medikasi' | 'Telur';
          quantity?: number;
          unit?: 'kg' | 'butir' | 'dus' | 'botol' | 'saset' | 'tray';
          created_at?: string;
        };
      };
      workforce_members: {
        Row: {
          id: string;
          name: string;
          role: 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
          contact: string;
          achievements: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
          contact: string;
          achievements?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'Manajer' | 'Pekerja Lapangan' | 'Dokter Hewan' | 'Admin';
          contact?: string;
          achievements?: number;
          created_at?: string;
        };
      };
      attendance_logs: {
        Row: {
          id: string;
          date: string;
          workforce_member_id: string;
          status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          workforce_member_id: string;
          status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          workforce_member_id?: string;
          status?: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};