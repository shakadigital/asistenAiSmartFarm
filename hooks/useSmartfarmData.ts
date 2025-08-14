
import { useState, useEffect, useMemo } from 'react';
import type { Organization, Profile, Farm, Flock, DailyRecord, InventoryItem, WorkforceMember, WorkforceRole, PakanLog, VaksinLog, MedikasiLog, TelurLog, InventoryLogs, InventorySummaryCategory, InventoryTransactionType, CombinedInventoryLog, AttendanceLog, AttendanceStatus, WorkforceKPIs } from '../types';

// Mock data simulating a Supabase backend
const MOCK_ORGANIZATION: Organization = {
  id: 'org_123',
  name: 'Unggas GreenValley',
  logoUrl: 'https://picsum.photos/seed/greenvalley/200',
};

const MOCK_PROFILE: Profile = {
  id: 'user_456',
  organizationId: 'org_123',
  fullName: 'Jane Doe',
  role: 'admin',
};

const MOCK_FARMS: Farm[] = [
      { id: 'farm_01', organizationId: 'org_123', name: 'Lokasi Utama', location: 'Lembah Hijau' },
];

const MOCK_FLOCKS: Flock[] = [
          { id: 'flock_A', farmId: 'farm_01', nameOrCode: 'Farm A-101', entryDate: '2023-10-01', initialPopulation: 5000 },
        { id: 'flock_B', farmId: 'farm_01', nameOrCode: 'Farm B-202', entryDate: '2023-11-15', initialPopulation: 5200 },
];

const MOCK_DAILY_RECORDS: Omit<DailyRecord, 'id'>[] = [
    // Data for Flock A
    { flockId: 'flock_A', recordDate: '2024-05-20', mortality: 2, cull: 0, transferIn: 0, transferOut: 0, eggProduction: 4500, eggWeight: 270.5, feedConsumption: 550, averageBodyWeight: 1.8, feedId: 'inv_01', medicationId: null, medicationDose: null, notes: 'Cuaca cerah.' },
    { flockId: 'flock_A', recordDate: '2024-05-21', mortality: 3, cull: 0, transferIn: 0, transferOut: 0, eggProduction: 4450, eggWeight: 268.2, feedConsumption: 545, averageBodyWeight: 1.81, feedId: 'inv_01', medicationId: 'inv_03', medicationDose: '1 saset/100L', notes: '' },
    { flockId: 'flock_A', recordDate: '2024-05-22', mortality: 8, cull: 2, transferIn: 0, transferOut: 0, eggProduction: 4200, eggWeight: 255.1, feedConsumption: 530, averageBodyWeight: 1.79, feedId: 'inv_01', medicationId: 'inv_05', medicationDose: '5ml/50L', notes: 'Terdeteksi gejala pernapasan ringan.' },
    // Data for Flock B
    { flockId: 'flock_B', recordDate: '2024-05-20', mortality: 1, cull: 0, transferIn: 0, transferOut: 0, eggProduction: 4800, eggWeight: 295.8, feedConsumption: 580, averageBodyWeight: 1.85, feedId: 'inv_01', medicationId: null, medicationDose: null, notes: '' },
    { flockId: 'flock_B', recordDate: '2024-05-21', mortality: 2, cull: 0, transferIn: 0, transferOut: 0, eggProduction: 4820, eggWeight: 298.0, feedConsumption: 585, averageBodyWeight: 1.86, feedId: 'inv_01', medicationId: 'inv_03', medicationDose: '1 saset/100L', notes: '' },
    { flockId: 'flock_B', recordDate: '2024-05-22', mortality: 1, cull: 0, transferIn: 0, transferOut: 0, eggProduction: 4850, eggWeight: 299.5, feedConsumption: 582, averageBodyWeight: 1.87, feedId: 'inv_01', medicationId: null, medicationDose: null, notes: '' },
].map((record, index) => ({ ...record, id: `rec_${String(index).padStart(3, '0')}` }));


const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv_01', name: 'Pakan Jagung Super', type: 'Pakan', category: 'Pakan', quantity: 1500, unit: 'kg' },
    { id: 'inv_02', name: 'Vaksin ND-IB', type: 'Vaksin', category: 'Vaksin', quantity: 50, unit: 'botol' },
    { id: 'inv_03', name: 'Vitamin B-Complex', type: 'Vitamin', category: 'Medikasi', quantity: 20, unit: 'saset' },
    { id: 'inv_04', name: 'Telur Grade A', type: 'Telur', category: 'Telur', quantity: 350, unit: 'tray' },
    { id: 'inv_05', name: 'Antibiotik Pro', type: 'Obat', category: 'Medikasi', quantity: 15, unit: 'botol' },
];

