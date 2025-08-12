
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X } from 'lucide-react';
import type { WorkforceMember, AttendanceStatus } from '../types';

interface AddAttendanceModalProps {
    workforce: WorkforceMember[];
    onClose: () => void;
    onSave: (records: { memberId: string, status: AttendanceStatus, notes?: string }[], date: string) => Promise<void>;
}

type AttendanceState = {
    [memberId: string]: {
        status: AttendanceStatus;
        notes?: string;
    }
}

const statusOptions: AttendanceStatus[] = ['Hadir', 'Sakit', 'Izin', 'Alpa'];

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ workforce, onClose, onSave }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState<AttendanceState>(() => {
        const initialState: AttendanceState = {};
        workforce.forEach(member => {
            initialState[member.id] = { status: 'Hadir', notes: '' };
        });
        return initialState;
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleStatusChange = (memberId: string, status: AttendanceStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [memberId]: { ...prev[memberId], status }
        }));
    };

    const handleNotesChange = (memberId: string, notes: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [memberId]: { ...prev[memberId], notes }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const recordsToSave = Object.entries(attendanceData).map(([memberId, data]) => ({
            memberId,
            status: data.status,
            notes: data.notes
        }));

        setIsLoading(true);
        setFeedback('');
        try {
            await onSave(recordsToSave, date);
            setFeedback('Absensi berhasil disimpan!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setFeedback('Gagal menyimpan absensi. Coba lagi.');
            console.error(error);
             setTimeout(() => setFeedback(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <Card className="max-h-[90vh] flex flex-col">
                        <CardHeader className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                            <div>
                                <h3 className="text-xl font-semibold">Catat Absensi Karyawan</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pilih tanggal dan update status kehadiran.</p>
                            </div>
                            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </CardHeader>
                        <CardContent className="overflow-y-auto space-y-4">
                            <Input
                                label="Tanggal Absensi"
                                id="attendance-date"
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                            <div className="space-y-3">
                                {workforce.map(member => (
                                    <div key={member.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{member.name}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                            {statusOptions.map(status => (
                                                <label key={status} className="flex items-center text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`status-${member.id}`}
                                                        value={status}
                                                        checked={attendanceData[member.id]?.status === status}
                                                        onChange={() => handleStatusChange(member.id, status)}
                                                        className="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2">{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                         {['Sakit', 'Izin', 'Alpa'].includes(attendanceData[member.id]?.status) && (
                                            <div className="mt-2">
                                                <Input 
                                                    id={`notes-${member.id}`}
                                                    type="text"
                                                    placeholder="Tambahkan keterangan..."
                                                    value={attendanceData[member.id]?.notes || ''}
                                                    onChange={e => handleNotesChange(member.id, e.target.value)}
                                                    className="text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center sticky bottom-0 bg-gray-50 dark:bg-gray-900/80 backdrop-blur-sm z-10">
                             <p className={`text-sm ${feedback.includes('berhasil') ? 'text-green-600' : 'text-red-500'}`}>{feedback}</p>
                            <Button type="submit" isLoading={isLoading}>
                                Simpan Absensi
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
};
