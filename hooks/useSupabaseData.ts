import { useState, useEffect, useMemo } from 'react';
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
import type {
  Organization,
  Profile,
  Farm,
  Flock,
  DailyRecord,
  InventoryItem,
  WorkforceMember,
  AttendanceLog,
  WorkforceKPIs,
  InventoryTransactionType,
  WorkforceRole,
  AttendanceStatus
} from '../types';

// Default organization ID - in a real app, this would come from authentication
const DEFAULT_ORG_ID = '550e8400-e29b-41d4-a716-446655440000';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [workforce, setWorkforce] = useState<WorkforceMember[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load organization and profile
      const [orgData, profileData] = await Promise.all([
        organizationService.get(DEFAULT_ORG_ID),
        profileService.getByOrganization(DEFAULT_ORG_ID)
      ]);

      if (orgData) setOrganization(orgData);
      if (profileData) setProfile(profileData);

      // Load farms and related data
      const [farmsData, flocksData, dailyRecordsData] = await Promise.all([
        farmService.getByOrganization(DEFAULT_ORG_ID),
        flockService.getByOrganization(DEFAULT_ORG_ID),
        dailyRecordService.getByOrganization(DEFAULT_ORG_ID)
      ]);

      setFarms(farmsData);
      setFlocks(flocksData);
      setDailyRecords(dailyRecordsData);

      // Load inventory and workforce data
      const [inventoryData, workforceData, attendanceData] = await Promise.all([
        inventoryService.getAll(),
        workforceService.getAll(),
        attendanceService.getAll()
      ]);

      setInventory(inventoryData);
      setWorkforce(workforceData);
      setAttendanceLogs(attendanceData);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const workforceKPIs = useMemo<WorkforceKPIs>(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const attendanceToday = attendanceLogs.filter(
      log => log.date === today && log.status === 'Hadir'
    ).length;
    
    const totalAchievements = workforce.reduce(
      (sum, member) => sum + member.achievements, 0
    );
    
    const absentThisMonth = attendanceLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === currentMonth && 
             logDate.getFullYear() === currentYear && 
             log.status === 'Alpa';
    }).length;

    return {
      totalWorkforce: workforce.length,
      attendanceToday,
      totalAchievements,
      absentThisMonth
    };
  }, [workforce, attendanceLogs]);

  // Organization functions
  const updateOrganization = async (name: string, newLogoFile?: File): Promise<Organization> => {
    if (!organization) throw new Error('No organization found');
    
    setLoading(true);
    try {
      let newLogoUrl = organization.logoUrl;
      if (newLogoFile) {
        // In a real app, upload to Supabase Storage
        newLogoUrl = URL.createObjectURL(newLogoFile);
      }

      const updatedOrg = await organizationService.update(organization.id, name, newLogoUrl);
      setOrganization(updatedOrg);
      return updatedOrg;
    } catch (err) {
      console.error('Error updating organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Farm functions
  const addFarm = async (name: string, location: string): Promise<Farm> => {
    setLoading(true);
    try {
      const newFarm = await farmService.create(DEFAULT_ORG_ID, name, location);
      setFarms(prev => [newFarm, ...prev]);
      return newFarm;
    } catch (err) {
      console.error('Error adding farm:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Flock functions
  const addFlock = async (
    farmId: string, 
    nameOrCode: string, 
    entryDate: string, 
    initialPopulation: number
  ): Promise<Flock> => {
    setLoading(true);
    try {
      const newFlock = await flockService.create(farmId, nameOrCode, entryDate, initialPopulation);
      setFlocks(prev => [newFlock, ...prev]);
      return newFlock;
    } catch (err) {
      console.error('Error adding flock:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Daily record functions
  const addDailyRecord = async (record: Omit<DailyRecord, 'id'>): Promise<DailyRecord> => {
    setLoading(true);
    try {
      const newRecord = await dailyRecordService.create(record);
      setDailyRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      console.error('Error adding daily record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Inventory functions
  const addInventoryTransaction = async (
    itemId: string,
    type: InventoryTransactionType,
    quantity: number,
    price: number,
    party: string,
    note: string
  ): Promise<void> => {
    setLoading(true);
    try {
      await inventoryService.addTransaction(itemId, type, quantity, price, party, note);
      // Reload inventory to get updated quantities
      const updatedInventory = await inventoryService.getAll();
      setInventory(updatedInventory);
    } catch (err) {
      console.error('Error adding inventory transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Workforce functions
  const addWorkforceMember = async (
    name: string, 
    role: WorkforceRole, 
    contact: string
  ): Promise<WorkforceMember> => {
    setLoading(true);
    try {
      const newMember = await workforceService.create(name, role, contact);
      setWorkforce(prev => [newMember, ...prev]);
      return newMember;
    } catch (err) {
      console.error('Error adding workforce member:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Attendance functions
  const addAttendance = async (
    records: { memberId: string, status: AttendanceStatus, notes?: string }[], 
    date: string
  ): Promise<void> => {
    setLoading(true);
    try {
      await attendanceService.addAttendance(records, date);
      // Reload attendance logs
      const updatedLogs = await attendanceService.getAll();
      setAttendanceLogs(updatedLogs);
    } catch (err) {
      console.error('Error adding attendance:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    loading,
    error,
    organization,
    profile,
    farms,
    flocks,
    dailyRecords,
    inventory,
    workforce,
    attendanceLogs,
    workforceKPIs,

    // Functions
    loadData,
    updateOrganization,
    addFarm,
    addFlock,
    addDailyRecord,
    addInventoryTransaction,
    addWorkforceMember,
    addAttendance
  };
};