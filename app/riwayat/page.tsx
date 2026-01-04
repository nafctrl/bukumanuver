'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_VERSION } from '@/components/ChangeLog';
import Footer from '@/components/Footer';
import CascadingDropdown from '@/components/CascadingDropdown';
import TimePicker from '@/components/TimePicker';
import { generateId } from '@/utils/generateId';
import { DUMMY_RIWAYAT_DATA } from '@/utils/dummyRiwayatData';
import { DUMMY_RIWAYAT_ITEMS } from '@/utils/dummyRiwayatItems';
// Extracted components
import { BayCell } from './components/BayCell';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ConfirmClearModal } from './components/ConfirmClearModal';
import { DetailModal } from './components/DetailModal';
// Custom hooks
import { useBayExtraction } from './hooks/useBayExtraction';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useRiwayatHistory } from './hooks/useRiwayatHistory';

interface RiwayatManuver {
    id: string;
    judul_manuver: string;
    tanggal: string;
    gardu_induk: string;
    pengawas_pekerjaan: string;
    pengawas_k3: string;
    pengawas_manuver: string;
    pelaksana_manuver: string;
    dispatcher: string;
    created_at: string;
}

interface RiwayatItem {
    id: string;
    nama_peralatan: string;
    posisi_switch: boolean;
    waktu: string;
    act: string;
    order_index: number;
    is_separator: boolean;
}

