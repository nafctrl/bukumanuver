'use client';

import React, { useState, useEffect } from 'react';
import HeaderForm from '@/components/HeaderForm';
import LogTable, { LogRow } from '@/components/LogTable';
import WhatsAppGenerator from '@/components/WhatsAppGenerator';
import Link from 'next/link';
import { generateId } from '@/utils/generateId';
import { APP_VERSION } from '@/components/ChangeLog';
import { createClient } from '@/utils/supabase/client';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function CatatPage() {
    const { profile } = useAuth();

    const [headerData, setHeaderData] = useState({
        judul_manuver: '',
        tanggal: new Date().toISOString().split('T')[0],
        kode_gardu: '',
        pengawas_pekerjaan: '',
        pengawas_k3: '',
        pengawas_manuver: '',
        pelaksana_manuver: '',
        dispa: '',
    });

    const [logRows, setLogRows] = useState<LogRow[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Update kode_gardu when profile is loaded - format: "GI 150 KV Batang"
    useEffect(() => {
        if (profile?.kode_gardu) {
            const formattedGardu = profile.nama_gardu || `GI 150 KV ${profile.kode_gardu.charAt(0).toUpperCase() + profile.kode_gardu.slice(1)}`;
            setHeaderData(prev => ({ ...prev, kode_gardu: formattedGardu }));
        }
    }, [profile]);

    // Initialize rows on client-side only to avoid hydration mismatch
    React.useEffect(() => {
        if (logRows.length === 0) {
            setLogRows(Array.from({ length: 3 }).map(() => ({
                id: generateId(),
                nama_peralatan: '',
                posisi_switch: false,
                waktu: '',
                via: 'R.ACC',
            })));
        }
    }, []);

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHeaderData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSaveManuver = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const supabase = createClient();

            // 1. Insert header ke riwayat_manuver
            const { data: riwayatData, error: riwayatError } = await supabase
                .from('riwayat_manuver')
                .insert({
                    judul_manuver: headerData.judul_manuver,
                    tanggal: headerData.tanggal,
                    kode_gardu: profile?.kode_gardu || 'unknown', // Use actual kode_gardu, not display name
                    pengawas_pekerjaan: headerData.pengawas_pekerjaan,
                    pengawas_k3: headerData.pengawas_k3,
                    pengawas_manuver: headerData.pengawas_manuver,
                    pelaksana_manuver: headerData.pelaksana_manuver,
                    dispatcher: headerData.dispa,
                })
                .select('id')
                .single();

            if (riwayatError) {
                throw new Error(`Gagal menyimpan header: ${riwayatError.message}`);
            }

            const riwayatId = riwayatData.id;

            // 2. Insert items ke riwayat_items
            const itemsToInsert = logRows
                .filter(row => row.nama_peralatan || row.isSeparator) // Only insert rows with data or separators
                .map((row, index) => ({
                    riwayat_id: riwayatId,
                    nama_peralatan: row.nama_peralatan,
                    posisi_switch: row.posisi_switch,
                    waktu: row.waktu,
                    act: row.via,
                    order_index: index,
                    is_separator: row.isSeparator || false,
                }));

            if (itemsToInsert.length > 0) {
                const { error: itemsError } = await supabase
                    .from('riwayat_items')
                    .insert(itemsToInsert);

                if (itemsError) {
                    throw new Error(`Gagal menyimpan items: ${itemsError.message}`);
                }
            }

            setSaveMessage({ type: 'success', text: 'Tersimpan!' });

            // Clear message after 3 seconds
            setTimeout(() => setSaveMessage(null), 3000);

        } catch (error: any) {
            setSaveMessage({ type: 'error', text: error.message || 'Gagal menyimpan.' });
        } finally {
            setIsSaving(false);
        }
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
                                {APP_VERSION}
                            </div>
                        </div>
                    </div>
                </header>

                <HeaderForm formData={headerData} onChange={handleHeaderChange} />

                <LogTable rows={logRows} setRows={setLogRows} />

                {/* Simpan Manuver - Minimalist button below table */}
                <div className="flex items-center justify-end gap-3 mb-8 -mt-2 px-6">
                    {saveMessage && (
                        <span className={`text-sm font-medium ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {saveMessage.text}
                        </span>
                    )}
                    <button
                        onClick={handleSaveManuver}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isSaving
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                            }`}
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan manuver'}
                    </button>
                </div>

                <WhatsAppGenerator header={headerData} rows={logRows} />

                {/* Quick Links */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 mb-8">
                    <Link
                        href="/peralatan"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 active:text-orange-700 transition-colors"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        Tambahkan peralatan
                    </Link>

                    <Link
                        href="/riwayat"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 active:text-orange-700 transition-colors"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        Riwayat manuver
                    </Link>
                </div>

                <Footer />
            </div>
        </main>
    );
}
