-- =====================================================
-- SCHEMA DATABASE ASISTEN AI SMARTFARM
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABEL ORGANIZATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'worker')),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL FARMS
-- =====================================================
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL FLOCKS
-- =====================================================
CREATE TABLE IF NOT EXISTS flocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name_or_code VARCHAR(255) NOT NULL,
    entry_date DATE NOT NULL,
    initial_population INTEGER NOT NULL CHECK (initial_population > 0),
    current_population INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL INVENTORY ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Pakan', 'Vaksin', 'Vitamin', 'Obat', 'Telur', 'Lainnya')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Pakan', 'Vaksin', 'Medikasi', 'Telur', 'Lainnya')),
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    min_stock DECIMAL(10,2) DEFAULT 0,
    max_stock DECIMAL(10,2) DEFAULT 0,
    price_per_unit DECIMAL(12,2) DEFAULT 0,
    supplier VARCHAR(255),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL INVENTORY TRANSACTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('Masuk', 'Keluar', 'Adjustment')),
    quantity DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    party VARCHAR(255) NOT NULL, -- Supplier atau Customer
    reference VARCHAR(255), -- Invoice, PO, dll
    notes TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL DAILY RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    mortality INTEGER NOT NULL DEFAULT 0,
    cull INTEGER NOT NULL DEFAULT 0,
    transfer_in INTEGER NOT NULL DEFAULT 0,
    transfer_out INTEGER NOT NULL DEFAULT 0,
    egg_production INTEGER NOT NULL DEFAULT 0,
    egg_weight DECIMAL(6,2) NOT NULL DEFAULT 0, -- dalam gram
    feed_consumption DECIMAL(8,2) NOT NULL DEFAULT 0, -- dalam kg
    average_body_weight DECIMAL(6,2) NOT NULL DEFAULT 0, -- dalam kg
    feed_id UUID REFERENCES inventory_items(id),
    medication_id UUID REFERENCES inventory_items(id),
    medication_dose TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(flock_id, record_date)
);

-- =====================================================
-- TABEL WORKFORCE MEMBERS
-- =====================================================
CREATE TABLE IF NOT EXISTS workforce_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Manajer', 'Pekerja Lapangan', 'Dokter Hewan', 'Admin')),
    contact VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    achievements INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABEL ATTENDANCE LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workforce_member_id UUID NOT NULL REFERENCES workforce_members(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Hadir', 'Sakit', 'Izin', 'Alpa')),
    check_in TIME,
    check_out TIME,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workforce_member_id, date)
);

-- =====================================================
-- INDEXES UNTUK PERFORMANCE
-- =====================================================

