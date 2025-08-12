
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from './ui/Card';
import type { DailyRecord, Farm, Flock } from '../types';
import { TrendingUp } from 'lucide-react';
import { getHyLineMaxProStandard, getStandardDataForWeek } from '../services/standardPerformanceService';

interface DashboardChartProps {
    records: DailyRecord[];
    flockAge?: number; // Age in weeks
    farms?: Farm[];
    flocks?: Flock[];
    onFlockChange?: (flockId: string) => void;
}

const processChartData = (records: DailyRecord[], activeMetric: string, flockAge: number) => {
    const standardData = getHyLineMaxProStandard();
    
    // Determine phase and generate appropriate weeks
    const isRearingPhase = flockAge < 18;
    let selectedWeeks: number[] = [];
    
    if (isRearingPhase) {
        // Rearing phase: 1-17 weeks
        for (let week = 1; week <= 17; week += 2) { // Show every 2 weeks
            selectedWeeks.push(week);
        }
    } else {
        // Laying phase: 18-90 weeks
        for (let week = 18; week <= 90; week += 4) { // Show every 4 weeks
            selectedWeeks.push(week);
        }
        selectedWeeks = selectedWeeks.slice(0, 18); // Limit to 18 points
    }

    return selectedWeeks.map((week, index) => {
        const standardWeek = getStandardDataForWeek(standardData, week);
        const baseData = {
            name: `${week} mg`, // Show age in weeks
        };
        
        // Add standard reference data
        const standardRef = standardWeek ? {
            'HD Standard': standardWeek.eggProduction ? (standardWeek.eggProduction.min + standardWeek.eggProduction.max) / 2 : null,
            'Fi Standard': (standardWeek.feedIntake.min + standardWeek.feedIntake.max) / 2,
            'EW Standard': standardWeek.eggWeight ? (standardWeek.eggWeight.min + standardWeek.eggWeight.max) / 2 : null,
            'FCR Standard': standardWeek.fcr ? (standardWeek.fcr.min + standardWeek.fcr.max) / 2 : null,
        } : {};
        
        // Use actual data from records or fallback to standard
        const weekRecords = records.filter(record => {
            const recordDate = new Date(record.recordDate);
            const weeksSinceStart = Math.floor((recordDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)) + week;
            return Math.abs(weeksSinceStart - week) <= 1; // Records within 1 week of target
        });
        
        const avgRecord = weekRecords.length > 0 ? {
            henDay: weekRecords.reduce((sum, r) => sum + (r.eggProduction || 0), 0) / weekRecords.length,
            feedIntake: weekRecords.reduce((sum, r) => sum + (r.feedConsumption || 0), 0) / weekRecords.length,
            eggWeight: weekRecords.reduce((sum, r) => sum + (r.eggWeight || 0), 0) / weekRecords.length,
            fcr: weekRecords.reduce((sum, r) => sum + (r.fcr || 0), 0) / weekRecords.length,
        } : null;
        
        const actualData = avgRecord || (standardWeek ? {
            henDay: standardWeek.eggProduction ? (standardWeek.eggProduction.min + standardWeek.eggProduction.max) / 2 : 0,
            feedIntake: (standardWeek.feedIntake.min + standardWeek.feedIntake.max) / 2,
            eggWeight: standardWeek.eggWeight ? (standardWeek.eggWeight.min + standardWeek.eggWeight.max) / 2 : 0,
            fcr: standardWeek.fcr ? (standardWeek.fcr.min + standardWeek.fcr.max) / 2 : 0,
        } : {
            henDay: 0,
            feedIntake: 0,
            eggWeight: 0,
            fcr: 0,
        });
        
        switch (activeMetric) {
            case 'HD':
                return { 
                    ...baseData, 
                    "Hen Day (%)": Math.round(actualData.henDay * 100) / 100,
                    "HD Standard": standardRef['HD Standard']
                };
            case 'Fi':
                return { 
                    ...baseData, 
                    "Feed Intake (g)": Math.round(actualData.feedIntake * 100) / 100,
                    "Fi Standard": standardRef['Fi Standard']
                };
            case 'EW':
                return { 
                    ...baseData, 
                    "Egg Weight (g)": Math.round(actualData.eggWeight * 100) / 100,
                    "EW Standard": standardRef['EW Standard']
                };
            case 'FCR':
                return { 
                    ...baseData, 
                    "FCR": Math.round(actualData.fcr * 100) / 100,
                    "FCR Standard": standardRef['FCR Standard']
                };
            default:
                // For default view, show actual mortality and egg production data
                const mortalityRate = avgRecord ? 
                    (avgRecord.henDay > 0 ? ((weekRecords.reduce((sum, r) => sum + (r.mortality || 0), 0) / weekRecords.length) || 0) : 0) :
                    0;
                const eggProduction = avgRecord ? actualData.henDay : (isRearingPhase ? 0 : 0);
                return {
                    ...baseData,
                    "Produksi Telur": Math.round(eggProduction),
                    "Kematian": Math.round(mortalityRate * 100) / 100,
                };
        }
    });
};


