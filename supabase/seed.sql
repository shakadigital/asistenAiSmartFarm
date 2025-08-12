-- Seed Data for Asisten AI Smartfarm
-- This file contains sample data to populate the database

-- Clear existing data (optional, uncomment if needed)
-- TRUNCATE TABLE inventory_transaction_logs CASCADE;
-- TRUNCATE TABLE attendance_logs CASCADE;
-- TRUNCATE TABLE daily_records CASCADE;
-- TRUNCATE TABLE workforce_members CASCADE;
-- TRUNCATE TABLE inventory_items CASCADE;
-- TRUNCATE TABLE flocks CASCADE;
-- TRUNCATE TABLE farms CASCADE;
-- TRUNCATE TABLE profiles CASCADE;
-- TRUNCATE TABLE organizations CASCADE;

-- Insert Organizations
INSERT INTO organizations (id, name, logo_url) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'PT. Peternakan Maju Jaya', '/api/placeholder/150/150')
ON CONFLICT (id) DO NOTHING;

-- Insert Profiles
INSERT INTO profiles (id, organization_id, full_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Ahmad Santoso', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert Farms
INSERT INTO farms (id, organization_id, name, location) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Farm Utama', 'Bogor, Jawa Barat'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Farm Cabang', 'Sukabumi, Jawa Barat')
ON CONFLICT (id) DO NOTHING;

-- Insert Flocks
INSERT INTO flocks (id, farm_id, name_or_code, entry_date, initial_population) VALUES 
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Kawanan A-101', '2024-01-15', 5000),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Kawanan A-102', '2024-02-01', 4800),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Kawanan B-201', '2024-01-20', 4500)
ON CONFLICT (id) DO NOTHING;

-- Insert Inventory Items
INSERT INTO inventory_items (id, name, type, category, quantity, unit) VALUES 
('550e8400-e29b-41d4-a716-446655440007', 'Pakan Starter', 'Pakan', 'Pakan', 2500, 'kg'),
('550e8400-e29b-41d4-a716-446655440008', 'Pakan Layer', 'Pakan', 'Pakan', 3200, 'kg'),
('550e8400-e29b-41d4-a716-446655440009', 'Pakan Grower', 'Pakan', 'Pakan', 1800, 'kg'),
('550e8400-e29b-41d4-a716-446655440010', 'Vaksin ND', 'Vaksin', 'Vaksin', 150, 'botol'),
('550e8400-e29b-41d4-a716-446655440011', 'Vaksin AI', 'Vaksin', 'Vaksin', 120, 'botol'),
('550e8400-e29b-41d4-a716-446655440012', 'Vitamin B-Complex', 'Vitamin', 'Medikasi', 20, 'saset'),
('550e8400-e29b-41d4-a716-446655440013', 'Antibiotik Pro', 'Obat', 'Medikasi', 15, 'botol'),
('550e8400-e29b-41d4-a716-446655440014', 'Telur Grade A', 'Telur', 'Telur', 650, 'butir'),
('550e8400-e29b-41d4-a716-446655440015', 'Telur Grade B', 'Telur', 'Telur', 200, 'butir')
ON CONFLICT (id) DO NOTHING;