-- Index untuk foreign keys
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_farms_organization_id ON farms(organization_id);
CREATE INDEX IF NOT EXISTS idx_flocks_farm_id ON flocks(farm_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_organization_id ON inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_item_id ON inventory_transactions(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_organization_id ON inventory_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_flock_id ON daily_records(flock_id);
CREATE INDEX IF NOT EXISTS idx_daily_records_record_date ON daily_records(record_date);
CREATE INDEX IF NOT EXISTS idx_workforce_members_organization_id ON workforce_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_workforce_member_id ON attendance_logs(workforce_member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_date ON attendance_logs(date);

-- Index untuk pencarian
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_farms_name ON farms(name);
CREATE INDEX IF NOT EXISTS idx_flocks_name_or_code ON flocks(name_or_code);
CREATE INDEX IF NOT EXISTS idx_inventory_items_name ON inventory_items(name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_workforce_members_name ON workforce_members(name);
CREATE INDEX IF NOT EXISTS idx_workforce_members_role ON workforce_members(role);

-- =====================================================
-- FUNCTIONS UNTUK AUTO-UPDATE TIMESTAMP
-- =====================================================

-- Function untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk auto-update updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flocks_updated_at BEFORE UPDATE ON flocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_transactions_updated_at BEFORE UPDATE ON inventory_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_records_updated_at BEFORE UPDATE ON daily_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workforce_members_updated_at BEFORE UPDATE ON workforce_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_logs_updated_at BEFORE UPDATE ON attendance_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS UNTUK BUSINESS LOGIC
-- =====================================================

-- Function untuk update current_population di flocks
CREATE OR REPLACE FUNCTION update_flock_population()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE flocks 
        SET current_population = current_population + NEW.egg_production - NEW.mortality - NEW.cull + NEW.transfer_in - NEW.transfer_out
        WHERE id = NEW.flock_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revert old values
        UPDATE flocks 
        SET current_population = current_population - OLD.egg_production + OLD.mortality + OLD.cull - OLD.transfer_in + OLD.transfer_out
        WHERE id = OLD.flock_id;
        -- Apply new values
        UPDATE flocks 
        SET current_population = current_population + NEW.egg_production - NEW.mortality - NEW.cull + NEW.transfer_in - NEW.transfer_out
        WHERE id = NEW.flock_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE flocks 
        SET current_population = current_population - OLD.egg_production + OLD.mortality + OLD.cull - OLD.transfer_in + OLD.transfer_out
        WHERE id = OLD.flock_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update flock population
CREATE TRIGGER update_flock_population_trigger
    AFTER INSERT OR UPDATE OR DELETE ON daily_records
    FOR EACH ROW EXECUTE FUNCTION update_flock_population();

-- Function untuk update inventory quantity
CREATE OR REPLACE FUNCTION update_inventory_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.transaction_type = 'Masuk' THEN
            UPDATE inventory_items 
            SET quantity = quantity + NEW.quantity
            WHERE id = NEW.inventory_item_id;
        ELSIF NEW.transaction_type = 'Keluar' THEN
            UPDATE inventory_items 
            SET quantity = quantity - NEW.quantity
            WHERE id = NEW.inventory_item_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revert old transaction
        IF OLD.transaction_type = 'Masuk' THEN
            UPDATE inventory_items 
            SET quantity = quantity - OLD.quantity
            WHERE id = OLD.inventory_item_id;
        ELSIF OLD.transaction_type = 'Keluar' THEN
            UPDATE inventory_items 
            SET quantity = quantity + OLD.quantity
            WHERE id = OLD.inventory_item_id;
        END IF;
        -- Apply new transaction
        IF NEW.transaction_type = 'Masuk' THEN
            UPDATE inventory_items 
            SET quantity = quantity + NEW.quantity
            WHERE id = NEW.inventory_item_id;
        ELSIF NEW.transaction_type = 'Keluar' THEN
            UPDATE inventory_items 
            SET quantity = quantity - NEW.quantity
            WHERE id = NEW.inventory_item_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.transaction_type = 'Masuk' THEN
            UPDATE inventory_items 
            SET quantity = quantity - OLD.quantity
            WHERE id = OLD.inventory_item_id;
        ELSIF OLD.transaction_type = 'Keluar' THEN
            UPDATE inventory_items 
            SET quantity = quantity + OLD.quantity
            WHERE id = OLD.inventory_item_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update inventory quantity
CREATE TRIGGER update_inventory_quantity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION update_inventory_quantity();

-- =====================================================
-- SAMPLE DATA (OPSIONAL)
-- =====================================================

-- Insert sample organization
INSERT INTO organizations (id, name, logo_url) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Unggas GreenValley', 'https://picsum.photos/seed/greenvalley/200')
ON CONFLICT (id) DO NOTHING;

-- Insert sample profile
INSERT INTO profiles (id, organization_id, full_name, role, email) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Jane Doe', 'admin', 'admin@greenvalley.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample farm
INSERT INTO farms (id, organization_id, name, location) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Peternakan Utama', 'Lembah Hijau')
ON CONFLICT (id) DO NOTHING;

-- Insert sample flock
INSERT INTO flocks (id, farm_id, name_or_code, entry_date, initial_population, current_population) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Kawanan A-101', '2023-10-01', 5000, 5000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory_items (id, organization_id, name, type, category, quantity, unit, min_stock, max_stock, price_per_unit, supplier) VALUES 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Pakan Jagung Super', 'Pakan', 'Pakan', 1500, 'kg', 100, 2000, 8500, 'CV Pakan Sejahtera'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Vaksin ND-IB', 'Vaksin', 'Vaksin', 50, 'botol', 10, 100, 25000, 'Medika Farma')
ON CONFLICT (id) DO NOTHING;

-- Insert sample workforce members
INSERT INTO workforce_members (id, organization_id, name, role, contact, email, achievements) VALUES 
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Budi Santoso', 'Manajer', '081234567890', 'budi@greenvalley.com', 5),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Siti Aminah', 'Pekerja Lapangan', '081234567891', 'siti@greenvalley.com', 12)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (akan diupdate sesuai kebutuhan authentication)
CREATE POLICY "Users can view own organization data" ON organizations FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON farms FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON flocks FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON inventory_transactions FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON daily_records FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON workforce_members FOR SELECT USING (true);
CREATE POLICY "Users can view own organization data" ON attendance_logs FOR SELECT USING (true);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE organizations IS 'Tabel untuk menyimpan data organisasi/peternakan';
COMMENT ON TABLE profiles IS 'Tabel untuk menyimpan data profil pengguna';
COMMENT ON TABLE farms IS 'Tabel untuk menyimpan data lokasi peternakan';
COMMENT ON TABLE flocks IS 'Tabel untuk menyimpan data kawanan ternak';
COMMENT ON TABLE inventory_items IS 'Tabel untuk menyimpan data item inventori';
COMMENT ON TABLE inventory_transactions IS 'Tabel untuk menyimpan transaksi inventori';
COMMENT ON TABLE daily_records IS 'Tabel untuk menyimpan laporan harian ternak';
COMMENT ON TABLE workforce_members IS 'Tabel untuk menyimpan data tenaga kerja';
COMMENT ON TABLE attendance_logs IS 'Tabel untuk menyimpan log absensi tenaga kerja';
