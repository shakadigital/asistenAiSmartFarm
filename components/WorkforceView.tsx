
import React, { useState } from 'react';
import { Users, PlusCircle, UserCog, Stethoscope, HardHat, Trophy } from 'lucide-react';
import type { WorkforceMember, WorkforceRole, WorkforceKPIs, AttendanceLog } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { AddWorkforceForm } from './AddWorkforceForm';
import { AddAttendanceModal } from './AddAttendanceModal';
import { ICONS } from '../constants';

interface WorkforceViewProps {
  workforce: WorkforceMember[];
  kpis: WorkforceKPIs;
  attendanceLogs: AttendanceLog[];
  onAddMember: (name: string, role: WorkforceRole, contact: string) => Promise<WorkforceMember>;
  onAddAttendance: (records: { memberId: string, status: any, notes?: string }[], date: string) => Promise<void>;
}

const roleIcons: Record<WorkforceRole, React.ReactNode> = {
    'Manajer': <UserCog className="h-6 w-6 text-blue-500" />,
    'Admin': <UserCog className="h-6 w-6 text-indigo-500" />,
    'Dokter Hewan': <Stethoscope className="h-6 w-6 text-red-500" />,
    'Pekerja Lapangan': <HardHat className="h-6 w-6 text-yellow-600" />,
};

const statusColors: Record<string, string> = {
    Hadir: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Sakit: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Izin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Alpa: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};


const KPICard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, description: string }> = ({ icon, title, value, description }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">{title}</h3>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </CardContent>
    </Card>
);

export const WorkforceView: React.FC<WorkforceViewProps> = ({ workforce, kpis, attendanceLogs, onAddMember, onAddAttendance }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Manajemen Tenaga Kerja</h2>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowAddForm(!showAddForm)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {showAddForm ? 'Tutup Formulir' : 'Tambah Karyawan'}
            </Button>
            <Button onClick={() => setShowAttendanceModal(true)}>
                {ICONS.ADD_ATTENDANCE}
                Catat Absensi
            </Button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="mb-6">
            <AddWorkforceForm 
                onAddMember={onAddMember}
                onMemberAdded={() => setShowAddForm(false)}
            />
        </div>
      )}

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard icon={<Users className="h-4 w-4 text-gray-500" />} title="Total Tenaga Kerja" value={kpis.totalWorkforce} description="Jumlah total karyawan aktif" />
            <KPICard icon={ICONS.ATTENDANCE_TODAY} title="Kehadiran Hari Ini" value={kpis.attendanceToday} description="Jumlah karyawan yang hadir hari ini" />
            <KPICard icon={ICONS.ACHIEVEMENT} title="Total Pencapaian" value={kpis.totalAchievements} description="Akumulasi poin pencapaian tim" />
            <KPICard icon={ICONS.ABSENT_MONTH} title="Absensi Bulan Ini" value={kpis.absentThisMonth} description="Jumlah absensi (Alpa) bulan ini" />
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workforce.map(member => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {roleIcons[member.role]}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Trophy className="h-4 w-4"/>
                    <span className="font-bold">{member.achievements}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Kontak:</span> {member.contact}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card>
            <CardHeader>
                <h3 className="text-xl font-semibold">Log Absensi</h3>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-3">Tanggal</th>
                                <th scope="col" className="px-4 py-3">Nama Karyawan</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceLogs.map(log => {
                                const member = workforce.find(w => w.id === log.workforceMemberId);
                                return (
                                <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3">{new Date(log.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                    <td className="px-4 py-3 font-medium">{member?.name || 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[log.status] || ''}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs">{log.notes || '-'}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

      {showAttendanceModal && (
        <AddAttendanceModal
            workforce={workforce}
            onClose={() => setShowAttendanceModal(false)}
            onSave={onAddAttendance}
        />
      )}
    </div>
  );
};
