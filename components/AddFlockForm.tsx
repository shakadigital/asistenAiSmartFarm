import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Flock } from '../types';

interface AddFlockFormProps {
  farmId: string;
  onAddFlock: (farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number) => Promise<Flock>;
  onFlockAdded: () => void;
}

export const AddFlockForm: React.FC<AddFlockFormProps> = ({ farmId, onAddFlock, onFlockAdded }) => {
  const [nameOrCode, setNameOrCode] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [initialPopulation, setInitialPopulation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameOrCode || !entryDate || !initialPopulation) return;

    setIsLoading(true);
    setFeedbackMessage('');
    try {
      await onAddFlock(farmId, nameOrCode, entryDate, parseInt(initialPopulation, 10));
                  setFeedbackMessage('Farm berhasil ditambahkan!');
      
      setTimeout(() => {
        onFlockAdded();
      }, 1500);
    } catch (error) {
              setFeedbackMessage('Gagal menambahkan farm. Coba lagi.');
      console.error(error);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
                    <h4 className="font-semibold text-md mb-3">Tambah Farm Baru</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                id={`flock-name-${farmId}`}
                label="Nama/Kode Farm"
                type="text"
                value={nameOrCode}
                onChange={(e) => setNameOrCode(e.target.value)}
                placeholder="Contoh: Farm C-303"
                required
            />
            <Input
                id={`flock-date-${farmId}`}
                label="Tanggal Masuk"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                required
            />
            <Input
                id={`flock-pop-${farmId}`}
                label="Populasi Awal"
                type="number"
                value={initialPopulation}
                onChange={(e) => setInitialPopulation(e.target.value)}
                placeholder="Contoh: 5000"
                min="1"
                required
            />
            <div className="flex justify-between items-center gap-4">
                <p className={`text-sm flex-1 ${feedbackMessage.includes('berhasil') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {feedbackMessage}
                </p>
                <Button type="submit" isLoading={isLoading} disabled={!nameOrCode || !entryDate || !initialPopulation}>
                    Simpan Farm
                </Button>
            </div>
        </form>
    </div>
  );
};
