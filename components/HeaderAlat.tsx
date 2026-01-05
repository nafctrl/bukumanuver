'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePeralatan } from '@/utils/hooks/usePeralatan';

interface HeaderStats {
    nama_gardu: string;
    total_bay: number;
    total_pms: number;
    total_pmt_150: number;
    total_pmt_20: number;
}

export default function HeaderAlat() {
    const { profile, isMaster } = useAuth();
    const { equipmentList, isLoading } = usePeralatan();

    // Calculate stats from cached equipment data (no extra fetch)
    const headerStats = useMemo<HeaderStats>(() => {
        if (equipmentList.length === 0) {
            const displayName = profile?.nama_gardu || `GI ${profile?.kode_gardu?.toUpperCase() || '...'}`;
            return {
                nama_gardu: isMaster ? 'Master (All GI)' : displayName,
                total_bay: 0,
                total_pms: 0,
                total_pmt_150: 0,
                total_pmt_20: 0,
            };
        }

        const uniqueBays = new Set(equipmentList.map(item => item.level_3));
        const pmsCount = equipmentList.filter(item => item.level_1 === 'PMS').length;
        const pmt150Count = equipmentList.filter(item => item.level_1 === 'PMT' && item.level_2?.includes('150')).length;
        const pmt20Count = equipmentList.filter(item => item.level_1 === 'PMT' && item.level_2?.includes('20')).length;

        const displayName = profile?.nama_gardu || `GI ${profile?.kode_gardu?.toUpperCase() || '...'}`;

        return {
            nama_gardu: isMaster ? 'Master (All GI)' : displayName,
            total_bay: uniqueBays.size,
            total_pms: pmsCount,
            total_pmt_150: pmt150Count,
            total_pmt_20: pmt20Count,
        };
    }, [equipmentList, profile, isMaster]);

    return (
        <>
            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Data Peralatan</h1>
                <Link
                    href="/"
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                    title="Menu Utama"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </Link>
            </header>

            {/* Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Gardu Induk</p>
                    <p className="text-lg font-bold text-orange-600 truncate">{headerStats.nama_gardu}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Total Bay</p>
                    <p className="text-lg font-bold text-gray-800">{isLoading ? '...' : headerStats.total_bay}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Total PMS</p>
                    <p className="text-lg font-bold text-gray-800">{isLoading ? '...' : headerStats.total_pms}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">PMT 150kV / 20kV</p>
                    <div className="flex gap-2 text-lg font-bold text-gray-800">
                        <span>{isLoading ? '...' : headerStats.total_pmt_150}</span>
                        <span className="text-gray-300">/</span>
                        <span>{isLoading ? '...' : headerStats.total_pmt_20}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
