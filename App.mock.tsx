
import React, { useState } from 'react';
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
                  inventoryItems={inventory} 
                  onAddRecord={addDailyRecord} 
                />;
      case View.INVENTORY:
        return <InventoryView 
                  inventoryItems={inventory} 
                  logs={inventoryLogs} 
                  combinedLogs={combinedInventoryLogs}
                  onAddTransaction={addInventoryTransaction}
                />;
      case View.WORKFORCE:
        return <WorkforceView 
                  workforce={workforce} 
                  kpis={workforceKPIs}
                  attendanceLogs={attendanceLogs}
                  onAddMember={addWorkforceMember}
                  onAddAttendance={addAttendance}
                />;
      case View.ANALYSIS:
        return <AnalysisView flocks={flocks} dailyRecords={dailyRecords} />;
      case View.SETTINGS:
        return <Settings organization={organization} onUpdate={updateOrganization} />;
      default:
        return <Dashboard farms={farms} flocks={flocks} dailyRecords={dailyRecords} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-sans text-gray-900 dark:text-gray-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header organization={organization} profile={profile} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-6 lg:p-8">
          {loading ? (
             <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <p className="text-lg">Memuat Data Smartfarm...</p>
                </div>
            </div>
          ) : (
            renderView()
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
