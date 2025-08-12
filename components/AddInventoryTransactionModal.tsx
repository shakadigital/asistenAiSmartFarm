
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X } from 'lucide-react';
import type { InventoryItem, InventorySummaryCategory, InventoryTransactionType } from '../types';

interface AddInventoryTransactionModalProps {
    inventoryItems: InventoryItem[];
    onClose: () => void;
    onAddTransaction: (itemId: string, type: InventoryTransactionType, quantity: number, price: number, party: string, note: string) => Promise<void>;
}

export const AddInventoryTransactionModal: React.FC<AddInventoryTransactionModalProps> = ({ inventoryItems, onClose, onAddTransaction }) => {
    const [category, setCategory] = useState<InventorySummaryCategory | ''>('');
    const [itemId, setItemId] = useState('');
    const [transactionType, setTransactionType] = useState<InventoryTransactionType>('Masuk');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [party, setParty] = useState(''); // Supplier or Customer
    const [note, setNote] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const filteredItems = useMemo(() => {
        if (!category) return [];
        return inventoryItems.filter(item => item.category === category);
    }, [category, inventoryItems]);

    const partyLabel = useMemo(() => {
        if (transactionType === 'Masuk') return 'Supplier';
        if (category === 'Telur') return 'Customer';
        return 'Keterangan';
    }, [transactionType, category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemId || !quantity) {
            setFeedback('Harap lengkapi semua bidang yang diperlukan.');
            return;
        }

        setIsLoading(true);
        setFeedback('');
        try {
            await onAddTransaction(itemId, transactionType, parseFloat(quantity), parseFloat(price || '0'), party, note);
            setFeedback('Transaksi berhasil ditambahkan!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setFeedback('Gagal menambahkan transaksi. Coba lagi.');
            console.error(error);
             setTimeout(() => setFeedback(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden" onClick={onClose}>
            <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Tambah Transaksi Inventori</h3>
                            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Transaction Type */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Transaksi</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="transactionType" value="Masuk" checked={transactionType === 'Masuk'} onChange={() => setTransactionType('Masuk')} className="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Stok Masuk</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="transactionType" value="Keluar" checked={transactionType === 'Keluar'} onChange={() => setTransactionType('Keluar')} className="form-radio h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Stok Keluar</span>
                                    </label>
                                </div>
                            </div>
                            {/* Category Select */}
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                <select id="category" value={category} onChange={e => {setCategory(e.target.value as InventorySummaryCategory); setItemId('');}} required className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                    <option value="">-- Pilih Kategori --</option>
                                    {['Pakan', 'Vaksin', 'Medikasi', 'Telur'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            {/* Item Select */}
                            {category && (
                                <div>
                                    <label htmlFor="item" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Barang</label>
                                    <select id="item" value={itemId} onChange={e => setItemId(e.target.value)} required disabled={filteredItems.length === 0} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                        <option value="">-- Pilih Barang --</option>
                                        {filteredItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                            )}
                             <Input id="quantity" label="Kuantitas" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="0.1" step="0.1" required />
                             <Input id="price" label="Harga Satuan (Rp)" type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" />
                             <Input id="party" label={partyLabel} type="text" value={party} onChange={e => setParty(e.target.value)} placeholder={transactionType === 'Masuk' ? 'Nama Supplier' : 'Tujuan/Customer/Keterangan'} />
                             <div>
                                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan</label>
                                 <textarea id="notes" value={note} onChange={e => setNote(e.target.value)} rows={3} className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Catatan tambahan..."></textarea>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                             <p className={`text-sm ${feedback.includes('berhasil') ? 'text-green-600' : 'text-red-500'}`}>{feedback}</p>
                            <Button type="submit" isLoading={isLoading} disabled={!itemId || !quantity}>
                                Simpan Transaksi
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
};
