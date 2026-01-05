'use client';

import React, { useState } from 'react';

interface ChangeLogEntry {
    version: string;
    date: string;  // Format: DD/MM/YYYY
    changes: string[];
}

// ============================================================================
// VERSION NUMBER - Update this when releasing new versions
// ============================================================================
export const APP_VERSION = 'v1.1.0 Beta';

// ============================================================================
// CHANGELOG DATA - Add new entries at the TOP of this array
// 
// Format untuk menambah changelog baru:
// {
//     version: 'vX.X.X',          // Nomor versi baru
//     date: 'DD/MM/YYYY',         // Tanggal rilis
//     changes: [
//         'Deskripsi perubahan 1',
//         'Deskripsi perubahan 2',
//     ]
// },
// ============================================================================
const changelog: ChangeLogEntry[] = [
    // ↓↓↓ TAMBAHKAN VERSI BARU DI SINI (paling atas) ↓↓↓
    {
        version: 'v1.1.0 Beta',
        date: '05/01/2026',
        changes: [
            'Added Riwayat Manuver features',
            'Added login features',
            'Is now ready for open beta testing'

        ]
    },
    {
        version: 'v1.0.1 Beta',
        date: '31/12/2025',
        changes: [
            'Bug fixes',
            'Minor updates',

        ]
    },
    {
        version: 'v1.0.0 Beta',
        date: '26/12/2025',
        changes: [
            'Closed Beta Version Released',

        ]
    }
];

interface ChangeLogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangeLogModal: React.FC<ChangeLogProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Changelog
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        title="Tutup"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
                    {changelog.map((entry, index) => (
                        <div key={entry.version} className={`${index > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    {entry.version}
                                </span>
                                <span className="text-gray-400 text-sm">{entry.date}</span>
                            </div>
                            <ul className="space-y-2">
                                {entry.changes.map((change, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-orange-400 mt-1">•</span>
                                        <span>{change}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Clickable version badge for home page
export const VersionBadgeClickable: React.FC = () => {
    const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsChangeLogOpen(true)}
                className="inline-block bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors cursor-pointer"
                title="Lihat Changelog"
            >
                {APP_VERSION}
            </button>
            <ChangeLogModal isOpen={isChangeLogOpen} onClose={() => setIsChangeLogOpen(false)} />
        </>
    );
};

// Static version badge for other pages (not clickable)
export const VersionBadge: React.FC = () => {
    return (
        <span className="inline-block bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-medium">
            {APP_VERSION}
        </span>
    );
};

export default ChangeLogModal;
