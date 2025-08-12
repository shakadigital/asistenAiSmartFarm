import React, { useState, useEffect, useRef } from 'react';
import type { Organization } from '../types';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { UploadCloud } from 'lucide-react';

interface SettingsProps {
  organization: Organization | null;
  onUpdate: (name: string, logoFile?: File) => Promise<Organization>;
}

export const Settings: React.FC<SettingsProps> = ({ organization, onUpdate }) => {
  const [name, setName] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setLogoPreview(organization.logoUrl);
    }
  }, [organization]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setIsLoading(true);
    setFeedbackMessage('');
    try {
      await onUpdate(name, logoFile || undefined);
      setFeedbackMessage('Perubahan berhasil disimpan!');
      setLogoFile(null); // Reset file after successful upload
    } catch (error) {
      setFeedbackMessage('Gagal menyimpan perubahan. Silakan coba lagi.');
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  if (!organization) {
    return <div>Memuat pengaturan...</div>;
  }

  return (
    <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white mb-6">Pengaturan</h2>
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Profil Organisasi</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Perbarui nama dan logo organisasi Anda.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Input
                        id="org-name"
                        label="Nama Organisasi"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Logo Organisasi
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                            <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Pratinjau logo" className="h-full w-full object-cover" />
                                ) : (
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </span>
                            <Button type="button" variant="secondary" onClick={handleFileClick}>
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Ubah Logo
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-green-600 dark:text-green-400">{feedbackMessage}</p>
                    <Button type="submit" isLoading={isLoading}>
                        Simpan Perubahan
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
};