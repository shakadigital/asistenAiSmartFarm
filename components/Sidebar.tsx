
import React from 'react';
import { Leaf } from 'lucide-react';
import { View } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`flex items-center p-3 rounded-lg text-base font-normal transition-all duration-200 ${
          isActive
            ? 'bg-green-600 text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {icon}
        <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
      </a>
    </li>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    const navItems = [
        { view: View.DASHBOARD, label: 'Dasbor', icon: ICONS.DASHBOARD },
        { view: View.FARMS, label: 'Peternakan', icon: ICONS.FARMS },
        { view: View.DAILY_REPORTS, label: 'Laporan Harian', icon: ICONS.DAILY_REPORTS },
        { view: View.INVENTORY, label: 'Inventori', icon: ICONS.INVENTORY },
        { view: View.WORKFORCE, label: 'Tenaga Kerja', icon: ICONS.WORKFORCE },
        { view: View.ANALYSIS, label: 'Analisa Performa', icon: ICONS.ANALYSIS },
        { view: View.SETTINGS, label: 'Pengaturan', icon: ICONS.SETTINGS },
    ];
    
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 shadow-lg flex flex-col print:hidden">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
        <Leaf className="h-8 w-8 text-green-600" />
        <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Smartfarm</span>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-3">
            {navItems.map(item => (
                <NavItem
                    key={item.view}
                    view={item.view}
                    label={item.label}
                    icon={item.icon}
                    isActive={currentView === item.view}
                    onClick={() => setCurrentView(item.view)}
                />
            ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2024 Smartfarm Inc.</p>
      </div>
    </aside>
  );
};