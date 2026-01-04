/**
 * ItemsTable Component
 * 
 * RESPONSIBILITIES:
 * - Display riwayat items in table format
 * - Support both view and edit modes
 * - Handle item CRUD operations through callbacks
 * - Show loading state
 * - Support separator rows
 * 
 * NOT RESPONSIBLE FOR:
 * - State management (receives data via props)
 * - Database operations (uses callbacks)
 * - Modal display logic
 */

import React from 'react';
import CascadingDropdown from '@/components/CascadingDropdown';
import TimePicker from '@/components/TimePicker';

interface RiwayatItem {
    id: string;
    nama_peralatan: string;
    posisi_switch: boolean;
    waktu: string;
    act: string;
    order_index: number;
    is_separator: boolean;
}

interface ItemsTableProps {
    items: RiwayatItem[];
    isEditMode: boolean;
    isLoadingItems: boolean;
    onUpdateItem: (id: string, field: keyof RiwayatItem, value: any) => void;
    onDeleteItem: (id: string) => void;
    onAddNewItem: () => void;
    onTogglePosition: (id: string, currentPos: boolean) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
    items,
    isEditMode,
    isLoadingItems,
    onUpdateItem,
    onDeleteItem,
    onAddNewItem,
    onTogglePosition,
}) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Uraian Manuver</h3>
                {isEditMode && (
                    <button
                        onClick={onAddNewItem}
                        className="text-xs px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Tambah Baris
                    </button>
                )}
            </div>
            {isLoadingItems ? (
                <div className="p-8 text-center">
                    <div className="animate-spin w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    Tidak ada data uraian.
                </div>
            ) : (
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="py-2 px-3 text-left">Switchgear</th>
                            <th className="py-2 px-3 text-center">Posisi</th>
                            <th className="py-2 px-3 text-center">Jam</th>
                            <th className="py-2 px-3 text-left">Act</th>
                            {isEditMode && <th className="py-2 px-3 text-center w-12"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            item.is_separator ? (
                                <tr key={item.id} className="bg-gray-50/50">
                                    <td colSpan={isEditMode ? 5 : 4} className="py-2 px-3 text-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px bg-gray-300 flex-1"></div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">Separator</span>
                                            <div className="h-px bg-gray-300 flex-1"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : isEditMode ? (
                                // EDIT MODE ROW
                                <tr key={item.id} className="border-t border-gray-100">
                                    <td className="py-2 px-2">
                                        <CascadingDropdown
                                            value={item.nama_peralatan}
                                            onSelect={(val) => onUpdateItem(item.id, 'nama_peralatan', val)}
                                        />
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <button
                                            onClick={() => onTogglePosition(item.id, item.posisi_switch)}
                                            className={`cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all ${item.posisi_switch
                                                ? 'bg-red-100 text-red-600 border border-red-200'
                                                : 'bg-green-100 text-green-600 border border-green-200'
                                                }`}
                                            title={item.posisi_switch ? 'Switch is CLOSED (//)' : 'Switch is OPEN (#)'}
                                        >
                                            {item.posisi_switch ? '//' : '#'}
                                        </button>
                                    </td>
                                    <td className="p-0 text-center w-24">
                                        <TimePicker
                                            value={item.waktu}
                                            onChange={(time) => onUpdateItem(item.id, 'waktu', time)}
                                        />
                                    </td>
                                    <td className="py-2 px-2">
                                        <select
                                            value={item.act}
                                            onChange={(e) => onUpdateItem(item.id, 'act', e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-200 focus:border-orange-400 focus:outline-none py-1 text-gray-700 text-sm"
                                        >
                                            <option value="R.ACC">R.ACC</option>
                                            <option value="HMI">HMI</option>
                                            <option value="Local">Local</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <button
                                            onClick={() => onDeleteItem(item.id)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                                            title="Delete Row"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                // VIEW MODE ROW
                                <tr key={item.id} className="border-t border-gray-100 hover:bg-orange-50/30">
                                    <td className="py-2 px-3 text-gray-800">{item.nama_peralatan || '-'}</td>
                                    <td className="py-2 px-3 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${(item.posisi_switch === '//' || item.posisi_switch === true)
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {typeof item.posisi_switch === 'boolean'
                                                ? (item.posisi_switch ? '//' : '#')
                                                : (item.posisi_switch || '-')}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-center text-gray-600">{item.waktu || '-'}</td>
                                    <td className="py-2 px-3 text-gray-600">{item.act || '-'}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
