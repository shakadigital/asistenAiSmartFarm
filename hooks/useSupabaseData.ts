import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';
import type { 
  Organization, 
  Profile, 
  Farm, 
  Flock, 
  DailyRecord, 
  InventoryItem, 
  InventoryTransaction, 
  WorkforceMember, 
  AttendanceLog 
} from '../services/supabaseService';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk data
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [workforceMembers, setWorkforceMembers] = useState<WorkforceMember[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);

  // Check koneksi Supabase
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('organizations').select('count').limit(1);
      if (error) {
        console.error('Error checking Supabase connection:', error);
        setError('Tidak dapat terhubung ke database');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase connection error:', err);
      setError('Tidak dapat terhubung ke database');
      return false;
    }
  };

  // Load data awal
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check koneksi terlebih dahulu
      const isConnected = await checkConnection();
      if (!isConnected) return;

      // Load organization (gunakan sample data untuk sementara)
      const sampleOrg: Organization = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Unggas GreenValley',
        logo_url: 'https://picsum.photos/seed/greenvalley/200',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setOrganization(sampleOrg);

      // Load farms
      const { data: farmsData, error: farmsError } = await supabase
        .from('farms')
        .select('*')
        .eq('organization_id', sampleOrg.id);

      if (farmsError) {
        console.error('Error loading farms:', farmsError);
      } else {
        setFarms(farmsData || []);
      }

      // Load flocks
      const { data: flocksData, error: flocksError } = await supabase
        .from('flocks')
        .select('*')
        .eq('organization_id', sampleOrg.id);

      if (flocksError) {
        console.error('Error loading flocks:', flocksError);
      } else {
        setFlocks(flocksData || []);
      }

      // Load inventory items
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('organization_id', sampleOrg.id);

      if (inventoryError) {
        console.error('Error loading inventory:', inventoryError);
      } else {
        setInventoryItems(inventoryData || []);
      }

      // Load workforce members
      const { data: workforceData, error: workforceError } = await supabase
        .from('workforce_members')
        .select('*')
        .eq('organization_id', sampleOrg.id);

      if (workforceError) {
        console.error('Error loading workforce:', workforceError);
      } else {
        setWorkforceMembers(workforceData || []);
      }

    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations untuk Farms
  const addFarm = async (name: string, location: string): Promise<Farm | null> => {
    if (!organization) return null;

    try {
      const { data, error } = await supabase
        .from('farms')
        .insert({
          organization_id: organization.id,
          name,
          location
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding farm:', error);
        throw error;
      }

      setFarms(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding farm:', err);
      throw err;
    }
  };

  // CRUD Operations untuk Flocks
  const addFlock = async (farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number): Promise<Flock | null> => {
    if (!organization) return null;

    try {
      const { data, error } = await supabase
        .from('flocks')
        .insert({
          farm_id: farmId,
          name_or_code: nameOrCode,
          entry_date: entryDate,
          initial_population: initialPopulation,
          current_population: initialPopulation
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding flock:', error);
        throw error;
      }

      setFlocks(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding flock:', err);
      throw err;
    }
  };

  // CRUD Operations untuk Daily Records
  const addDailyRecord = async (record: Omit<DailyRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DailyRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('daily_records')
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error('Error adding daily record:', error);
        throw error;
      }

      setDailyRecords(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding daily record:', err);
      throw err;
    }
  };

  // CRUD Operations untuk Inventory Items
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem | null> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert(item)
        .select()
        .single();

      if (error) {
        console.error('Error adding inventory item:', error);
        throw error;
      }

      setInventoryItems(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding inventory item:', err);
      throw err;
    }
  };

  // CRUD Operations untuk Workforce Members
  const addWorkforceMember = async (member: Omit<WorkforceMember, 'id' | 'created_at' | 'updated_at'>): Promise<WorkforceMember | null> => {
    try {
      const { data, error } = await supabase
        .from('workforce_members')
        .insert(member)
        .select()
        .single();

      if (error) {
        console.error('Error adding workforce member:', error);
        throw error;
      }

      setWorkforceMembers(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding workforce member:', err);
      throw err;
    }
  };

  // CRUD Operations untuk Attendance Logs
  const addAttendanceLog = async (log: Omit<AttendanceLog, 'id' | 'created_at' | 'updated_at'>): Promise<AttendanceLog | null> => {
    try {
      const { data, error } = await supabase
        .from('attendance_logs')
        .insert(log)
        .select()
        .single();

      if (error) {
        console.error('Error adding attendance log:', error);
        throw error;
      }

      setAttendanceLogs(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding attendance log:', err);
      throw err;
    }
  };

  // Load data saat component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    // State
    loading,
    error,
    organization,
    profile,
    farms,
    flocks,
    dailyRecords,
    inventoryItems,
    inventoryTransactions,
    workforceMembers,
    attendanceLogs,

    // Actions
    checkConnection,
    loadInitialData,
    addFarm,
    addFlock,
    addDailyRecord,
    addInventoryItem,
    addWorkforceMember,
    addAttendanceLog,

    // Refresh data
    refreshData: loadInitialData
  };
};
