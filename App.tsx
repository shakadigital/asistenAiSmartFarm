
import React, { useState, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useSmartfarmData } from './hooks/useSmartfarmData';
import { View, AttendanceLog, WorkforceMember } from './types';
import { Spinner } from './components/ui/Spinner';

const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const AddFarm = lazy(() => import('./components/AddFarm').then(m => ({ default: m.AddFarm })));
const FarmsView = lazy(() => import('./components/FarmsView').then(m => ({ default: m.FarmsView })));
const DailyReportsView = lazy(() => import('./components/DailyReportsView').then(m => ({ default: m.DailyReportsView })));
const InventoryView = lazy(() => import('./components/InventoryView').then(m => ({ default: m.InventoryView })));
const AnalysisView = lazy(() => import('./components/AnalysisView').then(m => ({ default: m.AnalysisView })));
const WorkforceView = lazy(() => import('./components/WorkforceView').then(m => ({ default: m.WorkforceView })));

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
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              }
            >
              {renderView()}
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
