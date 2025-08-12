
import React from 'react';
import type { InventorySummaryCategory, InventoryLogs, PakanLog, VaksinLog, MedikasiLog, TelurLog } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { X } from 'lucide-react';

interface InventoryModalProps {
    category: InventorySummaryCategory;
    logs: InventoryLogs;
    onClose: () => void;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
const formatNumber = (num: number) => num.toLocaleString('id-ID');
const formatCurrency = (num: number) => num > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num) : '-';

const renderTable = (category: InventorySummaryCategory, logs: InventoryLogs) => {
    switch(category) {
        case 'Pakan':
            const pakanLogs = logs.pakan;
            return (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Tanggal</th>
                            <th scope="col" className="px-4 py-3">Kode Pakan</th>
                            <th scope="col" className="px-4 py-3">Masuk</th>
                            <th scope="col" className="px-4 py-3">Keluar</th>
                            <th scope="col" className="px-4 py-3">Stok</th>
                            <th scope="col" className="px-4 py-3">Supplier</th>
                            <th scope="col" className="px-4 py-3">Harga</th>
                            <th scope="col" className="px-4 py-3">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pakanLogs.map((log: PakanLog) => (
                            <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-2">{formatDate(log.tanggal)}</td>
                                <td className="px-4 py-2">{log.kodePakan}</td>
                                <td className="px-4 py-2">{formatNumber(log.masuk)}</td>
                                <td className="px-4 py-2">{formatNumber(log.keluar)}</td>
                                <td className="px-4 py-2 font-bold">{formatNumber(log.stok)}</td>
                                <td className="px-4 py-2">{log.supplier}</td>
                                <td className="px-4 py-2">{formatCurrency(log.harga)}</td>
                                <td className="px-4 py-2 text-xs">{log.note || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        case 'Vaksin':
        case 'Medikasi':
             const medLogs = category === 'Vaksin' ? logs.vaksin : logs.medikasi;
             return (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Tanggal</th>
                            <th scope="col" className="px-4 py-3">Nama Barang</th>
                            <th scope="col" className="px-4 py-3">Masuk</th>
                            <th scope="col" className="px-4 py-3">Keluar</th>
                            <th scope="col" className="px-4 py-3">Stok</th>
                            <th scope="col" className="px-4 py-3">Supplier</th>
                            <th scope="col" className="px-4 py-3">Harga</th>
                            <th scope="col" className="px-4 py-3">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medLogs.map((log: VaksinLog | MedikasiLog) => (
                            <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-2">{formatDate(log.tanggal)}</td>
                                <td className="px-4 py-2">{log.namaBarang}</td>
                                <td className="px-4 py-2">{formatNumber(log.masuk)}</td>
                                <td className="px-4 py-2">{formatNumber(log.keluar)}</td>
                                <td className="px-4 py-2 font-bold">{formatNumber(log.stok)}</td>
                                <td className="px-4 py-2">{log.supplier}</td>
                                <td className="px-4 py-2">{formatCurrency(log.harga)}</td>
                                <td className="px-4 py-2 text-xs">{log.note || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        case 'Telur':
            const telurLogs = logs.telur;
            return (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Tanggal</th>
                            <th scope="col" className="px-4 py-3">Masuk (butir)</th>
                            <th scope="col" className="px-4 py-3">Dari Kawanan</th>
                            <th scope="col" className="px-4 py-3">Keluar (butir)</th>
                            <th scope="col" className="px-4 py-3">Harga Jual</th>
                            <th scope="col" className="px-4 py-3">Customer</th>
                            <th scope="col" className="px-4 py-3">Stok</th>
                            <th scope="col" className="px-4 py-3">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {telurLogs.map((log: TelurLog) => (
                             <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-2">{formatDate(log.tanggal)}</td>
                                <td className="px-4 py-2">{formatNumber(log.masuk)}</td>
                                <td className="px-4 py-2">{log.flock}</td>
                                <td className="px-4 py-2">{formatNumber(log.keluar)}</td>
                                <td className="px-4 py-2">{formatCurrency(log.harga)}</td>
                                <td className="px-4 py-2">{log.customer}</td>
                                <td className="px-4 py-2 font-bold">{formatNumber(log.stok)}</td>
                                <td className="px-4 py-2 text-xs">{log.note || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        default:
            return <p>Kategori tidak dikenal.</p>
    }
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ category, logs, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden" onClick={onClose}>
            <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <Card className="max-h-[80vh] flex flex-col">
                    <CardHeader className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                        <h3 className="text-xl font-semibold">Riwayat Transaksi: Stok {category}</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X className="h-6 w-6" />
                        </button>
                    </CardHeader>
                    <CardContent className="overflow-y-auto">
                        {renderTable(category, logs)}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
