
import React from 'react';
import type { Farm, Flock, DailyRecord } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { GitFork, Bird, Users, Egg } from 'lucide-react';
import { DashboardChart } from './DashboardChart';

interface DashboardProps {
  farms: Farm[];
  flocks: Flock[];
  dailyRecords: DailyRecord[];
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => {
    const isZero = value === '0' || value === '0,00' || parseInt(value.replace(/[^0-9]/g, '')) === 0;
    
    return (
        <Card className={isZero ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">{title}</h3>
                {icon}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${isZero ? 'text-gray-400 dark:text-gray-500' : ''}`}>{value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </CardContent>
        </Card>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ farms, flocks, dailyRecords }) => {
    const [selectedFlockId, setSelectedFlockId] = React.useState<string>('');
    
    const totalPopulation = flocks.reduce((sum, flock) => sum + flock.initialPopulation, 0);
    const avgEggProduction = dailyRecords.length > 0
        ? (dailyRecords.reduce((sum, record) => sum + record.eggProduction, 0) / dailyRecords.length).toFixed(0)
        : '0';
    
    // Calculate flock age based on selected flock or default
    const selectedFlock = flocks.find(flock => flock.id === selectedFlockId);
    const currentFlockAge = selectedFlock
        ? Math.floor((Date.now() - new Date(selectedFlock.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))
        : flocks.length > 0 
            ? Math.floor((Date.now() - new Date(flocks[0].startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))
            : 27; // default to 27 weeks
    
    const handleFlockChange = (flockId: string) => {
        setSelectedFlockId(flockId);
    };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Dasbor Ringkasan</h2>
      </div>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            icon={<GitFork className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Total Lokasi"
            value={farms.length.toString()}
            description="Jumlah lokasi aktif"
        />
        <StatCard 
            icon={<Bird className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Total Farm"
            value={flocks.length.toString()}
            description="Jumlah semua farm ternak"
        />
        <StatCard 
            icon={<Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Total Populasi"
            value={totalPopulation.toLocaleString('id-ID')}
            description="Total populasi awal semua farm"
        />
        <StatCard 
            icon={<Egg className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Rata-rata Produksi Telur"
            value={parseInt(avgEggProduction).toLocaleString('id-ID')}
            description="Rata-rata telur harian"
        />
      </div>

      <div className="pt-2">
        <DashboardChart 
          dailyRecords={dailyRecords} 
          flockAge={currentFlockAge}
          farms={farms}
          flocks={flocks}
          onFlockChange={handleFlockChange}
        />
      </div>

       <div className="pt-4 sm:pt-6">
         <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-800 dark:text-white mb-3 sm:mb-4">Selamat Datang di Smartfarm!</h3>
         <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Gunakan menu di sebelah kiri untuk menavigasi melalui berbagai modul aplikasi. Anda dapat mengelola lokasi, memantau inventori, dan mendapatkan wawasan mendalam dari Analisa Performa AI kami.
         </p>
       </div>
    </div>
  );
};