/**
 * useRiwayatCRUD Hook
 * 
 * RESPONSIBILITIES:
 * - All CRUD operations for riwayat and items
 * - Fetch riwayat list from database
 * - Fetch items for a specific riwayat
 * - Handle view/close detail modal
 * - Delete single riwayat
 * - Clear all riwayat
 * - Edit mode management (enable, cancel, save)
 * - Item editing operations (update, delete, add, toggle)
 * 
 * NOT RESPONSIBLE FOR:
 * - UI rendering
 * - Search/filter logic
 * - Bay extraction
 * - History/undo (handled by useRiwayatHistory)
 * 
 * STATUS: NOT YET INTEGRATED - Created for future use
 */

import { useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { DUMMY_RIWAYAT_DATA } from '@/utils/dummyRiwayatData';
import { DUMMY_RIWAYAT_ITEMS } from '@/utils/dummyRiwayatItems';
import { generateId } from '@/utils/generateId';

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

export function useRiwayatCRUD(
    supabase: SupabaseClient,
    addToHistory: (item: RiwayatManuver) => void
) {
    // Data states
    const [riwayatList, setRiwayatList] = useState<RiwayatManuver[]>([]);
    const [selectedRiwayat, setSelectedRiwayat] = useState<RiwayatManuver | null>(null);
    const [selectedItems, setSelectedItems] = useState<RiwayatItem[]>([]);

    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedHeader, setEditedHeader] = useState<RiwayatManuver | null>(null);
    const [editedItems, setEditedItems] = useState<RiwayatItem[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    // Fetch all riwayat
    const fetchRiwayat = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('riwayat_manuver')
            .select('*')
            .order('created_at', { ascending: false });

        // Merge database data with dummy data
        const allData = [...DUMMY_RIWAYAT_DATA, ...(data || [])];

        if (!error) {
            setRiwayatList(allData);
        }
        setIsLoading(false);
    }, [supabase]);

    // Fetch items for a specific riwayat
    const fetchItems = useCallback(async (riwayatId: string) => {
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
    }, [supabase]);

    // View detail
    const handleViewDetail = useCallback(async (riwayat: RiwayatManuver) => {
        setSelectedRiwayat(riwayat);
        await fetchItems(riwayat.id);
    }, [fetchItems]);

    // Close detail
    const handleCloseDetail = useCallback(() => {
        setSelectedRiwayat(null);
        setSelectedItems([]);
        setIsEditMode(false);
        setEditedHeader(null);
        setEditedItems([]);
    }, []);

    // Delete single riwayat
    const handleDelete = useCallback(async (id: string) => {
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
    }, [riwayatList, supabase, addToHistory]);

    // Clear all riwayat
    const handleClearAll = useCallback(async () => {
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
    }, [riwayatList, isClearing, supabase]);

    // Edit mode handlers
    const handleEnableEdit = useCallback(() => {
        if (!selectedRiwayat) return;
        setIsEditMode(true);
        setEditedHeader({ ...selectedRiwayat });
        setEditedItems([...selectedItems]);
    }, [selectedRiwayat, selectedItems]);

    const handleCancelEdit = useCallback(() => {
        setIsEditMode(false);
        setEditedHeader(null);
        setEditedItems([]);
    }, []);

    const handleSaveChanges = useCallback(async () => {
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
    }, [selectedRiwayat, editedHeader, editedItems, supabase, fetchItems, fetchRiwayat]);

    // Item editing operations
    const updateEditedItem = useCallback((id: string, field: keyof RiwayatItem, value: any) => {
        setEditedItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const deleteEditedItem = useCallback((id: string) => {
        setEditedItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const addNewItem = useCallback(() => {
        const newItem: RiwayatItem = {
            id: generateId(),
            nama_peralatan: '',
            posisi_switch: false,
            waktu: '',
            act: 'R.ACC',
            order_index: editedItems.length,
            is_separator: false,
        };
        setEditedItems(prev => [...prev, newItem]);
    }, [editedItems.length]);

    const toggleEditedPosition = useCallback((id: string, currentPos: boolean) => {
        updateEditedItem(id, 'posisi_switch', !currentPos);
    }, [updateEditedItem]);

    return {
        // Data
        riwayatList,
        setRiwayatList,
        selectedRiwayat,
        selectedItems,

        // Edit states
        isEditMode,
        editedHeader,
        setEditedHeader,
        editedItems,

        // Loading states
        isLoading,
        isLoadingItems,
        isSaving,
        isClearing,

        // CRUD operations
        fetchRiwayat,
        fetchItems,
        handleViewDetail,
        handleCloseDetail,
        handleDelete,
        handleClearAll,

        // Edit operations
        handleEnableEdit,
        handleCancelEdit,
        handleSaveChanges,
        updateEditedItem,
        deleteEditedItem,
        addNewItem,
        toggleEditedPosition,
    };
}
