#!/usr/bin/env node

/**
 * Migration script to switch from mock data to Supabase
 * Run with: node scripts/migrate-to-supabase.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_FILE = path.join(__dirname, '..', 'App.tsx');
const BACKUP_FILE = path.join(__dirname, '..', 'App.mock.tsx');

function migrateToSupabase() {
  console.log('🚀 Starting migration to Supabase...');
  
  try {
    // Read current App.tsx
    const appContent = fs.readFileSync(APP_FILE, 'utf8');
    
    // Check if already using Supabase
    if (appContent.includes('useSupabaseData')) {
      console.log('✅ App is already using Supabase!');
      return;
    }
    
    // Create backup
    fs.writeFileSync(BACKUP_FILE, appContent);
    console.log('📦 Created backup: App.mock.tsx');
    
    // Replace import
    const updatedContent = appContent.replace(
      "import { useSmartfarmData } from './hooks/useSmartfarmData';",
      "import { useSupabaseData as useSmartfarmData } from './hooks/useSupabaseData';"
    );
    
    // Write updated content
    fs.writeFileSync(APP_FILE, updatedContent);
    
    console.log('✅ Successfully migrated to Supabase!');
    console.log('📝 Next steps:');
    console.log('   1. Make sure your .env.local has SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('   2. Run: npm run dev');
    console.log('   3. Test the application');
    console.log('   4. If issues occur, restore with: node scripts/restore-mock-data.js');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

function checkEnvironment() {
  const envFile = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envFile)) {
    console.log('⚠️  Warning: .env.local file not found');
    console.log('   Please create it with your Supabase credentials');
    return false;
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  const hasSupabaseUrl = envContent.includes('SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('SUPABASE_ANON_KEY=');
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('⚠️  Warning: Missing Supabase environment variables');
    console.log('   Please add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local');
    return false;
  }
  
  console.log('✅ Environment variables look good');
  return true;
}

// Main execution
console.log('🔍 Checking environment...');
checkEnvironment();

console.log('\n🔄 Migrating to Supabase...');
migrateToSupabase();

console.log('\n🎉 Migration complete!');
console.log('📖 For detailed setup instructions, see SETUP_GUIDE.md');