export default function RiwayatPage() {
    const [riwayatList, setRiwayatList] = useState<RiwayatManuver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRiwayat, setSelectedRiwayat] = useState<RiwayatManuver | null>(null);
    const [selectedItems, setSelectedItems] = useState<RiwayatItem[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedHeader, setEditedHeader] = useState<RiwayatManuver | null>(null);
    const [editedItems, setEditedItems] = useState<RiwayatItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [matchingRiwayatIds, setMatchingRiwayatIds] = useState<string[]>([]);

    // UI State
    const [isClearing, setIsClearing] = useState(false);
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);
    const [filterBay, setFilterBay] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default: newest first
    const [displayCount, setDisplayCount] = useState(15); // Show 15 items initially

    const supabase = createClient();

    // Custom hooks
    const { showScrollTop, scrollToTop } = useScrollToTop();
    const { history, addToHistory, undo, isUndoing, canUndo } = useRiwayatHistory(async (item) => {
        // Restore callback: add back to list and insert to DB if not dummy
        setRiwayatList(prev => [...prev, item]);
        if (!item.id.startsWith('dummy-')) {
            const { error } = await supabase.from('riwayat_manuver').insert([item]);
            if (error) throw error;
        }
    });

    useEffect(() => {
        fetchRiwayat();
    }, []);

    const fetchRiwayat = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('riwayat_manuver')
            .select('*')
            .order('created_at', { ascending: false });

        // Merge database data with dummy data (comment out DUMMY_RIWAYAT_DATA to disable)
        const allData = [...DUMMY_RIWAYAT_DATA, ...(data || [])];

        if (!error) {
            setRiwayatList(allData);
        }
        setIsLoading(false);
    };

    const fetchItems = async (riwayatId: string) => {
        setIsLoadingItems(true);

        // If dummy data, use dummy items
        if (riwayatId.startsWith('dummy-')) {
            const dummyItems = DUMMY_RIWAYAT_ITEMS[riwayatId] || [];
            setSelectedItems(dummyItems);
            setEditedItems(dummyItems);
            setIsLoadingItems(false);
            return;
        }

        // Otherwise fetch from database
        const { data, error } = await supabase
            .from('riwayat_items')
            .select('*')
            .eq('riwayat_id', riwayatId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setSelectedItems(data);
            setEditedItems(data);
        }
        setIsLoadingItems(false);
    };

    const handleViewDetail = async (riwayat: RiwayatManuver) => {
        setSelectedRiwayat(riwayat);
        await fetchItems(riwayat.id);
    };

    const handleCloseDetail = () => {
        setSelectedRiwayat(null);
        setSelectedItems([]);
        setIsEditMode(false);
        setEditedHeader(null);
        setEditedItems([]);
    };

    const handleDelete = async (id: string) => {
        const itemToDelete = riwayatList.find(r => r.id === id);
        if (!itemToDelete) return;

        // Only delete from database if it's not a dummy item
        if (!id.startsWith('dummy-')) {
            const { error } = await supabase
                .from('riwayat_manuver')
                .delete()
                .eq('id', id);

            if (error) return;
        }

        // Add to history for undo
        addToHistory(itemToDelete);
        setRiwayatList(riwayatList.filter(r => r.id !== id));
    };



    const handleClearAll = async () => {
        if (riwayatList.length === 0 || isClearing) return;

        setIsClearing(true);

        // Delete only non-dummy items from database
        const realItems = riwayatList.filter(r => !r.id.startsWith('dummy-'));
        if (realItems.length > 0) {
            const realIds = realItems.map(r => r.id);
            const { error } = await supabase
                .from('riwayat_manuver')
                .delete()
                .in('id', realIds);

            if (error) {
                setIsClearing(false);
                return;
            }
        }

        // Clear all from UI (dummy will come back on refresh)
        setRiwayatList([]);

        setIsClearing(false);
        setConfirmClearOpen(false);
    };

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

    // === Edit Mode Handlers ===
    const handleEnableEdit = () => {
        if (!selectedRiwayat) return;
        setIsEditMode(true);
        setEditedHeader({ ...selectedRiwayat });
        setEditedItems([...selectedItems]);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditedHeader(null);
        setEditedItems([]);
    };

    const handleSaveChanges = async () => {
        if (!selectedRiwayat || !editedHeader) return;

        setIsSaving(true);
        try {
            // 1. Update header
            const { error: headerError } = await supabase
                .from('riwayat_manuver')
                .update({
                    judul_manuver: editedHeader.judul_manuver,
                    tanggal: editedHeader.tanggal,
                    gardu_induk: editedHeader.gardu_induk,
                    pengawas_pekerjaan: editedHeader.pengawas_pekerjaan,
                    pengawas_k3: editedHeader.pengawas_k3,
                    pengawas_manuver: editedHeader.pengawas_manuver,
                    pelaksana_manuver: editedHeader.pelaksana_manuver,
                    dispatcher: editedHeader.dispatcher,
                })
                .eq('id', selectedRiwayat.id);

            if (headerError) throw headerError;

            // 2. Delete existing items
            const { error: deleteError } = await supabase
                .from('riwayat_items')
                .delete()
                .eq('riwayat_id', selectedRiwayat.id);

            if (deleteError) throw deleteError;

            // 3. Insert updated items
            const itemsToInsert = editedItems
                .filter(item => item.nama_peralatan || item.is_separator)
                .map((item, index) => ({
                    riwayat_id: selectedRiwayat.id,
                    nama_peralatan: item.nama_peralatan,
                    posisi_switch: item.posisi_switch,
                    waktu: item.waktu,
                    act: item.act,
                    order_index: index,
                    is_separator: item.is_separator || false,
                }));

            if (itemsToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('riwayat_items')
                    .insert(itemsToInsert);

                if (insertError) throw insertError;
            }

            // 4. Update local state
            setSelectedRiwayat(editedHeader);
            await fetchItems(selectedRiwayat.id);
            await fetchRiwayat(); // Refresh list

            setIsEditMode(false);
            setEditedHeader(null);
            setEditedItems([]);
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Gagal menyimpan perubahan. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const updateEditedItem = (id: string, field: keyof RiwayatItem, value: any) => {
        setEditedItems(editedItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const deleteEditedItem = (id: string) => {
        setEditedItems(editedItems.filter(item => item.id !== id));
    };

    const addNewItem = () => {
        const newItem: RiwayatItem = {
            id: generateId(),
            nama_peralatan: '',
            posisi_switch: false,
            waktu: '',
            act: 'R.ACC',
            order_index: editedItems.length,
            is_separator: false,
        };
        setEditedItems([...editedItems, newItem]);
    };

    const toggleEditedPosition = (id: string, currentPos: boolean) => {
        updateEditedItem(id, 'posisi_switch', !currentPos);
    };

    // Search handler with debounce for item search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setMatchingRiwayatIds([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            const query = searchQuery.toLowerCase();
            const matchingIds: string[] = [];

            // Search through all riwayat
            for (const riwayat of riwayatList) {
                let items: any[] = [];

                // Get items based on data type
                if (riwayat.id.startsWith('dummy-')) {
                    items = DUMMY_RIWAYAT_ITEMS[riwayat.id] || [];
                } else {
                    const { data } = await supabase
                        .from('riwayat_items')
                        .select('*')
                        .eq('riwayat_id', riwayat.id);
                    items = data || [];
                }

                // Check if any item matches the search query
                const hasMatch = items.some(item => {
                    const namaPeralatan = item.nama_peralatan?.toLowerCase() || '';
                    const bay = item.bay?.toLowerCase() || '';

                    // Extract bay from nama_peralatan if bay field doesn't exist
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
    }, [searchQuery, riwayatList]);

    // Helper function to extract unique bay names from items
    const extractBaysFromItems = async (riwayatId: string): Promise<string[]> => {
        if (riwayatId.startsWith('dummy-')) {
            const dummyItems = DUMMY_RIWAYAT_ITEMS[riwayatId] || [];
            const bays = dummyItems
                .map(item => {
                    // Extract bay from equipment name (e.g., "PMS BUS A PEKALONGAN 1" → "PEKALONGAN 1")
                    const parts = item.nama_peralatan.split(' ');
                    return parts.slice(-2).join(' '); // Last 2 words typically are bay name
                })
                .filter((bay, index, self) => bay && self.indexOf(bay) === index); // Unique only
            return bays;
        } else {
            const { data } = await supabase
                .from('riwayat_items')
                .select('nama_peralatan')
                .eq('riwayat_id', riwayatId);

            const bays = (data || [])
                .map(item => {
                    const parts = item.nama_peralatan.split(' ');
                    return parts.slice(-2).join(' ');
                })
                .filter((bay, index, self) => bay && self.indexOf(bay) === index);
            return bays;
        }
    };

    // Filter riwayat list based on search query
    const filteredRiwayatList = riwayatList.filter(riwayat => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();

        // Format date for searching (e.g., "23 Mar 2026")
        const formattedDate = formatDate(riwayat.tanggal).toLowerCase();

        // Parse date to create searchable variations
        const date = new Date(riwayat.tanggal);
        const monthNames: Record<number, string[]> = {
            0: ['januari', 'jan'],
            1: ['februari', 'feb'],
            2: ['maret', 'mar'],
            3: ['april', 'apr'],
            4: ['mei', 'may'],
            5: ['juni', 'jun'],
            6: ['juli', 'jul'],
            7: ['agustus', 'agu', 'agt'],
            8: ['september', 'sep'],
            9: ['oktober', 'okt', 'oct'],
            10: ['november', 'nov'],
            11: ['desember', 'des', 'dec']
        };

        const day = date.getDate().toString();
        const month = date.getMonth();
        const year = date.getFullYear().toString();
        const monthVariations = monthNames[month] || [];

        // Check if query matches date in flexible way
        const queryTokens = query.split(/\s+/);
        const matchesDateFlexible = queryTokens.every(token => {
            return formattedDate.includes(token) ||
                day === token ||
                year.includes(token) ||
                monthVariations.some((monthVar: string) => monthVar.includes(token) || token.includes(monthVar));
        });

        // Search in header fields
        const matchesHeader =
            (riwayat.judul_manuver?.toLowerCase().includes(query)) ||
            (riwayat.gardu_induk?.toLowerCase().includes(query)) ||
            (riwayat.pengawas_pekerjaan?.toLowerCase().includes(query)) ||
            (riwayat.pengawas_k3?.toLowerCase().includes(query)) ||
            (riwayat.pengawas_manuver?.toLowerCase().includes(query)) ||
            (riwayat.pelaksana_manuver?.toLowerCase().includes(query)) ||
            (riwayat.dispatcher?.toLowerCase().includes(query)) ||
            (riwayat.tanggal?.includes(query)) ||
            matchesDateFlexible;

        // Also include if items match
        const matchesItems = matchingRiwayatIds.includes(riwayat.id);

        return matchesHeader || matchesItems;
    });

    // Filter by bay
    const bayFilteredList = filterBay
        ? filteredRiwayatList.filter(riwayat => {
            // Check if any item in this riwayat matches the filter bay
            if (riwayat.id.startsWith('dummy-')) {
                const items = DUMMY_RIWAYAT_ITEMS[riwayat.id] || [];
                return items.some(item => {
                    const parts = item.nama_peralatan.split(' ');
                    const bay = parts.slice(-2).join(' ');
                    return bay === filterBay;
                });
            }
            return true; // For real data, keep it visible (Bay cell will handle real-time fetch)
        })
        : filteredRiwayatList;

    // Sort by date
    const sortedList = [...bayFilteredList].sort((a, b) => {
        const dateA = new Date(a.tanggal).getTime();
        const dateB = new Date(b.tanggal).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Paginate list
    const displayedList = sortedList.slice(0, displayCount);
    const hasMore = sortedList.length > displayCount;

    const loadMore = () => {
        setDisplayCount(prev => prev + 15);
    };

    // Use bay extraction hook
    const riwayatBays = useBayExtraction(riwayatList, sortedList);


    return (
        <main className="min-h-screen bg-[#fdfbf7] text-gray-800 p-2 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Riwayat Manuver</h1>
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

                {/* Search Bar */}
                <div className="mb-6 max-w-2xl">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan judul, pengawas, tanggal, peralatan, atau bay..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="mt-2 text-xs text-gray-500">
                            Ditemukan {filteredRiwayatList.length} dari {riwayatList.length} riwayat
                        </p>
                    )}
                </div>

                {/* Riwayat List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Memuat riwayat...</p>
                        </div>
                    ) : riwayatList.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-300">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <h2 className="text-xl font-bold text-gray-600 mb-2">Belum Ada Riwayat</h2>
                            <p className="text-gray-400 mb-4">Simpan manuver dari halaman Catat untuk melihatnya di sini.</p>
                            <Link
                                href="/catat"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Buat Manuver Baru
                            </Link>
                        </div>
                    ) : filteredRiwayatList.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-400">Tidak ada riwayat yang cocok dengan pencarian "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Hapus pencarian
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-orange-50/90 backdrop-blur-sm z-10 shadow-sm">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Judul</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Bay</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            <button
                                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                                                title={sortOrder === 'asc' ? 'Klik untuk urutkan terbaru dulu' : 'Klik untuk urutkan terlama dulu'}
                                            >
                                                Tanggal
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    {sortOrder === 'desc' ? (
                                                        <path d="M12 5v14m0 0l7-7m-7 7l-7-7" />
                                                    ) : (
                                                        <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
                                                    )}
                                                </svg>
                                            </button>
                                        </th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={undo}
                                                    disabled={history.length === 0 || isUndoing}
                                                    className={`text-xs font-medium px-2 py-1 rounded transition-colors ${history.length > 0 && !isUndoing
                                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    title="Undo Last Delete"
                                                >
                                                    {isUndoing ? '...' : 'Undo'}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmClearOpen(true)}
                                                    disabled={riwayatList.length === 0}
                                                    className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Clear All Data"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="sync">
                                        {displayedList.map((riwayat, index) => (
                                            <motion.tr
                                                key={riwayat.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                            >
                                                <td className="py-3 px-4">
                                                    <span className="font-medium text-gray-800 text-sm">
                                                        {riwayat.judul_manuver || <span className="text-gray-400 italic">Tanpa Judul</span>}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <BayCell bays={riwayatBays[riwayat.id] || []} filterBay={filterBay} setFilterBay={setFilterBay} />
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(riwayat.tanggal)}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(riwayat)}
                                                            className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                                                        >
                                                            Detail
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(riwayat.id)}
                                                            className="text-red-400 hover:text-red-600 active:scale-90 transition-all p-2"
                                                            title="Hapus"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="py-6 text-center border-t border-gray-100">
                                    <button
                                        onClick={loadMore}
                                        className="text-sm text-gray-500 hover:text-orange-600 font-medium transition-colors"
                                    >
                                        Muat lebih banyak...
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                    }
                </div >

                {/* Detail Modal */}
                < DetailModal
                    selectedRiwayat={selectedRiwayat}
                    selectedItems={selectedItems}
                    isEditMode={isEditMode}
                    editedHeader={editedHeader}
                    editedItems={editedItems}
                    isLoadingItems={isLoadingItems}
                    isSaving={isSaving}
                    onClose={handleCloseDetail}
                    onEnableEdit={handleEnableEdit}
                    onCancelEdit={handleCancelEdit}
                    onSaveChanges={handleSaveChanges}
                    onUpdateItem={updateEditedItem}
                    onDeleteItem={deleteEditedItem}
                    onAddNewItem={addNewItem}
                    onTogglePosition={toggleEditedPosition}
                    onUpdateHeader={setEditedHeader}
                    formatDateWithDay={formatDateWithDay}
                />

                {/* Clear Confirmation Modal */}
                < ConfirmClearModal
                    isOpen={confirmClearOpen}
                    onClose={() => setConfirmClearOpen(false)}
                    onConfirm={handleClearAll}
                    isClearing={isClearing}
                />

                {/* Scroll to Top Button */}
                < ScrollToTopButton showScrollTop={showScrollTop} scrollToTop={scrollToTop} />

                <Footer />
            </div >
        </main >
    );
}
