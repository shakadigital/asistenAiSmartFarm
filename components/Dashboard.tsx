
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

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">{title}</h3>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </CardContent>
    </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ farms, flocks, dailyRecords }) => {
    const totalPopulation = flocks.reduce((sum, flock) => sum + flock.initialPopulation, 0);
    const avgEggProduction = dailyRecords.length > 0
        ? (dailyRecords.reduce((sum, record) => sum + record.eggProduction, 0) / dailyRecords.length).toFixed(0)
        : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Dasbor Ringkasan</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            icon={<GitFork className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Total Peternakan"
            value={farms.length.toString()}
            description="Jumlah lokasi peternakan aktif"
        />
        <StatCard 
            icon={<Bird className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Total Kawanan"
            value={flocks.length.toString()}
            description="Jumlah semua kawanan ternak"
        />
        <StatCard 
            icon={<Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Total Populasi"
            value={totalPopulation.toLocaleString('id-ID')}
            description="Total populasi awal semua kawanan"
        />
        <StatCard 
            icon={<Egg className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            title="Rata-rata Produksi Telur"
            value={parseInt(avgEggProduction).toLocaleString('id-ID')}
            description="Rata-rata telur harian"
        />
      </div>

      <div className="pt-2">
        <DashboardChart dailyRecords={dailyRecords} />
      </div>

       <div className="pt-6">
         <h3 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white mb-4">Selamat Datang di Smartfarm!</h3>
         <p className="text-gray-600 dark:text-gray-300">
            Gunakan menu di sebelah kiri untuk menavigasi melalui berbagai modul aplikasi. Anda dapat mengelola peternakan, memantau inventori, dan mendapatkan wawasan mendalam dari Analisa Performa AI kami.
         </p>
       </div>
    </div>
  );
};