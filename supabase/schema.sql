-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'member')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farms table
CREATE TABLE farms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flocks table
CREATE TABLE flocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name_or_code VARCHAR(255) NOT NULL,
  entry_date DATE NOT NULL,
  initial_population INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily records table
CREATE TABLE daily_records (
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
  UNIQUE(flock_id, record_date)
);

-- Inventory items table
CREATE TABLE inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('Pakan', 'Telur', 'Obat', 'Vaksin', 'Vitamin')) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('Pakan', 'Vaksin', 'Medikasi', 'Telur')) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(20) CHECK (unit IN ('kg', 'butir', 'dus', 'botol', 'saset', 'tray')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workforce members table
CREATE TABLE workforce_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(30) CHECK (role IN ('Manajer', 'Pekerja Lapangan', 'Dokter Hewan', 'Admin')) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  achievements INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance logs table
CREATE TABLE attendance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  workforce_member_id UUID REFERENCES workforce_members(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('Hadir', 'Sakit', 'Izin', 'Alpa')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, workforce_member_id)
);

-- Inventory transaction logs table
CREATE TABLE inventory_transaction_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('Masuk', 'Keluar')) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(12,2) DEFAULT 0,
  party VARCHAR(255), -- Supplier or Customer
  notes TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_farms_organization_id ON farms(organization_id);
CREATE INDEX idx_flocks_farm_id ON flocks(farm_id);
CREATE INDEX idx_daily_records_flock_id ON daily_records(flock_id);
CREATE INDEX idx_daily_records_date ON daily_records(record_date);
CREATE INDEX idx_attendance_logs_member_id ON attendance_logs(workforce_member_id);
CREATE INDEX idx_attendance_logs_date ON attendance_logs(date);
CREATE INDEX idx_inventory_transaction_logs_item_id ON inventory_transaction_logs(inventory_item_id);
CREATE INDEX idx_inventory_transaction_logs_date ON inventory_transaction_logs(transaction_date);

-- Insert sample data
INSERT INTO organizations (id, name, logo_url) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'PT. Lokasi Maju Jaya', '/api/placeholder/150/150');

INSERT INTO profiles (id, organization_id, full_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Ahmad Santoso', 'admin');

INSERT INTO farms (id, organization_id, name, location) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Farm Utama', 'Bogor, Jawa Barat'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Farm Cabang', 'Sukabumi, Jawa Barat');

INSERT INTO flocks (id, farm_id, name_or_code, entry_date, initial_population) VALUES 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Farm A-101', '2024-01-15', 5000),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Farm A-102', '2024-02-01', 4800),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Farm B-201', '2024-01-20', 4500);

INSERT INTO inventory_items (id, name, type, category, quantity, unit) VALUES 
('550e8400-e29b-41d4-a716-446655440007', 'Pakan Starter', 'Pakan', 'Pakan', 2500, 'kg'),
('550e8400-e29b-41d4-a716-446655440008', 'Pakan Layer', 'Pakan', 'Pakan', 3200, 'kg'),
('550e8400-e29b-41d4-a716-446655440009', 'Vaksin ND', 'Vaksin', 'Vaksin', 150, 'botol'),
('550e8400-e29b-41d4-a716-446655440010', 'Vitamin B-Complex', 'Vitamin', 'Medikasi', 20, 'saset'),
('550e8400-e29b-41d4-a716-446655440011', 'Telur Grade A', 'Telur', 'Telur', 650, 'butir');

INSERT INTO workforce_members (id, name, role, contact, achievements) VALUES 
('550e8400-e29b-41d4-a716-446655440012', 'Budi Hartono', 'Manajer', '081234567890', 15),
('550e8400-e29b-41d4-a716-446655440013', 'Siti Nurhaliza', 'Pekerja Lapangan', '081234567891', 8),
('550e8400-e29b-41d4-a716-446655440014', 'Dr. Andi Wijaya', 'Dokter Hewan', '081234567892', 12),
('550e8400-e29b-41d4-a716-446655440015', 'Maya Sari', 'Admin', '081234567893', 5);