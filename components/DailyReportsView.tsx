
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
            setFeedback('Tanggal dan Kawanan harus diisi.');
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
                             <label htmlFor="flockId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Kawanan</label>
                            <select id="flockId" name="flockId" value={formData.flockId} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <option value="">-- Pilih Kawanan --</option>
                                {flocks.map(flock => <option key={flock.id} value={flock.id}>{flock.nameOrCode}</option>)}
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Deplesi */}
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center gap-2">{ICONS.DEPLETION} <h4 className="font-semibold">Deplesi</h4></CardHeader>
                        <CardContent className="space-y-4">
                            <Input label="Mati (ekor)" id="mortality" name="mortality" type="number" value={formData.mortality} onChange={handleInputChange} />
                            <Input label="Afkir (ekor)" id="cull" name="cull" type="number" value={formData.cull} onChange={handleInputChange} />
                        </CardContent>
                    </Card>
                     {/* Transfer */}
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center gap-2">{ICONS.TRANSFER} <h4 className="font-semibold">Transfer</h4></CardHeader>
                        <CardContent className="space-y-4">
                            <Input label="Masuk (ekor)" id="transferIn" name="transferIn" type="number" value={formData.transferIn} onChange={handleInputChange} />
                            <Input label="Keluar (ekor)" id="transferOut" name="transferOut" type="number" value={formData.transferOut} onChange={handleInputChange} />
                        </CardContent>
                    </Card>
                    {/* Produksi & Pertumbuhan */}
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center gap-2">{ICONS.PRODUCTION} <h4 className="font-semibold">Produksi & Pertumbuhan</h4></CardHeader>
                        <CardContent className="space-y-4">
                            <Input label="Produksi Telur (butir)" id="eggProduction" name="eggProduction" type="number" value={formData.eggProduction} onChange={handleInputChange} />
                            <Input label="Produksi Telur (kg)" id="eggWeight" name="eggWeight" type="number" step="0.1" value={formData.eggWeight} onChange={handleInputChange} />
                            <Input label="Timbang BB Rata-rata (kg)" id="averageBodyWeight" name="averageBodyWeight" type="number" step="0.01" value={formData.averageBodyWeight} onChange={handleInputChange} />
                        </CardContent>
                    </Card>
                    {/* Pakan */}
                    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                         <CardHeader className="flex flex-row items-center gap-2">{ICONS.FEED} <h4 className="font-semibold">Pakan</h4></CardHeader>
                         <CardContent className="space-y-4">
                            <select name="feedId" value={formData.feedId} onChange={handleInputChange} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <option value="">-- Tanpa Pakan --</option>
                                {feedItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                            <Input label="Konsumsi Pakan (kg)" id="feedConsumption" name="feedConsumption" type="number" step="0.1" value={formData.feedConsumption} onChange={handleInputChange} />
                         </CardContent>
                    </Card>
                    {/* Medikasi */}
                    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                         <CardHeader className="flex flex-row items-center gap-2">{ICONS.MEDICATION} <h4 className="font-semibold">Medikasi</h4></CardHeader>
                         <CardContent className="space-y-4">
                            <select name="medicationId" value={formData.medicationId} onChange={handleInputChange} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <option value="">-- Tanpa Medikasi --</option>
                                {medItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                            <Input label="Dosis" id="medicationDose" name="medicationDose" type="text" placeholder="cth: 1ml / 2L air" value={formData.medicationDose || ''} onChange={handleInputChange} />
                         </CardContent>
                    </Card>
                     {/* Catatan */}
                    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                         <CardHeader className="flex flex-row items-center gap-2">{ICONS.NOTES} <h4 className="font-semibold">Catatan</h4></CardHeader>
                         <CardContent>
                            <textarea name="notes" id="notes" rows={4} value={formData.notes || ''} onChange={handleInputChange} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Catatan observasi harian..."></textarea>
                         </CardContent>
                    </Card>
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