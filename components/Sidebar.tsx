
import React, { useState } from 'react';
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
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
  onClick: (e: React.MouseEvent) => void;
  isCollapsed: boolean;
}> = ({ label, icon, isActive, onClick, isCollapsed }) => {
  return (
    <li className="relative group">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className={`flex items-center p-3 rounded-lg text-base font-normal transition-all duration-200 ${
          isActive
            ? 'bg-green-600 text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? label : ''}
      >
        <div className="flex-shrink-0">{icon}</div>
        <span className={`ml-3 flex-1 whitespace-nowrap transition-all duration-200 ${
          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        }`}>{label}</span>
      </a>
      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </li>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const navItems = [
        { view: View.DASHBOARD, label: 'Dasbor', icon: ICONS.DASHBOARD },
        { view: View.FARMS, label: 'Peternakan', icon: ICONS.FARMS },
        { view: View.DAILY_REPORTS, label: 'Laporan Harian', icon: ICONS.DAILY_REPORTS },
        { view: View.INVENTORY, label: 'Inventori', icon: ICONS.INVENTORY },
        { view: View.WORKFORCE, label: 'Tenaga Kerja', icon: ICONS.WORKFORCE },
        { view: View.ANALYSIS, label: 'Analisa Performa', icon: ICONS.ANALYSIS },
        { view: View.SETTINGS, label: 'Pengaturan', icon: ICONS.SETTINGS },
    ];
    
    // Auto expand on hover when collapsed
    const shouldShowExpanded = !isCollapsed || isHovered;
    
  return (
    <aside 
      className={`${shouldShowExpanded ? 'w-64' : 'w-16'} flex-shrink-0 bg-white dark:bg-gray-900 shadow-lg flex flex-col print:hidden transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {/* Header with logo */}
      <div className="h-16 flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-green-600 flex-shrink-0" />
          <span className={`ml-2 text-xl font-bold text-gray-800 dark:text-white transition-all duration-200 ${
            shouldShowExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>Smartfarm</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-3">
            {navItems.map(item => (
                <NavItem
                    key={item.view}
                    view={item.view}
                    label={item.label}
                    icon={item.icon}
                    isActive={currentView === item.view}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent sidebar toggle when clicking nav items
                      setCurrentView(item.view);
                    }}
                    isCollapsed={!shouldShowExpanded}
                />
            ))}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 text-center transition-all duration-200 ${
        shouldShowExpanded ? 'opacity-100' : 'opacity-0'
      }`}>
          <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2024 Smartfarm Inc.</p>
      </div>
    </aside>
  );
};