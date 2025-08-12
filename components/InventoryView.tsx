
import React, { useState, useMemo } from 'react';
import { Archive, Package, Egg, Pill, Syringe, PlusCircle, Printer } from 'lucide-react';
import type { InventoryItem, InventorySummaryCategory, InventoryLogs, CombinedInventoryLog, InventoryTransactionType } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { InventoryModal } from './InventoryModal';
import { Button } from './ui/Button';
import { AddInventoryTransactionModal } from './AddInventoryTransactionModal';


interface InventoryViewProps {
  inventoryItems: InventoryItem[];
  logs: InventoryLogs;
  combinedLogs: CombinedInventoryLog[];
  onAddTransaction: (itemId: string, type: InventoryTransactionType, quantity: number, price: number, party: string, note: string) => Promise<void>;
}

const summaryCategories: InventorySummaryCategory[] = ['Pakan', 'Vaksin', 'Medikasi', 'Telur'];

const categoryDetails: Record<InventorySummaryCategory, { icon: React.ReactNode, bgColor: string }> = {
    'Pakan': { icon: <Package className="h-6 w-6 text-yellow-600" />, bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    'Vaksin': { icon: <Syringe className="h-6 w-6 text-blue-500" />, bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    'Medikasi': { icon: <Pill className="h-6 w-6 text-red-500" />, bgColor: 'bg-red-100 dark:bg-red-900/30' },
    'Telur': { icon: <Egg className="h-6 w-6 text-amber-500" />, bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
};

const mapItemTypeToSummary = (type: InventoryItem['type']): InventorySummaryCategory | null => {
    switch (type) {
        case 'Pakan': return 'Pakan';
        case 'Vaksin': return 'Vaksin';
        case 'Obat':
        case 'Vitamin': return 'Medikasi';
        case 'Telur': return 'Telur';
        default: return null;
    }
};

export const InventoryView: React.FC<InventoryViewProps> = ({ inventoryItems, logs, combinedLogs, onAddTransaction }) => {
    const [selectedCategory, setSelectedCategory] = useState<InventorySummaryCategory | null>(null);
    const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

    const groupedTotals = useMemo(() => {
        const initialTotals: Record<InventorySummaryCategory, number> = { 'Pakan': 0, 'Vaksin': 0, 'Medikasi': 0, 'Telur': 0 };
        return inventoryItems.reduce((acc, item) => {
            const category = mapItemTypeToSummary(item.type);
            if (category) {
                // For eggs, we sum trays, not individual eggs, assuming 1 item = 1 tray
                 if(item.unit === 'tray'){
                    acc[category] += item.quantity;
                 } else {
                    acc[category] += item.quantity;
                 }
            }
            return acc;
        }, initialTotals);
    }, [inventoryItems]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
            <div className="flex items-center gap-3">
            <Archive className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Manajemen Inventori</h2>
            </div>
             <Button onClick={() => setShowAddTransactionModal(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Tambah Transaksi
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        {summaryCategories.map(category => (
            <Card 
            key={category} 
            className={`${categoryDetails[category].bgColor} cursor-pointer hover:ring-2 hover:ring-green-500 transition-all duration-200`}
            onClick={() => setSelectedCategory(category)}
            >
            <CardHeader>
                <div className="flex items-center gap-4">
                {categoryDetails[category].icon}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Stok {category}</h3>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {groupedTotals[category].toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Total Kuantitas</p>
            </CardContent>
            </Card>
        ))}
        </div>
        
        <Card>
            <CardHeader className="flex justify-between items-center print:hidden">
                <h3 className="text-xl font-semibold">Log Transaksi Inventori</h3>
                <Button variant="secondary" onClick={() => window.print()}>
                    <Printer className="h-5 w-5" />
                    <span className="ml-2">Cetak Log</span>
                </Button>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Tanggal</th>
                                <th scope="col" className="px-4 py-3">Kategori</th>
                                <th scope="col" className="px-4 py-3">Nama Barang</th>
                                <th scope="col" className="px-4 py-3">Tipe</th>
                                <th scope="col" className="px-4 py-3">Jumlah</th>
                                <th scope="col" className="px-4 py-3">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinedLogs.map(log => (
                                <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-4">{new Date(log.tanggal).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                    <td className="px-4 py-4">{log.kategori}</td>
                                    <td className="px-4 py-4 font-medium">{log.namaBarang}</td>
                                    <td className={`px-4 py-4 font-semibold ${log.tipe === 'Masuk' ? 'text-green-500' : 'text-red-500'}`}>{log.tipe}</td>
                                    <td className="px-4 py-4">{log.jumlah.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-4 text-xs">{log.keterangan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

      </div>

      {selectedCategory && (
        <InventoryModal 
            category={selectedCategory}
            logs={logs}
            onClose={() => setSelectedCategory(null)}
        />
      )}

      {showAddTransactionModal && (
          <AddInventoryTransactionModal
            inventoryItems={inventoryItems}
            onClose={() => setShowAddTransactionModal(false)}
            onAddTransaction={onAddTransaction}
          />
      )}
    </>
  );
};