const MOCK_WORKFORCE: WorkforceMember[] = [
    { id: 'wk_01', name: 'Budi Santoso', role: 'Manajer', contact: '081234567890', achievements: 5 },
    { id: 'wk_02', name: 'Siti Aminah', role: 'Pekerja Lapangan', contact: '081234567891', achievements: 12 },
    { id: 'wk_03', name: 'Dr. Retno Wulandari', role: 'Dokter Hewan', contact: 'dr.retno@smartfarm.com', achievements: 3 },
    { id: 'wk_04', name: 'Agus Setiawan', role: 'Pekerja Lapangan', contact: '081234567892', achievements: 8 },
];

const MOCK_ATTENDANCE_LOGS: AttendanceLog[] = [
    { id: 'att_1', date: '2024-05-22', workforceMemberId: 'wk_01', status: 'Hadir' },
    { id: 'att_2', date: '2024-05-22', workforceMemberId: 'wk_02', status: 'Hadir' },
    { id: 'att_3', date: '2024-05-22', workforceMemberId: 'wk_03', status: 'Sakit', notes: 'Demam' },
    { id: 'att_4', date: '2024-05-22', workforceMemberId: 'wk_04', status: 'Hadir' },
    { id: 'att_5', date: '2024-05-21', workforceMemberId: 'wk_01', status: 'Hadir' },
    { id: 'att_6', date: '2024-05-21', workforceMemberId: 'wk_02', status: 'Izin', notes: 'Acara keluarga' },
    { id: 'att_7', date: '2024-05-21', workforceMemberId: 'wk_03', status: 'Hadir' },
    { id: 'att_8', date: '2024-05-21', workforceMemberId: 'wk_04', status: 'Alpa' },
];

const MOCK_PAKAN_LOGS: PakanLog[] = [
    { id: 'pl_1', tanggal: '2024-05-18', kodePakan: 'Pakan Jagung Super', masuk: 2000, keluar: 0, stok: 2000, supplier: 'CV Pakan Sejahtera', harga: 8500, note: 'Penerimaan stok bulanan' },
    { id: 'pl_2', tanggal: '2024-05-20', kodePakan: 'Pakan Jagung Super', masuk: 0, keluar: 550, stok: 1450, supplier: '-', harga: 0, note: 'Pemakaian harian Farm A' },
    { id: 'pl_3', tanggal: '2024-05-21', kodePakan: 'Pakan Jagung Super', masuk: 0, keluar: 580, stok: 870, supplier: '-', harga: 0, note: 'Pemakaian harian Farm B' },
];

const MOCK_VAKSIN_LOGS: VaksinLog[] = [
    { id: 'vl_1', tanggal: '2024-05-01', namaBarang: 'Vaksin ND-IB', masuk: 100, keluar: 0, stok: 100, supplier: 'Medika Farma', harga: 25000, note: 'Stok awal bulan' },
    { id: 'vl_2', tanggal: '2024-05-15', namaBarang: 'Vaksin ND-IB', masuk: 0, keluar: 50, stok: 50, supplier: '-', harga: 0, note: 'Vaksinasi rutin' },
];

const MOCK_MEDIKASI_LOGS: MedikasiLog[] = [
    { id: 'ml_1', tanggal: '2024-05-01', namaBarang: 'Vitamin B-Complex', masuk: 50, keluar: 0, stok: 50, supplier: 'Medika Farma', harga: 15000, note: 'Stok vitamin' },
    { id: 'ml_2', tanggal: '2024-05-21', namaBarang: 'Vitamin B-Complex', masuk: 0, keluar: 30, stok: 20, supplier: '-', harga: 0, note: 'Pemakaian rutin' },
    { id: 'ml_3', tanggal: '2024-05-10', namaBarang: 'Antibiotik Pro', masuk: 20, keluar: 0, stok: 20, supplier: 'Kimia Med', harga: 45000, note: 'Stok obat' },
    { id: 'ml_4', tanggal: '2024-05-22', namaBarang: 'Antibiotik Pro', masuk: 0, keluar: 5, stok: 15, supplier: '-', harga: 0, note: 'Pengobatan farm A' },
];

const MOCK_TELUR_LOGS: TelurLog[] = [
    { id: 'tl_1', tanggal: '2024-05-20', masuk: 4500, flock: 'Farm A-101', keluar: 4000, harga: 2000, customer: 'Distributor Telur Jaya', stok: 500, note: 'Grade A' },
    { id: 'tl_2', tanggal: '2024-05-21', masuk: 4450, flock: 'Farm A-101', keluar: 0, stok: 4950, harga: 0, customer: '-', note: 'Disimpan di gudang' },
    { id: 'tl_3', tanggal: '2024-05-22', masuk: 4200, flock: 'Farm A-101', keluar: 8500, harga: 2100, customer: 'Supermarket Segar', stok: 650, note: 'Pengiriman besar' },
];

