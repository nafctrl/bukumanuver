/**
 * useRiwayatHistory Hook
 * 
 * RESPONSIBILITIES:
 * - Track deleted riwayat for undo functionality
 * - Provide undo function to restore last deleted item
 * - Handle undo loading state
 * 
 * NOT RESPONSIBLE FOR:
 * - Actual delete operation (handled by parent/data hook)
 * - Supabase INSERT operation (receives callback)
 * - UI state management
 * 
 * @param onRestore - Callback to restore item (add to list + insert to DB)
 * @returns history - Array of deleted items
 * @returns addToHistory - Function to add deleted item to history
 * @returns undo - Function to undo last delete
 * @returns isUndoing - Loading state
 * @returns canUndo - Whether undo is available
 */

import { useState } from 'react';
import { RiwayatManuver } from '../types';

interface HistoryEntry {
    action: 'delete';
    item: RiwayatManuver;
}

export function useRiwayatHistory(onRestore: (item: RiwayatManuver) => Promise<void>) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isUndoing, setIsUndoing] = useState(false);

    const addToHistory = (item: RiwayatManuver) => {
        setHistory(prev => [...prev, { action: 'delete', item }]);
    };

    const undo = async () => {
        if (history.length === 0) return;

        setIsUndoing(true);
        try {
            const lastEntry = history[history.length - 1];

            // Call restore callback
            await onRestore(lastEntry.item);

            // Remove from history
            setHistory(prev => prev.slice(0, -1));
        } catch (error) {
            console.error('Undo failed:', error);
        } finally {
            setIsUndoing(false);
        }
    };

    const canUndo = history.length > 0;

    return {
        history,
        addToHistory,
        undo,
        isUndoing,
        canUndo
    };
}