export const DashboardChart: React.FC<DashboardChartProps> = ({ 
    dailyRecords, 
    flockAge = 27, 
    farms = [], 
    flocks = [], 
    onFlockChange 
}) => {
    const [selectedFarmId, setSelectedFarmId] = useState<string>('');
    const [selectedFlockId, setSelectedFlockId] = useState<string>('');
    const [activeMetric, setActiveMetric] = useState<string>('default');
    const chartData = processChartData(dailyRecords, activeMetric, flockAge);
    const isRearingPhase = flockAge < 18;
    const currentPhase = isRearingPhase ? 'Rearing' : 'Laying';
    const phaseRange = isRearingPhase ? '1-17 mg' : '18-90 mg';
    
    const metrics = [
        { key: 'HD', label: 'HD', color: '#3b82f6' },
        { key: 'Fi', label: 'Fi', color: '#10b981' },
        { key: 'EW', label: 'EW', color: '#f59e0b' },
        { key: 'FCR', label: 'FCR', color: '#8b5cf6' },
    ];
    
    const getLineConfig = () => {
        switch (activeMetric) {
            case 'HD':
                return { dataKey: "Hen Day (%)", stroke: '#3b82f6' };
            case 'Fi':
                return { dataKey: "Feed Intake (g)", stroke: '#10b981' };
            case 'EW':
                return { dataKey: "Egg Weight (g)", stroke: '#f59e0b' };
            case 'FCR':
                return { dataKey: "FCR", stroke: '#8b5cf6' };
            default:
                return null;
        }
    };

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
                        <h3 className="text-xl font-semibold">Standar Performa Hy-Line</h3>
                    </div>
                <div className="mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {metrics.map((metric) => (
                                <button
                                    key={metric.key}
                                    onClick={() => setActiveMetric(metric.key)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        activeMetric === metric.key
                                            ? `text-white`
                                            : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    style={{
                                        backgroundColor: activeMetric === metric.key ? metric.color : undefined
                                    }}
                                >
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-end gap-4 ml-auto">
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">Pilih Farm:</label>
                                <select 
                                    value={selectedFarmId}
                                    onChange={(e) => {
                                        setSelectedFarmId(e.target.value);
                                        setSelectedFlockId(''); // Reset flock selection
                                    }}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Semua Farm</option>
                                    {farms.map(farm => (
                                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">Pilih Flock:</label>
                                <select 
                                    value={selectedFlockId}
                                    onChange={(e) => {
                                        setSelectedFlockId(e.target.value);
                                        if (onFlockChange) {
                                            onFlockChange(e.target.value);
                                        }
                                    }}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Semua Flock</option>
                                    {flocks
                                        .filter(flock => !selectedFarmId || flock.farmId === selectedFarmId)
                                        .map(flock => {
                                            const age = Math.floor((Date.now() - new Date(flock.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7));
                                            return (
                                                <option key={flock.id} value={flock.id}>
                                                    {flock.breed} - {age} minggu
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
                            {activeMetric === 'default' ? (
                                <>
                                    <Line 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey="Produksi Telur" 
                                        stroke="#16a34a" 
                                        strokeWidth={2} 
                                        activeDot={{ r: 6 }} 
                                        dot={(props: any) => {
                                            const isZero = props.payload && props.payload['Produksi Telur'] === 0;
                                            return (
                                                <circle 
                                                    cx={props.cx} 
                                                    cy={props.cy} 
                                                    r={4} 
                                                    fill={isZero ? '#16a34a' : '#16a34a'} 
                                                    fillOpacity={isZero ? 0.3 : 1}
                                                    stroke={isZero ? '#16a34a' : '#16a34a'}
                                                    strokeOpacity={isZero ? 0.3 : 1}
                                                />
                                            );
                                        }}
                                    />
                                    <Line 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="Kematian" 
                                        stroke="#dc2626" 
                                        strokeWidth={2} 
                                        activeDot={{ r: 6 }} 
                                        dot={(props: any) => {
                                            const isZero = props.payload && props.payload['Kematian'] === 0;
                                            return (
                                                <circle 
                                                    cx={props.cx} 
                                                    cy={props.cy} 
                                                    r={4} 
                                                    fill={isZero ? '#dc2626' : '#dc2626'} 
                                                    fillOpacity={isZero ? 0.3 : 1}
                                                    stroke={isZero ? '#dc2626' : '#dc2626'}
                                                    strokeOpacity={isZero ? 0.3 : 1}
                                                />
                                            );
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Line 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey={getLineConfig()?.dataKey} 
                                        stroke={getLineConfig()?.stroke} 
                                        strokeWidth={2} 
                                        activeDot={{ r: 6 }} 
                                        dot={(props: any) => {
                                            const dataKey = getLineConfig()?.dataKey;
                                            const isZero = props.payload && props.payload[dataKey] === 0;
                                            return (
                                                <circle 
                                                    cx={props.cx} 
                                                    cy={props.cy} 
                                                    r={4} 
                                                    fill={getLineConfig()?.stroke} 
                                                    fillOpacity={isZero ? 0.3 : 1}
                                                    stroke={getLineConfig()?.stroke}
                                                    strokeOpacity={isZero ? 0.3 : 1}
                                                />
                                            );
                                        }}
                                        name="Aktual"
                                    />
                                    {/* Standard reference line */}
                                    {activeMetric === 'HD' && (
                                        <Line 
                                            yAxisId="left" 
                                            type="monotone" 
                                            dataKey="HD Standard" 
                                            stroke="#94a3b8" 
                                            strokeWidth={1} 
                                            strokeDasharray="5 5" 
                                            dot={false} 
                                            name="Standard Hy-Line"
                                        />
                                    )}
                                    {activeMetric === 'Fi' && (
                                        <Line 
                                            yAxisId="left" 
                                            type="monotone" 
                                            dataKey="Fi Standard" 
                                            stroke="#94a3b8" 
                                            strokeWidth={1} 
                                            strokeDasharray="5 5" 
                                            dot={false} 
                                            name="Standard Hy-Line"
                                        />
                                    )}
                                    {activeMetric === 'EW' && (
                                        <Line 
                                            yAxisId="left" 
                                            type="monotone" 
                                            dataKey="EW Standard" 
                                            stroke="#94a3b8" 
                                            strokeWidth={1} 
                                            strokeDasharray="5 5" 
                                            dot={false} 
                                            name="Standard Hy-Line"
                                        />
                                    )}
                                    {activeMetric === 'FCR' && (
                                        <Line 
                                            yAxisId="left" 
                                            type="monotone" 
                                            dataKey="FCR Standard" 
                                            stroke="#94a3b8" 
                                            strokeWidth={1} 
                                            strokeDasharray="5 5" 
                                            dot={false} 
                                            name="Standard Hy-Line"
                                        />
                                    )}
                                </>
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
