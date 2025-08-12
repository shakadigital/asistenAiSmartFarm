import { supabase } from '../lib/supabase';
import type { 
  Organization, 
  Profile, 
  Farm, 
  Flock, 
  DailyRecord, 
  InventoryItem, 
  WorkforceMember, 
  AttendanceLog,
  InventoryTransactionType
} from '../types';

// Organization Services
export const organizationService = {
  async get(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? {
      id: data.id,
      name: data.name,
      logoUrl: data.logo_url
    } : null;
  },

  async update(id: string, name: string, logoUrl?: string): Promise<Organization> {
    const updateData: any = { name };
    if (logoUrl) updateData.logo_url = logoUrl;

    const { data, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      logoUrl: data.logo_url
    };
  }
};

// Profile Services
export const profileService = {
  async getByOrganization(organizationId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', organizationId)
      .single();
    
    if (error) throw error;
    return data ? {
      id: data.id,
      organizationId: data.organization_id,
      fullName: data.full_name,
      role: data.role
    } : null;
  }
};

// Farm Services
export const farmService = {
  async getByOrganization(organizationId: string): Promise<Farm[]> {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(farm => ({
      id: farm.id,
      organizationId: farm.organization_id,
      name: farm.name,
      location: farm.location
    }));
  },

  async create(organizationId: string, name: string, location: string): Promise<Farm> {
    const { data, error } = await supabase
      .from('farms')
      .insert({
        organization_id: organizationId,
        name,
        location
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      location: data.location
    };
  }
};

// Flock Services
export const flockService = {
  async getByFarm(farmId: string): Promise<Flock[]> {
    const { data, error } = await supabase
      .from('flocks')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(flock => ({
      id: flock.id,
      farmId: flock.farm_id,
      nameOrCode: flock.name_or_code,
      entryDate: flock.entry_date,
      initialPopulation: flock.initial_population
    }));
  },

  async getByOrganization(organizationId: string): Promise<Flock[]> {
    const { data, error } = await supabase
      .from('flocks')
      .select(`
        *,
        farms!inner(
          organization_id
        )
      `)
      .eq('farms.organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(flock => ({
      id: flock.id,
      farmId: flock.farm_id,
      nameOrCode: flock.name_or_code,
      entryDate: flock.entry_date,
      initialPopulation: flock.initial_population
    }));
  },

  async create(farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number): Promise<Flock> {
    const { data, error } = await supabase
      .from('flocks')
      .insert({
        farm_id: farmId,
        name_or_code: nameOrCode,
        entry_date: entryDate,
        initial_population: initialPopulation
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      farmId: data.farm_id,
      nameOrCode: data.name_or_code,
      entryDate: data.entry_date,
      initialPopulation: data.initial_population
    };
  }
};

