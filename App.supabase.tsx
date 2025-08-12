import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FarmsView } from './components/FarmsView';
import { AddFarm } from './components/AddFarm';
import { DailyReportsView } from './components/DailyReportsView';
import { InventoryView } from './components/InventoryView';
import { WorkforceView } from './components/WorkforceView';
import { AnalysisView } from './components/AnalysisView';
import { Settings } from './components/Settings';
import { View } from './types';

// Import Supabase hook instead of mock data hook
import { useSupabaseData } from './hooks/useSupabaseData';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use Supabase data hook
  const {
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
    loadData,
    updateOrganization,
    addFarm,
    addFlock,
    addDailyRecord,
    addInventoryTransaction,
    addWorkforceMember,
    addAttendance
  } = useSupabaseData();

  // Show loading state
  if (loading && !organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data dari database...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-left">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Pastikan:
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• File .env.local sudah diisi dengan kredensial Supabase</li>
              <li>• Database schema sudah dijalankan</li>
              <li>• Koneksi internet stabil</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show main app if data loaded successfully
  if (!organization || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Data organisasi tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard
            farms={farms}
            flocks={flocks}
            dailyRecords={dailyRecords}
            inventory={inventory}
            workforce={workforce}
            attendanceLogs={attendanceLogs}
          />
        );
      case View.FARMS:
        return (
          <FarmsView
            farms={farms}
            flocks={flocks}
            onAddFarm={() => setCurrentView(View.ADD_FARM)}
            onAddFlock={addFlock}
          />
        );
      case View.ADD_FARM:
        return (
          <AddFarm
            onAddFarm={addFarm}
            onBack={() => setCurrentView(View.FARMS)}
          />
        );
      case View.DAILY_REPORTS:
        return (
          <DailyReportsView
            flocks={flocks}
            dailyRecords={dailyRecords}
            onAddRecord={addDailyRecord}
          />
        );
      case View.INVENTORY:
        return (
          <InventoryView
            inventory={inventory}
            onAddTransaction={addInventoryTransaction}
          />
        );
      case View.WORKFORCE:
        return (
          <WorkforceView
            workforce={workforce}
            kpis={workforceKPIs}
            attendanceLogs={attendanceLogs}
            onAddMember={addWorkforceMember}
            onAddAttendance={addAttendance}
          />
        );
      case View.ANALYSIS:
        return (
          <AnalysisView
            flocks={flocks}
            dailyRecords={dailyRecords}
          />
        );
      case View.SETTINGS:
        return (
          <Settings
            organization={organization}
            profile={profile}
            onUpdateOrganization={updateOrganization}
          />
        );
      default:
        return (
          <Dashboard
            farms={farms}
            flocks={flocks}
            dailyRecords={dailyRecords}
            inventory={inventory}
            workforce={workforce}
            attendanceLogs={attendanceLogs}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        organization={organization}
        profile={profile}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            {loading && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700 dark:text-blue-300 text-sm">
                    Menyimpan perubahan...
                  </span>
                </div>
              </div>
            )}
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;