/**
 * BayCell Component
 * 
 * RESPONSIBILITIES:
 * - Display bay names extracted from riwayat items as clickable buttons
 * - Handle bay filter toggle (active/inactive state)
 * - Show all bay names with flex-wrap layout
 * - Visual feedback: orange background when selected, gray when not
 * 
 * NOT RESPONSIBLE FOR:
 * - Bay data fetching (handled by parent/hook)
 * - Bay name extraction logic (receives pre-computed bays)
 * - Storing filter state (receives filter state and setter)
 * 
 * @param bays - Array of unique bay names for this riwayat
 * @param filterBay - Currently active bay filter (or null)
 * @param setFilterBay - Function to update bay filter
 */

import React from 'react';

interface BayCellProps {
    bays: string[];
    filterBay: string | null;
    setFilterBay: (bay: string | null) => void;
}

export const BayCell: React.FC<BayCellProps> = ({ bays, filterBay, setFilterBay }) => {
    if (bays.length === 0) {
        return <span className="text-gray-400 text-sm">-</span>;
    }

    return (
        <div className="flex flex-wrap gap-1">
            {bays.map(bay => (
                <button
                    key={bay}
                    onClick={() => setFilterBay(filterBay === bay ? null : bay)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide transition-all cursor-pointer hover:scale-105 ${filterBay === bay ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    title={filterBay === bay ? 'Klik untuk hapus filter' : `Filter by ${bay}`}
                >
                    {bay}
                </button>
            ))}
        </div>
    );
};
