
import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import type { WorkforceMember, WorkforceRole } from '../types';

interface AddWorkforceFormProps {
  onAddMember: (name: string, role: WorkforceRole, contact: string) => Promise<WorkforceMember>;
  onMemberAdded: () => void;
}

const roles: WorkforceRole[] = ['Manajer', 'Pekerja Lapangan', 'Dokter Hewan', 'Admin'];

export const AddWorkforceForm: React.FC<AddWorkforceFormProps> = ({ onAddMember, onMemberAdded }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<WorkforceRole>('Pekerja Lapangan');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !contact) return;

    setIsLoading(true);
    setFeedbackMessage('');
    try {
      await onAddMember(name, role, contact);
      setFeedbackMessage('Anggota tim berhasil ditambahkan!');
      
      setTimeout(() => {
        onMemberAdded();
      }, 1500);
    } catch (error) {
      setFeedbackMessage('Gagal menambahkan anggota. Coba lagi.');
      console.error(error);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <h3 className="text-xl font-semibold">Detail Anggota Tim Baru</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Masukkan informasi untuk anggota tim baru.</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    id="member-name"
                    label="Nama Lengkap"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    required
                />
                 <div>
                    <label htmlFor="member-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peran</label>
                    <select
                        id="member-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as WorkforceRole)}
                        className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        required
                    >
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <Input
                    id="member-contact"
                    label="Kontak (Telepon/Email)"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    required
                />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className={`text-sm ${feedbackMessage.includes('berhasil') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {feedbackMessage}
                </p>
                <Button type="submit" isLoading={isLoading} disabled={!name || !role || !contact}>
                    Simpan Anggota
                </Button>
            </CardFooter>
        </form>
    </Card>
  );
};
