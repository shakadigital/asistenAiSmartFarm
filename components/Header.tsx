
import React, { useState } from 'react';
import type { Organization, Profile } from '../types';
import { Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  organization: Organization | null;
  profile: Profile | null;
}

export const Header: React.FC<HeaderProps> = ({ organization, profile }) => {
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 shadow-sm flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 print:hidden">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">{organization?.name || 'Memuat...'}</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover flex-shrink-0"
            src={organization?.logoUrl || `https://i.pravatar.cc/150?u=${profile?.id}`}
            alt="Logo Organisasi"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{profile?.fullName || 'Pengguna'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{profile?.role || 'Peran'}</p>
          </div>
          <button 
            className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hidden sm:flex"
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
          >
            <LogOut 
              className={`h-4 w-4 transition-all duration-300 ${
                isLogoutHovered 
                  ? 'rotate-0 text-red-600' 
                  : 'rotate-90 text-gray-500'
              }`} 
            />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isLogoutHovered ? 'text-red-600' : 'text-gray-500'
            }`}>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};