-- Insert Workforce Members
INSERT INTO workforce_members (id, name, role, contact, achievements) VALUES 
('550e8400-e29b-41d4-a716-446655440016', 'Budi Hartono', 'Manajer', '081234567890', 15),
('550e8400-e29b-41d4-a716-446655440017', 'Siti Nurhaliza', 'Pekerja Lapangan', '081234567891', 8),
('550e8400-e29b-41d4-a716-446655440018', 'Dr. Andi Wijaya', 'Dokter Hewan', '081234567892', 12),
('550e8400-e29b-41d4-a716-446655440019', 'Maya Sari', 'Admin', '081234567893', 5),
('550e8400-e29b-41d4-a716-446655440020', 'Joko Susilo', 'Pekerja Lapangan', '081234567894', 6),
('550e8400-e29b-41d4-a716-446655440021', 'Rina Wati', 'Pekerja Lapangan', '081234567895', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert Daily Records (sample data for the last 30 days)
INSERT INTO daily_records (id, flock_id, record_date, mortality, cull, transfer_in, transfer_out, egg_production, egg_weight, average_body_weight, feed_consumption, notes) VALUES 
-- Kawanan A-101 records
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440004', '2024-05-20', 5, 2, 0, 0, 4500, 58.5, 1850, 320.5, 'Kondisi normal'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440004', '2024-05-21', 3, 1, 0, 0, 4450, 58.2, 1855, 318.2, 'Sedikit penurunan produksi'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440004', '2024-05-22', 4, 0, 0, 0, 4200, 57.8, 1860, 315.8, 'Cuaca panas'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440004', '2024-05-23', 2, 1, 0, 0, 4600, 59.1, 1865, 322.1, 'Kondisi membaik'),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440004', '2024-05-24', 6, 3, 0, 0, 4350, 58.7, 1870, 319.5, 'Ada yang sakit'),
-- Kawanan A-102 records
('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440005', '2024-05-20', 4, 1, 0, 0, 4200, 57.5, 1780, 298.5, 'Kondisi baik'),
('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440005', '2024-05-21', 3, 2, 0, 0, 4150, 57.2, 1785, 296.2, 'Stabil'),
('550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440005', '2024-05-22', 5, 0, 0, 0, 3980, 56.8, 1790, 294.8, 'Produksi turun'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440005', '2024-05-23', 2, 1, 0, 0, 4300, 58.1, 1795, 301.1, 'Membaik'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440005', '2024-05-24', 3, 2, 0, 0, 4180, 57.9, 1800, 299.5, 'Normal'),
-- Kawanan B-201 records
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440006', '2024-05-20', 3, 1, 0, 0, 3800, 56.5, 1650, 275.5, 'Kondisi baik'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440006', '2024-05-21', 4, 0, 0, 0, 3750, 56.2, 1655, 273.2, 'Sedikit turun'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440006', '2024-05-22', 2, 1, 0, 0, 3900, 57.1, 1660, 278.1, 'Meningkat'),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440006', '2024-05-23', 5, 2, 0, 0, 3650, 55.8, 1665, 271.8, 'Ada masalah'),
('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440006', '2024-05-24', 3, 1, 0, 0, 3850, 56.9, 1670, 276.5, 'Membaik')
ON CONFLICT (id) DO NOTHING;

-- Insert Attendance Logs (sample for last 7 days)
INSERT INTO attendance_logs (id, date, workforce_member_id, status, notes) VALUES 
-- 2024-05-24
('550e8400-e29b-41d4-a716-446655440037', '2024-05-24', '550e8400-e29b-41d4-a716-446655440016', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440038', '2024-05-24', '550e8400-e29b-41d4-a716-446655440017', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440039', '2024-05-24', '550e8400-e29b-41d4-a716-446655440018', 'Hadir', 'Kunjungan rutin'),
('550e8400-e29b-41d4-a716-446655440040', '2024-05-24', '550e8400-e29b-41d4-a716-446655440019', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440041', '2024-05-24', '550e8400-e29b-41d4-a716-446655440020', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440042', '2024-05-24', '550e8400-e29b-41d4-a716-446655440021', 'Sakit', 'Demam'),
-- 2024-05-23
('550e8400-e29b-41d4-a716-446655440043', '2024-05-23', '550e8400-e29b-41d4-a716-446655440016', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440044', '2024-05-23', '550e8400-e29b-41d4-a716-446655440017', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440045', '2024-05-23', '550e8400-e29b-41d4-a716-446655440018', 'Izin', 'Acara keluarga'),
('550e8400-e29b-41d4-a716-446655440046', '2024-05-23', '550e8400-e29b-41d4-a716-446655440019', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440047', '2024-05-23', '550e8400-e29b-41d4-a716-446655440020', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440048', '2024-05-23', '550e8400-e29b-41d4-a716-446655440021', 'Hadir', 'Tepat waktu'),
-- 2024-05-22
('550e8400-e29b-41d4-a716-446655440049', '2024-05-22', '550e8400-e29b-41d4-a716-446655440016', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440050', '2024-05-22', '550e8400-e29b-41d4-a716-446655440017', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440051', '2024-05-22', '550e8400-e29b-41d4-a716-446655440018', 'Hadir', 'Pemeriksaan kesehatan'),
('550e8400-e29b-41d4-a716-446655440052', '2024-05-22', '550e8400-e29b-41d4-a716-446655440019', 'Hadir', 'Tepat waktu'),
('550e8400-e29b-41d4-a716-446655440053', '2024-05-22', '550e8400-e29b-41d4-a716-446655440020', 'Alpa', 'Tidak ada kabar'),
('550e8400-e29b-41d4-a716-446655440054', '2024-05-22', '550e8400-e29b-41d4-a716-446655440021', 'Hadir', 'Tepat waktu')
ON CONFLICT (id) DO NOTHING;

