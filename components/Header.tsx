
import React from 'react';
import type { Organization, Profile } from '../types';
import { Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  organization: Organization | null;
  profile: Profile | null;
}

export const Header: React.FC<HeaderProps> = ({ organization, profile }) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 shadow-sm flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 print:hidden">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{organization?.name || 'Memuat...'}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src={organization?.logoUrl || `https://i.pravatar.cc/150?u=${profile?.id}`}
            alt="Logo Organisasi"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{profile?.fullName || 'Pengguna'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{profile?.role || 'Peran'}</p>
          </div>
           <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
};