// Daily Record Services
export const dailyRecordService = {
  async getByFlock(flockId: string): Promise<DailyRecord[]> {
    const { data, error } = await supabase
      .from('daily_records')
      .select('*')
      .eq('flock_id', flockId)
      .order('record_date', { ascending: false });
    
    if (error) throw error;
    return data.map(record => ({
      id: record.id,
      flockId: record.flock_id,
      recordDate: record.record_date,
      mortality: record.mortality,
      cull: record.cull,
      transferIn: record.transfer_in,
      transferOut: record.transfer_out,
      eggProduction: record.egg_production,
      eggWeight: record.egg_weight,
      averageBodyWeight: record.average_body_weight,
      feedId: record.feed_id,
      feedConsumption: record.feed_consumption,
      medicationId: record.medication_id,
      medicationDose: record.medication_dose,
      notes: record.notes
    }));
  },

  async getByOrganization(organizationId: string): Promise<DailyRecord[]> {
    const { data, error } = await supabase
      .from('daily_records')
      .select(`
        *,
        flocks!inner(
          farms!inner(
            organization_id
          )
        )
      `)
      .eq('flocks.farms.organization_id', organizationId)
      .order('record_date', { ascending: false });
    
    if (error) throw error;
    return data.map(record => ({
      id: record.id,
      flockId: record.flock_id,
      recordDate: record.record_date,
      mortality: record.mortality,
      cull: record.cull,
      transferIn: record.transfer_in,
      transferOut: record.transfer_out,
      eggProduction: record.egg_production,
      eggWeight: record.egg_weight,
      averageBodyWeight: record.average_body_weight,
      feedId: record.feed_id,
      feedConsumption: record.feed_consumption,
      medicationId: record.medication_id,
      medicationDose: record.medication_dose,
      notes: record.notes
    }));
  },

  async create(record: Omit<DailyRecord, 'id'>): Promise<DailyRecord> {
    const { data, error } = await supabase
      .from('daily_records')
      .insert({
        flock_id: record.flockId,
        record_date: record.recordDate,
        mortality: record.mortality,
        cull: record.cull,
        transfer_in: record.transferIn,
        transfer_out: record.transferOut,
        egg_production: record.eggProduction,
        egg_weight: record.eggWeight,
        average_body_weight: record.averageBodyWeight,
        feed_id: record.feedId,
        feed_consumption: record.feedConsumption,
        medication_id: record.medicationId,
        medication_dose: record.medicationDose,
        notes: record.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      flockId: data.flock_id,
      recordDate: data.record_date,
      mortality: data.mortality,
      cull: data.cull,
      transferIn: data.transfer_in,
      transferOut: data.transfer_out,
      eggProduction: data.egg_production,
      eggWeight: data.egg_weight,
      averageBodyWeight: data.average_body_weight,
      feedId: data.feed_id,
      feedConsumption: data.feed_consumption,
      medicationId: data.medication_id,
      medicationDose: data.medication_dose,
      notes: data.notes
    };
  }
};

// Inventory Services
export const inventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit
    }));
  },

  async addTransaction(
    itemId: string, 
    type: InventoryTransactionType, 
    quantity: number, 
    price: number, 
    party: string, 
    note: string
  ): Promise<void> {
    const { data: item, error: itemError } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('id', itemId)
      .single();
    
    if (itemError) throw itemError;

    const quantityChange = type === 'Masuk' ? quantity : -quantity;
    const newQuantity = item.quantity + quantityChange;

    if (newQuantity < 0) {
      throw new Error('Stok tidak mencukupi');
    }

    // Update inventory quantity
    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);
    
    if (updateError) throw updateError;

    // Add transaction log
    const { error: logError } = await supabase
      .from('inventory_transaction_logs')
      .insert({
        inventory_item_id: itemId,
        transaction_type: type,
        quantity,
        price,
        party,
        notes: note,
        transaction_date: new Date().toISOString().split('T')[0]
      });
    
    if (logError) throw logError;
  }
};

// Workforce Services
export const workforceService = {
  async getAll(): Promise<WorkforceMember[]> {
    const { data, error } = await supabase
      .from('workforce_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      contact: member.contact,
      achievements: member.achievements
    }));
  },

  async create(name: string, role: string, contact: string): Promise<WorkforceMember> {
    const { data, error } = await supabase
      .from('workforce_members')
      .insert({
        name,
        role,
        contact,
        achievements: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      contact: data.contact,
      achievements: data.achievements
    };
  }
};

// Attendance Services
export const attendanceService = {
  async getAll(): Promise<AttendanceLog[]> {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data.map(log => ({
      id: log.id,
      date: log.date,
      workforceMemberId: log.workforce_member_id,
      status: log.status,
      notes: log.notes
    }));
  },

  async addAttendance(
    records: { memberId: string, status: any, notes?: string }[], 
    date: string
  ): Promise<void> {
    const attendanceData = records.map(record => ({
      date,
      workforce_member_id: record.memberId,
      status: record.status,
      notes: record.notes
    }));

    const { error } = await supabase
      .from('attendance_logs')
      .upsert(attendanceData, {
        onConflict: 'date,workforce_member_id'
      });
    
    if (error) throw error;
  }
};