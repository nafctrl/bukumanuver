/**
 * 🔍 MESIN PENCARI PINTAR (HOOK)
 * 
 * File ini bertugas sebagai "Otak Pencarian" untuk halaman Riwayat.
 * Tugasnya:
 * 1. Menerima daftar riwayat mentah.
 * 2. Melakukan filter berdasarkan kata kunci pencarian (Judul, Tanggal, Pengawas, dll).
 * 3. Mengatur urutan tampilan (Terbaru/Terlama).
 * 4. Membagi data menjadi halaman-halaman (Pagination) biar tidak berat.
 * 
 * File ini TIDAK mengurus tampilan, dia hanya mengolah data.
 */

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { RiwayatManuver } from '../types';

export function useRiwayatFilter(riwayatList: RiwayatManuver[]) {
    const supabase = createClient();

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [matchingRiwayatIds, setMatchingRiwayatIds] = useState<string[]>([]);
    const [filterBay, setFilterBay] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [displayCount, setDisplayCount] = useState(15);

    // Date formatting helpers
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatDateWithDay = (dateString: string) => {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${dayName}, ${day}/${month}/${year}`;
    };

    // 1. Search Logic (Debounced)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setMatchingRiwayatIds([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const query = searchQuery.toLowerCase();
            const matchingIds: string[] = [];

            for (const riwayat of riwayatList) {
                const { data } = await supabase
                    .from('riwayat_items')
                    .select('*')
                    .eq('riwayat_id', riwayat.id);
                const items = data || [];

                const hasMatch = items.some((item: any) => {
                    const namaPeralatan = item.nama_peralatan?.toLowerCase() || '';
                    const bay = item.bay?.toLowerCase() || '';
                    const extractedBay = namaPeralatan.split(' ').slice(-2).join(' ').toLowerCase();

                    return (
                        namaPeralatan.includes(query) ||
                        bay.includes(query) ||
                        extractedBay.includes(query)
                    );
                });

                if (hasMatch) {
                    matchingIds.push(riwayat.id);
                }
            }

            setMatchingRiwayatIds(matchingIds);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, riwayatList, supabase]);

    // 2. Filter Logic
    const filteredRiwayatList = useMemo(() => {
        return riwayatList.filter(riwayat => {
            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const formattedDate = formatDate(riwayat.tanggal).toLowerCase();
            const date = new Date(riwayat.tanggal);

            const monthNames: Record<number, string[]> = {
                0: ['januari', 'jan'], 1: ['februari', 'feb'], 2: ['maret', 'mar'],
                3: ['april', 'apr'], 4: ['mei', 'may'], 5: ['juni', 'jun'],
                6: ['juli', 'jul'], 7: ['agustus', 'agu', 'agt'], 8: ['september', 'sep'],
                9: ['oktober', 'okt', 'oct'], 10: ['november', 'nov'], 11: ['desember', 'des', 'dec']
            };

            const day = date.getDate().toString();
            const month = date.getMonth();
            const year = date.getFullYear().toString();
            const monthVariations = monthNames[month] || [];

            const queryTokens = query.split(/\s+/);
            const matchesDateFlexible = queryTokens.every(token => {
                return formattedDate.includes(token) ||
                    day === token ||
                    year.includes(token) ||
                    monthVariations.some((monthVar: string) => monthVar.includes(token) || token.includes(monthVar));
            });

            const matchesHeader =
                (riwayat.judul_manuver?.toLowerCase().includes(query)) ||
                (riwayat.kode_gardu?.toLowerCase().includes(query)) ||
                (riwayat.pengawas_pekerjaan?.toLowerCase().includes(query)) ||
                (riwayat.pengawas_k3?.toLowerCase().includes(query)) ||
                (riwayat.pengawas_manuver?.toLowerCase().includes(query)) ||
                (riwayat.pelaksana_manuver?.toLowerCase().includes(query)) ||
                (riwayat.dispatcher?.toLowerCase().includes(query)) ||
                (riwayat.tanggal?.includes(query)) ||
                matchesDateFlexible;

            const matchesItems = matchingRiwayatIds.includes(riwayat.id);

            return matchesHeader || matchesItems;
        });
    }, [riwayatList, searchQuery, matchingRiwayatIds]);

    // 3. Bay Filter
    const bayFilteredList = useMemo(() => {
        return filterBay
            ? filteredRiwayatList.filter(_riwayat => {
                // Bay filtering for real data happens on demand
                // Keep all items visible until proper async bay filtering is implemented
                return true;
            })
            : filteredRiwayatList;
    }, [filterBay, filteredRiwayatList]);

    // 4. Sorting
    const sortedList = useMemo(() => {
        return [...bayFilteredList].sort((a, b) => {
            const dateA = new Date(a.tanggal).getTime();
            const dateB = new Date(b.tanggal).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [bayFilteredList, sortOrder]);

    // 5. Pagination
    const displayedList = sortedList.slice(0, displayCount);
    const hasMore = sortedList.length > displayCount;

    const loadMore = () => {
        setDisplayCount(prev => prev + 15);
    };

    return {
        // States
        searchQuery, setSearchQuery,
        filterBay, setFilterBay,
        sortOrder, setSortOrder,

        // Data
        displayedList,
        sortedList,
        hasMore,

        // Actions
        loadMore,

        // Helpers
        formatDate,
        formatDateWithDay
    };
}
