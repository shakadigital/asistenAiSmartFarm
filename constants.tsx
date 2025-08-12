
import React from 'react';
import { LayoutDashboard, Settings, GitFork, BookCopy, PlusCircle, Archive, BarChart2, Users, Skull, ArrowRightLeft, Wheat, Pill, Clipboard, Egg, Printer, Trophy, CalendarCheck, CalendarX, CalendarPlus } from 'lucide-react';

export const ICONS = {
    DASHBOARD: <LayoutDashboard className="h-5 w-5" />,
    FARMS: <GitFork className="h-5 w-5" />,
    ADD_FARM: <PlusCircle className="h-5 w-5" />,
    DAILY_REPORTS: <BookCopy className="h-5 w-5" />,
    INVENTORY: <Archive className="h-5 w-5" />,
    WORKFORCE: <Users className="h-5 w-5" />,
    ANALYSIS: <BarChart2 className="h-5 w-5" />,
    SETTINGS: <Settings className="h-5 w-5" />,
    PRINTER: <Printer className="h-5 w-5" />,
    // Ikon untuk Kartu Laporan Harian
    DEPLETION: <Skull className="h-5 w-5 text-red-500" />,
    TRANSFER: <ArrowRightLeft className="h-5 w-5 text-blue-500" />,
    FEED: <Wheat className="h-5 w-5 text-yellow-600" />,
    MEDICATION: <Pill className="h-5 w-5 text-purple-500" />,
    NOTES: <Clipboard className="h-5 w-5 text-gray-500" />,
    PRODUCTION: <Egg className="h-5 w-5 text-amber-500" />,
    // Ikon untuk KPI Tenaga Kerja
    ACHIEVEMENT: <Trophy className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
    ATTENDANCE_TODAY: <CalendarCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
    ABSENT_MONTH: <CalendarX className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
    ADD_ATTENDANCE: <CalendarPlus className="mr-2 h-5 w-5" />,
};
