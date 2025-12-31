'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CascadingDropdown from './CascadingDropdown';
import TimePicker from './TimePicker';
import { generateId } from '@/utils/generateId';

export interface LogRow {
    id: string;
    nama_peralatan: string;
    posisi_switch: boolean; // 0 = Open (#), 1 = Close (//)
    waktu: string;
    via: string;
    isSeparator?: boolean;
}

interface LogTableProps {
    rows: LogRow[];
    setRows: React.Dispatch<React.SetStateAction<LogRow[]>>;
}

// Animation Variants for Left-to-Right Flow
const rowVariants = {
    hidden: {
        opacity: 0,
        x: -50,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        x: 80,
        scale: 0.98,
        transition: { type: "tween" as const, duration: 0.25, ease: "easeOut" as const }
    }
};

interface InsertNodeProps {
    onInsertRow: () => void;
    onInsertSeparator: () => void;
}

const InsertNode: React.FC<InsertNodeProps> = ({ onInsertRow, onInsertSeparator }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={menuRef} className="relative flex justify-center items-center z-10 group">
            {/* Visual Line Connector */}
            <div className="absolute h-full w-px bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>

            {/* Hitbox Area (Large for mobile) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-20 w-full h-6 flex items-center justify-center focus:outline-none"
                title="Insert here"
            >
                {/* Visual Dot */}
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-gray-500 w-2.5 h-2.5 shadow-md' : 'bg-gray-300 group-hover:w-2 group-hover:h-2 group-hover:bg-gray-400'}`}></div>
            </button>

            {/* Expanded Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-1.5 rounded-lg shadow-xl border border-gray-100 z-50"
                    >
                        <button
                            onClick={() => { onInsertRow(); setIsOpen(false); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-sm transition-colors whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Baris
                        </button>
                        <button
                            onClick={() => { onInsertSeparator(); setIsOpen(false); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Separator
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LogTable: React.FC<LogTableProps> = ({ rows, setRows }) => {
    // History Stack for Undo
    const [history, setHistory] = useState<LogRow[][]>([]);
    const [isClearing, setIsClearing] = useState(false);

    const saveToHistory = () => {
        setHistory((prev) => [...prev, rows]);
    };

    const undo = () => {
        if (history.length > 0) {
            const previousState = history[history.length - 1];
            setHistory((prev) => prev.slice(0, -1));
            setRows(previousState);
        }
    };

    const insertRowAtIndex = (index: number) => {
        saveToHistory();
        const newRow: LogRow = {
            id: generateId(),
            nama_peralatan: '',
            posisi_switch: false,
            waktu: '',
            via: 'R.ACC',
        };
        const newRows = [...rows];
        newRows.splice(index + 1, 0, newRow);
        setRows(newRows);
    };

    const insertSeparatorAtIndex = (index: number) => {
        saveToHistory();
        const newSeparator: LogRow = {
            id: generateId(),
            nama_peralatan: 'SEPARATOR',
            posisi_switch: false,
            waktu: '',
            via: '',
            isSeparator: true
        };
        const newRows = [...rows];
        newRows.splice(index + 1, 0, newSeparator);
        setRows(newRows);
    };

    const addRow = () => {
        saveToHistory();
        const newRow: LogRow = {
            id: generateId(),
            nama_peralatan: '',
            posisi_switch: false,
            waktu: '',
            via: 'R.ACC',
        };
        setRows([...rows, newRow]);
    };

    const updateRow = (id: string, field: keyof LogRow, value: any) => {
        setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const deleteRow = (id: string) => {
        saveToHistory();
        setRows(rows.filter((row) => row.id !== id));
    };

    const togglePosition = (id: string, currentPos: boolean) => {
        updateRow(id, 'posisi_switch', !currentPos);
    };

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const openConfirmModal = () => {
        setIsConfirmOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmOpen(false);
    };

    const confirmResetTable = () => {
        saveToHistory();
        setIsClearing(true);
        const newRows = Array.from({ length: 3 }).map(() => ({
            id: generateId(),
            nama_peralatan: '',
            posisi_switch: false,
            waktu: '',
            via: 'R.ACC',
        }));
        setRows(newRows);
        setIsConfirmOpen(false);
        // Reset clearing flag after a short delay
        setTimeout(() => setIsClearing(false), 100);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 mb-6">
            <div className="flex justify-between items-center mb-4 border-b-2 border-orange-500 pb-2">
                <h2 className="text-xl font-bold text-gray-800">
                    Uraian Manuver
                </h2>
                <div className="flex items-center gap-2">
                    {/* Undo Button */}
                    <button
                        onClick={undo}
                        disabled={history.length === 0}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${history.length > 0
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}
                        title="Undo last action"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        <span>Undo</span>
                    </button>
                    {/* Add Row Button */}
                    <button
                        onClick={addRow}
                        className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                    >
                        <span>+</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-sm border-b border-gray-100">
                            <th className="font-semibold py-3 px-2 w-[40%]">Switchgear</th>
                            <th className="font-semibold py-3 px-2 text-center w-[15%]">Posisi</th>
                            <th className="font-semibold py-3 px-2 text-center w-24">Jam</th>
                            <th className="font-semibold py-3 px-2 w-[130px]">
                                <div className="flex items-center justify-between">
                                    <span>Act</span>
                                    <button
                                        onClick={openConfirmModal}
                                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                                        title="Reset Table to 3 Empty Rows"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isClearing ? (
                            // No animation during clear - instant render
                            rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="group hover:bg-orange-50/30 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <td className="py-3 px-2">
                                        <CascadingDropdown
                                            value={row.nama_peralatan}
                                            onSelect={(val) => updateRow(row.id, 'nama_peralatan', val)}
                                        />
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <button
                                            onClick={() => togglePosition(row.id, row.posisi_switch)}
                                            className={`cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all ${row.posisi_switch
                                                ? 'bg-red-100 text-red-600 border border-red-200'
                                                : 'bg-green-100 text-green-600 border border-green-200'
                                                }`}
                                            title={row.posisi_switch ? 'Switch is CLOSED (//)' : 'Switch is OPEN (#)'}
                                        >
                                            {row.posisi_switch ? '//' : '#'}
                                        </button>
                                    </td>
                                    <td className="p-0 text-center w-24">
                                        <TimePicker
                                            value={row.waktu}
                                            onChange={(time) => updateRow(row.id, 'waktu', time)}
                                        />
                                    </td>
                                    <td className="py-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={row.via}
                                                onChange={(e) => updateRow(row.id, 'via', e.target.value)}
                                                className="flex-1 bg-transparent border-b border-gray-200 focus:border-orange-400 focus:outline-none py-1 text-gray-700 text-sm"
                                            >
                                                <option value="R.ACC">R.ACC</option>
                                                <option value="HMI">HMI</option>
                                                <option value="Local">Local</option>
                                                <option value="Manual">Manual</option>
                                            </select>
                                            <button
                                                onClick={() => deleteRow(row.id)}
                                                className="flex-shrink-0 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                                                title="Delete Row"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Normal operation with animations
                            <AnimatePresence mode="sync">
                                {rows.map((row, index) => (
                                    <React.Fragment key={row.id}>
                                        {/* Insert Node (Except before the first one, for now we put it AFTER each row. 
                                            Actually, to be true "insert between", we can render it before each row, 
                                            or after. Let's do AFTER, matching "unplugging" feel. 
                                            But wait, if I click the node after Row 1, I expect Row 1.5.
                                            Let's render it AFTER each row.
                                        */}

                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`group hover:bg-orange-50/30 transition-colors border-b border-gray-50 last:border-0 ${row.isSeparator ? 'bg-gray-50/50' : ''}`}
                                        >
                                            {/* SEPARATOR ROW HANDLING */}
                                            {row.isSeparator ? (
                                                <td colSpan={4} className="py-2 px-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-px bg-gray-300 flex-1"></div>
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Separator</span>
                                                        <div className="h-px bg-gray-300 flex-1"></div>
                                                        <button
                                                            onClick={() => deleteRow(row.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            title="Remove Separator"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            ) : (
                                                // NORMAL ROW CONTENT
                                                <>
                                                    <td className="py-3 px-2">
                                                        <CascadingDropdown
                                                            value={row.nama_peralatan}
                                                            onSelect={(val) => updateRow(row.id, 'nama_peralatan', val)}
                                                        />
                                                    </td>
                                                    <td className="py-3 px-2 text-center">
                                                        <button
                                                            onClick={() => togglePosition(row.id, row.posisi_switch)}
                                                            className={`cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all ${row.posisi_switch
                                                                ? 'bg-red-100 text-red-600 border border-red-200'
                                                                : 'bg-green-100 text-green-600 border border-green-200'
                                                                }`}
                                                            title={row.posisi_switch ? 'Switch is CLOSED (//)' : 'Switch is OPEN (#)'}
                                                        >
                                                            {row.posisi_switch ? '//' : '#'}
                                                        </button>
                                                    </td>
                                                    <td className="p-0 text-center w-24">
                                                        <TimePicker
                                                            value={row.waktu}
                                                            onChange={(time) => updateRow(row.id, 'waktu', time)}
                                                        />
                                                    </td>
                                                    <td className="py-3 px-1">
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={row.via}
                                                                onChange={(e) => updateRow(row.id, 'via', e.target.value)}
                                                                className="flex-1 bg-transparent border-b border-gray-200 focus:border-orange-400 focus:outline-none py-1 text-gray-700 text-sm"
                                                            >
                                                                <option value="R.ACC">R.ACC</option>
                                                                <option value="HMI">HMI</option>
                                                                <option value="Local">Local</option>
                                                                <option value="Manual">Manual</option>
                                                            </select>
                                                            <button
                                                                onClick={() => deleteRow(row.id)}
                                                                className="flex-shrink-0 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                                                                title="Delete Row"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </motion.tr>

                                        {/* Insert Node ONLY between rows (not after the last one) */}
                                        {index < rows.length - 1 && (
                                            <tr>
                                                <td className="p-0 h-0"></td>
                                                <td className="p-0 h-0 relative">
                                                    <InsertNode
                                                        onInsertRow={() => insertRowAtIndex(index)}
                                                        onInsertSeparator={() => insertSeparatorAtIndex(index)}
                                                    />
                                                </td>
                                                <td className="p-0 h-0"></td>
                                                <td className="p-0 h-0"></td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Custom Confirmation Modal */}
            {
                isConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Reset</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Apakah Anda yakin ingin menghapus semua data di tabel? Tindakan ini tidak bisa dibatalkan.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeConfirmModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmResetTable}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-sm"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default LogTable;

