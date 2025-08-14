
import React from 'react';
import type { Flock, DailyRecord } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { BarChart2 } from 'lucide-react';
import { DashboardChart } from './DashboardChart';

interface AnalysisViewProps {
  flocks: Flock[];
  dailyRecords: DailyRecord[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ flocks, dailyRecords }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart2 className="h-8 w-8 text-green-600" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Analisa Performa</h2>
      </div>
      
      {/* Performance Chart */}
      <DashboardChart dailyRecords={dailyRecords} />
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BarChart2 className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Analisis Data</h3>
          </div>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
             Lihat grafik dan statistik performa farm untuk analisis mendalam tentang kinerja dan kesehatannya.
           </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Grafik dan statistik performa akan ditampilkan di sini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
