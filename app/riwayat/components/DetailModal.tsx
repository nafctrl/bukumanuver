/**
 * DetailModal Component
 * 
 * RESPONSIBILITIES:
 * - Main modal for viewing and editing riwayat manuver
 * - Compose sub-components (Header, InfoGrid, ItemsTable)
 * - Handle modal animation and backdrop
 * - Click-outside-to-close functionality
 * 
 * NOT RESPONSIBLE FOR:
 * - State management (receives via props)
 * - Database operations (uses callbacks)
 * - Business logic (delegated to parent)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DetailModalHeader } from './DetailModalHeader';
import { DetailModalInfoGrid } from './DetailModalInfoGrid';
import { ItemsTable } from './ItemsTable';

interface RiwayatManuver {
    id: string;
    judul_manuver: string;
    tanggal: string;
    kode_gardu: string;
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

interface DetailModalProps {
    // Data
    selectedRiwayat: RiwayatManuver | null;
    selectedItems: RiwayatItem[];

    // Edit mode state
    isEditMode: boolean;
    editedHeader: RiwayatManuver | null;
    editedItems: RiwayatItem[];

    // Loading states
    isLoadingItems: boolean;
    isSaving: boolean;

    // Callbacks
    onClose: () => void;
    onEnableEdit: () => void;
    onCancelEdit: () => void;
    onSaveChanges: () => void;

    // Item management
    onUpdateItem: (id: string, field: keyof RiwayatItem, value: any) => void;
    onDeleteItem: (id: string) => void;
    onAddNewItem: () => void;
    onTogglePosition: (id: string, currentPos: boolean) => void;

    // Header edit
    onUpdateHeader: (header: RiwayatManuver) => void;

    // Utility
    formatDateWithDay: (date: string) => string;
}

export const DetailModal: React.FC<DetailModalProps> = ({
    selectedRiwayat,
    selectedItems,
    isEditMode,
    editedHeader,
    editedItems,
    isLoadingItems,
    isSaving,
    onClose,
    onEnableEdit,
    onCancelEdit,
    onSaveChanges,
    onUpdateItem,
    onDeleteItem,
    onAddNewItem,
    onTogglePosition,
    onUpdateHeader,
    formatDateWithDay,
}) => {
    if (!selectedRiwayat) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <DetailModalHeader
                        selectedRiwayat={selectedRiwayat}
                        isEditMode={isEditMode}
                        editedHeader={editedHeader}
                        isSaving={isSaving}
                        onUpdateHeader={onUpdateHeader}
                        onEnableEdit={onEnableEdit}
                        onCancelEdit={onCancelEdit}
                        onSaveChanges={onSaveChanges}
                        onClose={onClose}
                        formatDateWithDay={formatDateWithDay}
                    />

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                        {/* Info Grid */}
                        <DetailModalInfoGrid
                            selectedRiwayat={selectedRiwayat}
                            isEditMode={isEditMode}
                            editedHeader={editedHeader}
                            onUpdateHeader={onUpdateHeader}
                        />

                        {/* Items Table */}
                        <ItemsTable
                            items={isEditMode ? editedItems : selectedItems}
                            isEditMode={isEditMode}
                            isLoadingItems={isLoadingItems}
                            onUpdateItem={onUpdateItem}
                            onDeleteItem={onDeleteItem}
                            onAddNewItem={onAddNewItem}
                            onTogglePosition={onTogglePosition}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
