'use client';

import React, { useState } from 'react';
import HeaderForm from '@/components/HeaderForm';
import LogTable, { LogRow } from '@/components/LogTable';
import WhatsAppGenerator from '@/components/WhatsAppGenerator';
import Link from 'next/link';
import { generateId } from '@/utils/generateId';

export default function CatatPage() {
    const [headerData, setHeaderData] = useState({
        judul_manuver: '',
        tanggal: new Date().toISOString().split('T')[0],
        gardu_induk: 'GI Batang',
        pengawas_pekerjaan: '',
        pengawas_k3: '',
        pengawas_manuver: '',
        pelaksana_manuver: '',
        dispa: '',
    });

    const [logRows, setLogRows] = useState<LogRow[]>(() => {
        // Initial state: 3 empty rows (Client-side only to match requirement)
        if (typeof window !== 'undefined') {
            return Array.from({ length: 3 }).map(() => ({
                id: generateId(),
                nama_peralatan: '',
                posisi_switch: false,
                waktu: '',
                via: 'R.ACC',
            }));
        }
        return [];
    });

    // Hydration mismatch fix: ensure rows are populated after mount if empty
    React.useEffect(() => {
        if (logRows.length === 0) {
            setLogRows(Array.from({ length: 3 }).map(() => ({
                id: generateId(),
                nama_peralatan: '',
                posisi_switch: false,
                waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                via: 'R.ACC',
            })));
        }
    }, []);

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHeaderData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <main className="min-h-screen bg-[#fdfbf7] text-gray-800 p-2 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Catat Manuver</h1>
                    <div className="flex items-center gap-3">
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
                        <div className="hidden md:block">
                            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                                v1.0.0 Beta
                            </div>
                        </div>
                    </div>
                </header>

                <HeaderForm formData={headerData} onChange={handleHeaderChange} />

                <LogTable rows={logRows} setRows={setLogRows} />

                <WhatsAppGenerator header={headerData} rows={logRows} />

                <footer className="text-center text-gray-400 text-xs mt-12 pb-8">
                    &copy; {new Date().getFullYear()} ManuverLog. Designed for heavy-duty switching operations.
                </footer>
            </div>
        </main>
    );
}
