
import React, { useState } from 'react';
import { BookCopy } from 'lucide-react';
import type { DailyRecord, Flock, InventoryItem } from '../types';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ICONS } from '../constants';

interface DailyReportsViewProps {
  dailyRecords: DailyRecord[];
  flocks: Flock[];
  inventoryItems: InventoryItem[];
  onAddRecord: (record: Omit<DailyRecord, 'id'>) => Promise<DailyRecord>;
}

const initialFormState = {
    flockId: '',
    recordDate: new Date().toISOString().split('T')[0],
    mortality: 0,
    cull: 0,
    transferIn: 0,
    transferOut: 0,
    eggProduction: 0,
    eggWeight: 0,
    averageBodyWeight: 0,
    feedId: '',
    feedConsumption: 0,
    medicationId: '',
    medicationDose: '',
    notes: '',
};

export const DailyReportsView: React.FC<DailyReportsViewProps> = ({ dailyRecords, flocks, inventoryItems, onAddRecord }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') ? value : (e.target.type === 'number' ? parseFloat(value) || 0 : value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.flockId || !formData.recordDate) {
            setFeedback('Tanggal dan Farm harus diisi.');
            return;
        }

        setIsLoading(true);
        setFeedback('');
        try {
            await onAddRecord({
                ...formData,
                feedId: formData.feedId || null,
                medicationId: formData.medicationId || null,
                medicationDose: formData.medicationDose || null,
                notes: formData.notes || null,
            });
            setFeedback('Laporan harian berhasil disimpan!');
            setFormData({ ...initialFormState, recordDate: formData.recordDate }); // Reset form but keep date
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback('Gagal menyimpan laporan. Coba lagi.');
            setTimeout(() => setFeedback(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };
    
    const feedItems = inventoryItems.filter(item => item.type === 'Pakan');
    const medItems = inventoryItems.filter(item => ['Obat', 'Vitamin', 'Vaksin'].includes(item.type));

    const calculateAge = (entryDateStr: string, recordDateStr: string) => {
        if (!entryDateStr || !recordDateStr) return '-';
        const entryDate = new Date(entryDateStr);
        const recordDate = new Date(recordDateStr);
        const diffTime = Math.abs(recordDate.getTime() - entryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <BookCopy className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Input Laporan Harian</h2>
        </div>
      
        <Card className="print:hidden">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Tanggal Laporan"
                            id="recordDate"
                            name="recordDate"
                            type="date"
                            value={formData.recordDate}
                            onChange={handleInputChange}
                            required
                        />
                        <div>
                             <label htmlFor="flockId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Farm</label>
                            <select id="flockId" name="flockId" value={formData.flockId} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <option value="">-- Pilih Farm --</option>
                                {flocks.map(flock => <option key={flock.id} value={flock.id}>{flock.nameOrCode}</option>)}
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-xs">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-600">
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Kandang</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Umur (mg/hr)</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={2}>Deplesi</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={2}>Transfer</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={2}>Pakan</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={6}>Produksi</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={2}>Medikasi</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Catatan</th>
                                </tr>
                                <tr className="bg-gray-100 dark:bg-gray-600">
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Mati</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Afkir</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Masuk</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Keluar</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Kode</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Jumlah</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Normal</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Kilo</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Putih</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Kilo</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Retak</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Kilo</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Item</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold text-gray-700 dark:text-gray-300">Dosis</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white dark:bg-gray-800">
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <select
                                            name="flockId"
                                            value={formData.flockId}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">-- Pilih --</option>
                                            {flocks.map(flock => <option key={flock.id} value={flock.id}>{flock.nameOrCode}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            id="mortality"
                                            name="mortality"
                                            value={formData.mortality}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            id="cull"
                                            name="cull"
                                            value={formData.cull}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            id="transferIn"
                                            name="transferIn"
                                            value={formData.transferIn}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            id="transferOut"
                                            name="transferOut"
                                            value={formData.transferOut}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <select
                                            name="feedId"
                                            value={formData.feedId}
                                            onChange={handleInputChange}
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">--</option>
                                            {feedItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            step="0.1"
                                            id="feedConsumption"
                                            name="feedConsumption"
                                            value={formData.feedConsumption}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            id="eggProduction"
                                            name="eggProduction"
                                            value={formData.eggProduction}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            step="0.1"
                                            id="eggWeight"
                                            name="eggWeight"
                                            value={formData.eggWeight}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <select
                                            name="medicationId"
                                            value={formData.medicationId}
                                            onChange={handleInputChange}
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">--</option>
                                            {medItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <input
                                            type="text"
                                            id="medicationDose"
                                            name="medicationDose"
                                            placeholder="Dosis"
                                            value={formData.medicationDose || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={2}
                                            value={formData.notes || ''}
                                            onChange={handleInputChange}
                                            placeholder="Catatan..."
                                            className="w-full px-1 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-green-500 focus:border-green-500 resize-none"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p className={`text-sm ${feedback.includes('berhasil') ? 'text-green-600' : 'text-red-500'}`}>{feedback}</p>
                    <Button type="submit" isLoading={isLoading}>Simpan Laporan</Button>
                </CardFooter>
            </form>
        </Card>

        <Card>
            <CardHeader className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Log Laporan Harian</h3>
                <Button variant="secondary" onClick={() => window.print()} className="print:hidden">
                    {ICONS.PRINTER}
                    <span className="ml-2">Cetak Laporan</span>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Tanggal</th>
                                <th scope="col" className="px-4 py-3">Kandang</th>
                                <th scope="col" className="px-4 py-3">Umur (hari)</th>
                                <th scope="col" className="px-4 py-3">Deplesi (mt/af)</th>
                                <th scope="col" className="px-4 py-3">Kode Pakan</th>
                                <th scope="col" className="px-4 py-3">Kilo</th>
                                <th scope="col" className="px-4 py-3">Telur (butir)</th>
                                <th scope="col" className="px-4 py-3">Telur (kg)</th>
                                <th scope="col" className="px-4 py-3">Medikasi</th>
                                <th scope="col" className="px-4 py-3">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyRecords.map(record => {
                                const flock = flocks.find(f => f.id === record.flockId);
                                const feed = inventoryItems.find(i => i.id === record.feedId);
                                const medication = inventoryItems.find(i => i.id === record.medicationId);
                                return (
                                <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-4">{new Date(record.recordDate).toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: 'numeric'})}</td>
                                    <td className="px-4 py-4">{flock?.nameOrCode || 'N/A'}</td>
                                    <td className="px-4 py-4">{flock ? calculateAge(flock.entryDate, record.recordDate) : '-'}</td>
                                    <td className="px-4 py-4">{record.mortality} / {record.cull}</td>
                                    <td className="px-4 py-4">{feed?.name || '-'}</td>
                                    <td className="px-4 py-4">{record.feedConsumption}</td>
                                    <td className="px-4 py-4">{record.eggProduction.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-4">{record.eggWeight}</td>
                                    <td className="px-4 py-4">{medication?.name || '-'}</td>
                                    <td className="px-4 py-4 text-xs">{record.notes || '-'}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};