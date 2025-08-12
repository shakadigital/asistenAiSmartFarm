
import React from 'react';
import type { Flock, DailyRecord } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { BarChart2, Lightbulb } from 'lucide-react';
import { SmartAssistant } from './SmartAssistant';

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
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Asisten AI AgriMind</h3>
          </div>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
             Pilih kawanan dan ajukan pertanyaan untuk mendapatkan analisis mendalam tentang kinerja dan kesehatannya.
           </p>
        </CardHeader>
        <CardContent>
            <SmartAssistant flocks={flocks} dailyRecords={dailyRecords} />
        </CardContent>
      </Card>
    </div>
  );
};
