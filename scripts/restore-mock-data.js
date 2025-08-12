#!/usr/bin/env node

/**
 * Restore script to switch back from Supabase to mock data
 * Run with: node scripts/restore-mock-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_FILE = path.join(__dirname, '..', 'App.tsx');
const BACKUP_FILE = path.join(__dirname, '..', 'App.mock.tsx');

function restoreMockData() {
  console.log('🔄 Restoring mock data...');
  
  try {
    // Check if backup exists
    if (!fs.existsSync(BACKUP_FILE)) {
      console.log('❌ No backup file found (App.mock.tsx)');
      console.log('   Creating new App.tsx with mock data...');
      
      // Create App.tsx with mock data import
      const mockAppContent = `import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { useSmartfarmData } from './hooks/useSmartfarmData';
import { View, AttendanceLog, WorkforceMember } from './types';
import { AddFarm } from './components/AddFarm';
import { FarmsView } from './components/FarmsView';
import { DailyReportsView } from './components/DailyReportsView';
import { InventoryView } from './components/InventoryView';
import { AnalysisView } from './components/AnalysisView';
import { WorkforceView } from './components/WorkforceView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const { 
      organization, 
      profile, 
      farms, 
      flocks, 
      dailyRecords, 
      inventory,
      workforce,
      workforceKPIs,
      attendanceLogs,
      inventoryLogs,
      combinedInventoryLogs,
      updateOrganization, 
      addFarm, 
      addFlock, 
      addWorkforceMember,
      addDailyRecord,
      addInventoryTransaction,
      addAttendance,
      loading 
  } = useSmartfarmData();

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard farms={farms} flocks={flocks} dailyRecords={dailyRecords} />;
      case View.FARMS:
        return <FarmsView farms={farms} flocks={flocks} onAddFlock={addFlock} onAddFarmClick={() => setCurrentView(View.ADD_FARM)} />;
      case View.ADD_FARM:
        return <AddFarm onAddFarm={addFarm} onFarmAdded={() => setCurrentView(View.FARMS)} />;
      case View.DAILY_REPORTS:
        return <DailyReportsView 
                  dailyRecords={dailyRecords} 
                  flocks={flocks} 
                  onAddRecord={addDailyRecord} 
                />;
      case View.INVENTORY:
        return <InventoryView 
                  inventory={inventory} 
                  inventoryLogs={combinedInventoryLogs}
                  onAddTransaction={addInventoryTransaction} 
                />;
      case View.ANALYSIS:
        return <AnalysisView 
                  farms={farms} 
                  flocks={flocks} 
                  dailyRecords={dailyRecords} 
                  inventory={inventory}
                />;
      case View.WORKFORCE:
        return <WorkforceView 
                  workforce={workforce}
                  workforceKPIs={workforceKPIs}
                  attendanceLogs={attendanceLogs}
                  onAddMember={addWorkforceMember}
                  onAddAttendance={addAttendance}
                />;
      case View.SETTINGS:
        return <Settings 
                  organization={organization} 
                  profile={profile} 
                  onUpdateOrganization={updateOrganization} 
                />;
      default:
        return <Dashboard farms={farms} flocks={flocks} dailyRecords={dailyRecords} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col">
        <Header organization={organization} profile={profile} />
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;`;
      
      fs.writeFileSync(APP_FILE, mockAppContent);
      console.log('✅ Created new App.tsx with mock data');
      return;
    }
    
    // Read current App.tsx
    const appContent = fs.readFileSync(APP_FILE, 'utf8');
    
    // Check if already using mock data
    if (appContent.includes('useSmartfarmData') && !appContent.includes('useSupabaseData')) {
      console.log('✅ App is already using mock data!');
      return;
    }
    
    // Restore from backup
    const backupContent = fs.readFileSync(BACKUP_FILE, 'utf8');
    fs.writeFileSync(APP_FILE, backupContent);
    
    console.log('✅ Successfully restored mock data!');
    console.log('📝 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Test the application with mock data');
    console.log('   3. To migrate back to Supabase: node scripts/migrate-to-supabase.js');
    
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    process.exit(1);
  }
}

// Main execution
console.log('🔄 Restoring to mock data...');
restoreMockData();

console.log('\n🎉 Restore complete!');
console.log('📖 For setup instructions, see SETUP_GUIDE.md');