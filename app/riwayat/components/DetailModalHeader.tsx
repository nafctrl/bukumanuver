/**
 * DetailModalHeader Component
 * 
 * RESPONSIBILITIES:
 * - Display modal header with title, GI, and date
 * - Show edit/save/cancel buttons based on mode
 * - Handle mode switching through callbacks
 * - Show loading state during save
 * 
 * NOT RESPONSIBLE FOR:
 * - State management (receives via props)
 * - Save logic (calls callback)
 */

import React from 'react';

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

interface DetailModalHeaderProps {
    selectedRiwayat: RiwayatManuver;
    isEditMode: boolean;
    editedHeader: RiwayatManuver | null;
    isSaving: boolean;
    onUpdateHeader: (header: RiwayatManuver) => void;
    onEnableEdit: () => void;
    onCancelEdit: () => void;
    onSaveChanges: () => void;
    onClose: () => void;
    formatDateWithDay: (date: string) => string;
}

export const DetailModalHeader: React.FC<DetailModalHeaderProps> = ({
    selectedRiwayat,
    isEditMode,
    editedHeader,
    isSaving,
    onUpdateHeader,
    onEnableEdit,
    onCancelEdit,
    onSaveChanges,
    onClose,
    formatDateWithDay,
}) => {
    return (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
            <div className="flex-1 min-w-0">
                {isEditMode && editedHeader ? (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={editedHeader.judul_manuver}
                            onChange={(e) => onUpdateHeader({ ...editedHeader, judul_manuver: e.target.value })}
                            placeholder="Judul"
                            className="text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:border-orange-400"
                        />
                        <div className="flex gap-2 text-xs">
                            <input
                                type="text"
                                value={editedHeader.gardu_induk}
                                onChange={(e) => onUpdateHeader({ ...editedHeader, gardu_induk: e.target.value })}
                                placeholder="GI"
                                className="flex-1 min-w-0 text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-orange-400"
                            />
                            <input
                                type="date"
                                value={editedHeader.tanggal}
                                onChange={(e) => onUpdateHeader({ ...editedHeader, tanggal: e.target.value })}
                                className="flex-1 min-w-0 text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-orange-400"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-bold text-gray-800 line-clamp-3">
                            {selectedRiwayat.judul_manuver || 'Detail Manuver'}
                        </h2>
                        <p className="text-sm text-gray-500 truncate">
                            {selectedRiwayat.gardu_induk} • {formatDateWithDay(selectedRiwayat.tanggal)}
                        </p>
                    </>
                )}
            </div>
            <div className="flex items-start gap-2 flex-shrink-0 ml-2">
                {isEditMode ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={onCancelEdit}
                            disabled={isSaving}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onSaveChanges}
                            disabled={isSaving}
                            className="px-2 py-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded transition-colors disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="hidden sm:inline">Menyimpan...</span>
                                </>
                            ) : (
                                'Simpan'
                            )}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onEnableEdit}
                        className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        title="Edit Manuver"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
};
