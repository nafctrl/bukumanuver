/**
 * RiwayatTable Component
 * 
 * RESPONSIBILITIES:
 * - Render riwayat list table with sorting
 * - Table header with sort controls, Undo, and Clear buttons
 * - Table rows with data display
 * - Load More pagination button
 * - Empty states (no data, no results)
 * - Loading state
 * 
 * NOT RESPONSIBLE FOR:
 * - Data fetching (receives data via props)
 * - CRUD operations (uses callbacks)
 * - Search/filter logic (receives filtered data)
 * - Bay extraction (uses pre-computed bays)
 * 
 * STATUS: NOT YET INTEGRATED - Created for future use
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BayCell } from './BayCell';
import { RiwayatManuver } from '../types';

interface RiwayatTableProps {
    riwayatList: RiwayatManuver[];
    isLoading: boolean;
    formatDate: (date: string) => string;
    riwayatBays: Record<string, string[]>;
    filterBay: string | null;
    setFilterBay: (bay: string | null) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
    displayedList: RiwayatManuver[];
    hasMore: boolean;
    onLoadMore: () => void;
    onViewDetail: (riwayat: RiwayatManuver) => void;
    onDelete: (id: string) => void;
    undo: () => void;
    canUndo: boolean;
    isUndoing: boolean;
    onClearAll: () => void;
    searchQuery: string;
    onClearSearch: () => void;
}

export const RiwayatTable: React.FC<RiwayatTableProps> = ({
    riwayatList,
    isLoading,
    formatDate,
    riwayatBays,
    filterBay,
    setFilterBay,
    sortOrder,
    setSortOrder,
    displayedList,
    hasMore,
    onLoadMore,
    onViewDetail,
    onDelete,
    undo,
    canUndo,
    isUndoing,
    onClearAll,
    searchQuery,
    onClearSearch,
}) => {
    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat riwayat...</p>
                </div>
            </div>
        );
    }

    // Empty state - no data at all
    if (riwayatList.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            </div>
        );
    }

    // Empty state - no search results
    if (displayedList.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center">
                    <p className="text-gray-400">Tidak ada riwayat yang cocok dengan pencarian "{searchQuery}"</p>
                    <button
                        onClick={onClearSearch}
                        className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                        Hapus pencarian
                    </button>
                </div>
            </div>
        );
    }

    // Main table
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Table Header */}
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
                                        disabled={!canUndo || isUndoing}
                                        className={`text-xs font-medium px-2 py-1 rounded transition-colors ${canUndo && !isUndoing
                                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        title="Undo Last Delete"
                                    >
                                        {isUndoing ? '...' : 'Undo'}
                                    </button>
                                    <button
                                        onClick={onClearAll}
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

                    {/* Table Body */}
                    <tbody>
                        <AnimatePresence mode="sync">
                            {displayedList.map((riwayat, index) => (
                                <motion.tr
                                    key={riwayat.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                        }`}
                                >
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-gray-800 text-sm">
                                            {riwayat.judul_manuver || <span className="text-gray-400 italic">Tanpa Judul</span>}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <BayCell
                                            bays={riwayatBays[riwayat.id] || []}
                                            filterBay={filterBay}
                                            setFilterBay={setFilterBay}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(riwayat.tanggal)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onViewDetail(riwayat)}
                                                className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => onDelete(riwayat.id)}
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
                            onClick={onLoadMore}
                            className="text-sm text-gray-500 hover:text-orange-600 font-medium transition-colors"
                        >
                            Muat lebih banyak...
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
