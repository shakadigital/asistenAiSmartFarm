import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Farm } from '../types';
import { PlusCircle } from 'lucide-react';

interface AddFarmProps {
  onAddFarm: (name: string, location: string) => Promise<Farm>;
  onFarmAdded: () => void;
}

export const AddFarm: React.FC<AddFarmProps> = ({ onAddFarm, onFarmAdded }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    setIsLoading(true);
    setFeedbackMessage('');
    try {
      await onAddFarm(name, location);
              setFeedbackMessage('Lokasi berhasil ditambahkan!');
      setName('');
      setLocation('');
      setTimeout(() => {
        onFarmAdded(); // Navigate back to dashboard
      }, 1500);
    } catch (error) {
              setFeedbackMessage('Gagal menambahkan lokasi. Silakan coba lagi.');
      console.error(error);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white mb-6">Tambah Lokasi Baru</h2>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h3 className="text-xl font-semibold">Detail Lokasi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Masukkan informasi untuk lokasi baru Anda.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              id="farm-name"
              label="Nama Lokasi"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Lokasi Sentosa"
              required
            />
            <Input
              id="farm-location"
              label="Lokasi"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Kabupaten Bogor, Jawa Barat"
              required
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className={`text-sm ${feedbackMessage.includes('berhasil') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{feedbackMessage}</p>
            <Button type="submit" isLoading={isLoading} disabled={!name || !location}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Tambah Lokasi
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};