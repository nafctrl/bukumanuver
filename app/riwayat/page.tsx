'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_VERSION } from '@/components/ChangeLog';
import Footer from '@/components/Footer';

import { DUMMY_RIWAYAT_ITEMS } from '@/utils/dummyRiwayatItems';
// Extracted components
import { BayCell } from './components/BayCell';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ConfirmClearModal } from './components/ConfirmClearModal';
import { DetailModal } from './components/DetailModal';
import { RiwayatTable } from './components/RiwayatTable';
// Custom hooks
import { useBayExtraction } from './hooks/useBayExtraction';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useRiwayatHistory } from './hooks/useRiwayatHistory';
import { useRiwayatCRUD } from './hooks/useRiwayatCRUD';

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
    const crud = useRiwayatCRUD(supabase, addToHistory);


    useEffect(() => {
        crud.fetchRiwayat();
    }, []);










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
    }, [searchQuery, crud.riwayatList]);



    // Filter riwayat list based on search query
    const filteredRiwayatList = crud.riwayatList.filter(riwayat => {
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
    const riwayatBays = useBayExtraction(crud.riwayatList, sortedList);


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
                            Ditemukan {filteredRiwayatList.length} dari {crud.riwayatList.length} riwayat
                        </p>
                    )}
                </div>

                {/* Riwayat Table */}
                <RiwayatTable
                    riwayatList={crud.riwayatList}
                    isLoading={crud.isLoading}
                    formatDate={formatDate}
                    riwayatBays={riwayatBays}
                    filterBay={filterBay}
                    setFilterBay={setFilterBay}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    displayedList={displayedList}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    onViewDetail={crud.handleViewDetail}
                    onDelete={crud.handleDelete}
                    undo={undo}
                    canUndo={canUndo}
                    isUndoing={isUndoing}
                    onClearAll={() => setConfirmClearOpen(true)}
                    searchQuery={searchQuery}
                    onClearSearch={() => setSearchQuery('')}
                />

                {/* Detail Modal */}
                < DetailModal
                    selectedRiwayat={crud.selectedRiwayat}
                    selectedItems={crud.selectedItems}
                    isEditMode={crud.isEditMode}
                    editedHeader={crud.editedHeader}
                    editedItems={crud.editedItems}
                    isLoadingItems={crud.isLoadingItems}
                    isSaving={crud.isSaving}
                    onClose={crud.handleCloseDetail}
                    onEnableEdit={crud.handleEnableEdit}
                    onCancelEdit={crud.handleCancelEdit}
                    onSaveChanges={crud.handleSaveChanges}
                    onUpdateItem={crud.updateEditedItem}
                    onDeleteItem={crud.deleteEditedItem}
                    onAddNewItem={crud.addNewItem}
                    onTogglePosition={crud.toggleEditedPosition}
                    onUpdateHeader={crud.setEditedHeader}
                    formatDateWithDay={formatDateWithDay}
                />

                {/* Clear Confirmation Modal */}
                < ConfirmClearModal
                    isOpen={confirmClearOpen}
                    onClose={() => setConfirmClearOpen(false)}
                    onConfirm={crud.handleClearAll}
                    isClearing={crud.isClearing}
                />

                {/* Scroll to Top Button */}
                < ScrollToTopButton showScrollTop={showScrollTop} scrollToTop={scrollToTop} />

                <Footer />
            </div >
        </main >
    );
}
