-- Migration: 001_initial_schema
-- Description: Create initial database schema for Asisten AI Smartfarm
-- Created: 2024-01-01

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'member')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flocks table
CREATE TABLE IF NOT EXISTS flocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name_or_code VARCHAR(255) NOT NULL,
  entry_date DATE NOT NULL,
  initial_population INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily records table
CREATE TABLE IF NOT EXISTS daily_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  flock_id UUID REFERENCES flocks(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  mortality INTEGER DEFAULT 0,
  cull INTEGER DEFAULT 0,
  transfer_in INTEGER DEFAULT 0,
  transfer_out INTEGER DEFAULT 0,
  egg_production INTEGER DEFAULT 0,
  egg_weight DECIMAL(10,2) DEFAULT 0,
  average_body_weight DECIMAL(10,2) DEFAULT 0,
  feed_id UUID,
  feed_consumption DECIMAL(10,2) DEFAULT 0,
  medication_id UUID,
  medication_dose TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(flock_id, record_date)
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('Pakan', 'Telur', 'Obat', 'Vaksin', 'Vitamin')) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('Pakan', 'Vaksin', 'Medikasi', 'Telur')) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(20) CHECK (unit IN ('kg', 'butir', 'dus', 'botol', 'saset', 'tray')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workforce members table
CREATE TABLE IF NOT EXISTS workforce_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(30) CHECK (role IN ('Manajer', 'Pekerja Lapangan', 'Dokter Hewan', 'Admin')) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  achievements INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance logs table
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  workforce_member_id UUID REFERENCES workforce_members(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('Hadir', 'Sakit', 'Izin', 'Alpa')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, workforce_member_id)
);

-- Inventory transaction logs table
CREATE TABLE IF NOT EXISTS inventory_transaction_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('Masuk', 'Keluar')) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(12,2) DEFAULT 0,
  party VARCHAR(255), -- Supplier or Customer
  notes TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flocks_updated_at BEFORE UPDATE ON flocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_records_updated_at BEFORE UPDATE ON daily_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workforce_members_updated_at BEFORE UPDATE ON workforce_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_logs_updated_at BEFORE UPDATE ON attendance_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_transaction_logs_updated_at BEFORE UPDATE ON inventory_transaction_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_farms_organization_id ON farms(organization_id);
CREATE INDEX IF NOT EXISTS idx_flocks_farm_id ON flocks(farm_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_flock_id ON daily_records(flock_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_date ON daily_records(record_date);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_member_id ON attendance_logs(workforce_member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_date ON attendance_logs(date);
CREATE INDEX IF NOT EXISTS idx_inventory_transaction_logs_item_id ON inventory_transaction_logs(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transaction_logs_date ON inventory_transaction_logs(transaction_date);

-- Create RLS policies (optional, for security)
-- Uncomment these if you want to enable Row Level Security

-- ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workforce_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_transaction_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (allow all for now, customize as needed)
-- CREATE POLICY "Allow all operations" ON organizations FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON farms FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON flocks FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON daily_records FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON inventory_items FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON workforce_members FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON attendance_logs FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON inventory_transaction_logs FOR ALL USING (true);