export const useSmartfarmData = () => {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization>(MOCK_ORGANIZATION);
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE);
  const [farms, setFarms] = useState<Farm[]>(MOCK_FARMS);
  const [flocks, setFlocks] = useState<Flock[]>(MOCK_FLOCKS);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(MOCK_DAILY_RECORDS as DailyRecord[]);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [workforce, setWorkforce] = useState<WorkforceMember[]>(MOCK_WORKFORCE);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(MOCK_ATTENDANCE_LOGS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogs>({
      pakan: MOCK_PAKAN_LOGS,
      vaksin: MOCK_VAKSIN_LOGS,
      medikasi: MOCK_MEDIKASI_LOGS,
      telur: MOCK_TELUR_LOGS
  });

  const combinedInventoryLogs = useMemo<CombinedInventoryLog[]>(() => {
    const combined = [
        ...inventoryLogs.pakan.map(log => ({ id: log.id, tanggal: log.tanggal, kategori: 'Pakan' as const, namaBarang: log.kodePakan, tipe: log.masuk > 0 ? 'Masuk' as const : 'Keluar' as const, jumlah: log.masuk > 0 ? log.masuk : log.keluar, keterangan: log.supplier !== '-' ? `Supplier: ${log.supplier}` : log.note })),
        ...inventoryLogs.vaksin.map(log => ({ id: log.id, tanggal: log.tanggal, kategori: 'Vaksin' as const, namaBarang: log.namaBarang, tipe: log.masuk > 0 ? 'Masuk' as const : 'Keluar' as const, jumlah: log.masuk > 0 ? log.masuk : log.keluar, keterangan: log.supplier !== '-' ? `Supplier: ${log.supplier}` : log.note })),
        ...inventoryLogs.medikasi.map(log => ({ id: log.id, tanggal: log.tanggal, kategori: 'Medikasi' as const, namaBarang: log.namaBarang, tipe: log.masuk > 0 ? 'Masuk' as const : 'Keluar' as const, jumlah: log.masuk > 0 ? log.masuk : log.keluar, keterangan: log.supplier !== '-' ? `Supplier: ${log.supplier}` : log.note })),
        ...inventoryLogs.telur.map(log => ({ id: log.id, tanggal: log.tanggal, kategori: 'Telur' as const, namaBarang: `Telur dari ${log.flock}`, tipe: log.masuk > 0 ? 'Masuk' as const : 'Keluar' as const, jumlah: log.masuk > 0 ? log.masuk : log.keluar, keterangan: log.customer !== '-' ? `Customer: ${log.customer}` : log.note })),
    ];
    return combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [inventoryLogs]);
  
  const workforceKPIs = useMemo<WorkforceKPIs>(() => {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const attendanceToday = attendanceLogs.filter(log => log.date === today && log.status === 'Hadir').length;
      const totalAchievements = workforce.reduce((sum, member) => sum + member.achievements, 0);
      const absentThisMonth = attendanceLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear && log.status === 'Alpa';
      }).length;

      return {
          totalWorkforce: workforce.length,
          attendanceToday,
          totalAchievements,
          absentThisMonth,
      };
  }, [workforce, attendanceLogs]);


  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const updateOrganization = async (name: string, newLogoFile?: File): Promise<Organization> => {
    setLoading(true);
    console.log('Mensimulasikan pembaruan untuk organisasi...');
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1000));
    
    let newLogoUrl = organization.logoUrl;
    if (newLogoFile) {
      // In a real app, this would upload to Supabase Storage and return a URL
      newLogoUrl = URL.createObjectURL(newLogoFile);
      console.log('Mensimulasikan unggah logo. URL sementara baru:', newLogoUrl);
    }

    const updatedOrg = { ...organization, name, logoUrl: newLogoUrl };
    setOrganization(updatedOrg);
    setLoading(false);
    console.log('Simulasi pembaruan selesai.');
    return updatedOrg;
  };

  const addFarm = async (name: string, location: string): Promise<Farm> => {
    setLoading(true);
    console.log('Mensimulasikan penambahan lokasi baru...');
    await new Promise(res => setTimeout(res, 1000));

    const newFarm: Farm = {
        id: `farm_${Date.now()}`,
        organizationId: organization.id,
        name,
        location,
    };

    setFarms(prevFarms => [...prevFarms, newFarm]);
    setLoading(false);
    console.log('Simulasi penambahan lokasi selesai.', newFarm);
    return newFarm;
  };

  const addFlock = async (farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number): Promise<Flock> => {
    setLoading(true);
    console.log(`Mensimulasikan penambahan farm baru ke lokasi ${farmId}...`);
    await new Promise(res => setTimeout(res, 1000));

    const newFlock: Flock = {
        id: `flock_${Date.now()}`,
        farmId,
        nameOrCode,
        entryDate,
        initialPopulation: Number(initialPopulation),
    };

    setFlocks(prevFlocks => [...prevFlocks, newFlock]);
    setLoading(false);
    console.log('Simulasi penambahan farm selesai.', newFlock);
    return newFlock;
  };

  const addWorkforceMember = async (name: string, role: WorkforceRole, contact: string): Promise<WorkforceMember> => {
    setLoading(true);
    console.log('Mensimulasikan penambahan tenaga kerja baru...');
    await new Promise(res => setTimeout(res, 1000));

    const newMember: WorkforceMember = {
        id: `wk_${Date.now()}`,
        name,
        role,
        contact,
        achievements: 0,
    };

    setWorkforce(prev => [...prev, newMember]);
    setLoading(false);
    console.log('Simulasi penambahan tenaga kerja selesai.', newMember);
    return newMember;
  };
  
  const addDailyRecord = async (record: Omit<DailyRecord, 'id'>): Promise<DailyRecord> => {
    setLoading(true);
    console.log('Mensimulasikan penambahan laporan harian baru...');
    await new Promise(res => setTimeout(res, 1000));
    
    const newRecord: DailyRecord = {
      ...record,
      id: `rec_${Date.now()}`
    };
    
    setDailyRecords(prev => [...prev, newRecord].sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()));
    setLoading(false);
    console.log('Simulasi penambahan laporan harian selesai.', newRecord);
    return newRecord;
  };

  const addInventoryTransaction = async (
    itemId: string,
    type: InventoryTransactionType,
    quantity: number,
    price: number,
    party: string, // Supplier or Customer
    note: string
  ): Promise<void> => {
    setLoading(true);
    console.log('Mensimulasikan penambahan transaksi inventori...');
    await new Promise(res => setTimeout(res, 1000));

    const item = inventory.find(i => i.id === itemId);
    if (!item) {
      console.error('Item inventori tidak ditemukan!');
      setLoading(false);
      return;
    }

    const newLogs = { ...inventoryLogs };
    const newDate = new Date().toISOString().split('T')[0];
    let newStok = 0;

    // Update Logs
    const logId = `log_${Date.now()}`;
    const masuk = type === 'Masuk' ? quantity : 0;
    const keluar = type === 'Keluar' ? quantity : 0;

    const updatedInventory = inventory.map(i => {
      if (i.id === itemId) {
        const newQuantity = type === 'Masuk' ? i.quantity + quantity : i.quantity - quantity;
        newStok = newQuantity;
        return { ...i, quantity: newQuantity };
      }
      return i;
    });

    switch(item.category) {
      case 'Pakan':
        newLogs.pakan.push({ id: logId, tanggal: newDate, kodePakan: item.name, masuk, keluar, stok: newStok, supplier: party, harga: price, note });
        break;
      case 'Vaksin':
        newLogs.vaksin.push({ id: logId, tanggal: newDate, namaBarang: item.name, masuk, keluar, stok: newStok, supplier: party, harga: price, note });
        break;
      case 'Medikasi':
        newLogs.medikasi.push({ id: logId, tanggal: newDate, namaBarang: item.name, masuk, keluar, stok: newStok, supplier: party, harga: price, note });
        break;
      case 'Telur':
        newLogs.telur.push({ id: logId, tanggal: newDate, flock: 'N/A', masuk, keluar, harga: price, customer: party, stok: newStok, note });
        break;
    }
    
    setInventoryLogs(newLogs);
    setInventory(updatedInventory);

    setLoading(false);
    console.log('Simulasi transaksi inventori selesai.');
  };

  const addAttendance = async (records: { memberId: string, status: AttendanceStatus, notes?: string }[], date: string): Promise<void> => {
     setLoading(true);
     console.log(`Mensimulasikan penambahan log absensi untuk tanggal: ${date}...`);
     await new Promise(res => setTimeout(res, 1000));

     const newAttendanceLogs = records.map(rec => ({
         id: `att_${Date.now()}_${rec.memberId}`,
         date: date,
         workforceMemberId: rec.memberId,
         status: rec.status,
         notes: rec.notes || '',
     }));
     
     // Remove any existing logs for the same members on the same day to prevent duplicates
     const otherDayLogs = attendanceLogs.filter(log => log.date !== date);
     
     setAttendanceLogs([...otherDayLogs, ...newAttendanceLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
     
     setLoading(false);
     console.log('Simulasi penambahan log absensi selesai.');
  };

  return { loading, organization, profile, farms, flocks, dailyRecords, inventory, workforce, workforceKPIs, attendanceLogs, inventoryLogs, combinedInventoryLogs, updateOrganization, addFarm, addFlock, addWorkforceMember, addDailyRecord, addInventoryTransaction, addAttendance };
};
