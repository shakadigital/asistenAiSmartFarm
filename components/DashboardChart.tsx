
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from './ui/Card';
import type { DailyRecord } from '../types';
import { TrendingUp } from 'lucide-react';

interface DashboardChartProps {
  dailyRecords: DailyRecord[];
}

const processChartData = (records: DailyRecord[]) => {
    const aggregatedData: { [key: string]: { eggProduction: number; mortality: number } } = {};

    records.forEach(record => {
        if (!aggregatedData[record.recordDate]) {
            aggregatedData[record.recordDate] = { eggProduction: 0, mortality: 0 };
        }
        aggregatedData[record.recordDate].eggProduction += record.eggProduction;
        aggregatedData[record.recordDate].mortality += record.mortality;
    });
    
    const sortedDates = Object.keys(aggregatedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const recentDates = sortedDates.slice(-7); // Get last 7 days

    return recentDates.map(date => ({
        name: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        "Produksi Telur": aggregatedData[date].eggProduction,
        "Kematian": aggregatedData[date].mortality,
    }));
};


export const DashboardChart: React.FC<DashboardChartProps> = ({ dailyRecords }) => {
    const chartData = processChartData(dailyRecords);

    if (chartData.length < 2) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        <h3 className="text-xl font-semibold">Tren Performa</h3>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500 dark:text-gray-400">Data tidak cukup untuk menampilkan grafik.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-semibold">Tren Performa (7 Hari Terakhir)</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Visualisasi produksi telur dan tingkat kematian total di semua peternakan.
                </p>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 20,
                                left: -10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.2} />
                            <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(200, 200, 200, 0.5)',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Legend wrapperStyle={{fontSize: "14px"}} />
                            <Line yAxisId="left" type="monotone" dataKey="Produksi Telur" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} dot={{r: 4}} />
                            <Line yAxisId="right" type="monotone" dataKey="Kematian" stroke="#dc2626" strokeWidth={2} activeDot={{ r: 6 }} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
