
import React from 'react';
import { Farm, Flock, View } from '../types';
import { GitFork, PlusCircle } from 'lucide-react';
import { FarmCard } from './FarmCard';
import { Button } from './ui/Button';

interface FarmsViewProps {
  farms: Farm[];
  flocks: Flock[];
  onAddFlock: (farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number) => Promise<Flock>;
  onAddFarmClick: () => void;
}

export const FarmsView: React.FC<FarmsViewProps> = ({ farms, flocks, onAddFlock, onAddFarmClick }) => {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <GitFork className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Manajemen Peternakan</h2>
        </div>
        <Button onClick={onAddFarmClick}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Tambah Peternakan Baru
        </Button>
      </div>
      
      {farms.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {farms.map(farm => {
            const farmFlocks = flocks.filter(flock => flock.farmId === farm.id);
            return (
              <FarmCard 
                key={farm.id}
                farm={farm}
                flocks={farmFlocks}
                onAddFlock={onAddFlock}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-900/70 rounded-xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400">Belum ada peternakan yang ditambahkan.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Gunakan tombol 'Tambah Peternakan Baru' untuk memulai.</p>
        </div>
      )}
    </div>
  );
};
