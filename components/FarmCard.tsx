import React, { useState } from 'react';
import { Farm, Flock } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { AddFlockForm } from './AddFlockForm';
import { Bird, MapPin, PlusCircle } from 'lucide-react';

interface FarmCardProps {
    farm: Farm;
    flocks: Flock[];
    onAddFlock: (farmId: string, nameOrCode: string, entryDate: string, initialPopulation: number) => Promise<Flock>;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm, flocks, onAddFlock }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <Card>
            <CardHeader>
                <h3 className="text-xl font-semibold">{farm.name}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{farm.location}</span>
                </div>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold mb-3">Farm di Lokasi Ini:</h4>
                {flocks.length > 0 ? (
                    <ul className="space-y-2">
                        {flocks.map(flock => (
                            <li key={flock.id} className="flex items-center text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                                <Bird className="h-4 w-4 mr-3 text-green-500" />
                                <span>{flock.nameOrCode} - Populasi Awal: {flock.initialPopulation}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400 italic">Belum ada farm yang ditambahkan.</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {showAddForm ? (
                        <AddFlockForm 
                            farmId={farm.id} 
                            onAddFlock={onAddFlock}
                            onFlockAdded={() => setShowAddForm(false)}
                        />
                    ) : (
                        <Button variant="secondary" onClick={() => setShowAddForm(true)} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Farm
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