-- Insert Inventory Transaction Logs (sample transactions)
INSERT INTO inventory_transaction_logs (id, inventory_item_id, transaction_type, quantity, price, party, notes, transaction_date) VALUES 
-- Pakan transactions
('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440007', 'Masuk', 1000, 8500000, 'PT. Pakan Jaya', 'Pembelian rutin', '2024-05-01'),
('550e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440007', 'Keluar', 500, 0, 'Konsumsi Farm', 'Pemakaian harian', '2024-05-15'),
('550e8400-e29b-41d4-a716-446655440057', '550e8400-e29b-41d4-a716-446655440008', 'Masuk', 2000, 16000000, 'PT. Pakan Jaya', 'Stok bulanan', '2024-05-01'),
('550e8400-e29b-41d4-a716-446655440058', '550e8400-e29b-41d4-a716-446655440008', 'Keluar', 800, 0, 'Konsumsi Farm', 'Pemakaian harian', '2024-05-20'),
-- Vaksin transactions
('550e8400-e29b-41d4-a716-446655440059', '550e8400-e29b-41d4-a716-446655440010', 'Masuk', 100, 2500000, 'CV. Medika Ternak', 'Stok vaksin', '2024-05-01'),
('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440010', 'Keluar', 50, 0, 'Vaksinasi Rutin', 'Program vaksinasi', '2024-05-10'),
-- Vitamin transactions
('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440012', 'Masuk', 50, 750000, 'Medika Farma', 'Stok vitamin', '2024-05-01'),
('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440012', 'Keluar', 30, 0, 'Pemberian Vitamin', 'Pemakaian rutin', '2024-05-21'),
-- Telur transactions
('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440014', 'Masuk', 4500, 0, 'Produksi Kawanan A-101', 'Hasil produksi', '2024-05-20'),
('550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440014', 'Keluar', 4000, 8000000, 'Distributor Telur Jaya', 'Penjualan Grade A', '2024-05-20'),
('550e8400-e29b-41d4-a716-446655440065', '550e8400-e29b-41d4-a716-446655440014', 'Masuk', 4200, 0, 'Produksi Kawanan A-101', 'Hasil produksi', '2024-05-22'),
('550e8400-e29b-41d4-a716-446655440066', '550e8400-e29b-41d4-a716-446655440014', 'Keluar', 8500, 17850000, 'Supermarket Segar', 'Pengiriman besar', '2024-05-22')
ON CONFLICT (id) DO NOTHING;

-- Update sequences to avoid conflicts with future inserts
SELECT setval(pg_get_serial_sequence('organizations', 'id'), (SELECT MAX(id::text)::bigint FROM organizations WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('profiles', 'id'), (SELECT MAX(id::text)::bigint FROM profiles WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('farms', 'id'), (SELECT MAX(id::text)::bigint FROM farms WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('flocks', 'id'), (SELECT MAX(id::text)::bigint FROM flocks WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('daily_records', 'id'), (SELECT MAX(id::text)::bigint FROM daily_records WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('inventory_items', 'id'), (SELECT MAX(id::text)::bigint FROM inventory_items WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('workforce_members', 'id'), (SELECT MAX(id::text)::bigint FROM workforce_members WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('attendance_logs', 'id'), (SELECT MAX(id::text)::bigint FROM attendance_logs WHERE id::text ~ '^[0-9]+$') + 1, false);
SELECT setval(pg_get_serial_sequence('inventory_transaction_logs', 'id'), (SELECT MAX(id::text)::bigint FROM inventory_transaction_logs WHERE id::text ~ '^[0-9]+$') + 1, false);