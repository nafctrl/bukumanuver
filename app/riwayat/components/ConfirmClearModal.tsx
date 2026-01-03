/**
 * ConfirmClearModal Component
 * 
 * RESPONSIBILITIES:
 * - Display confirmation dialog before clearing all riwayat
 * - Show warning message and action buttons
 * - Handle confirm and cancel actions
 * - Backdrop blur and click-outside-to-close
 * 
 * NOT RESPONSIBLE FOR:
 * - Actual clear/delete logic (calls onConfirm callback)
 * - Managing open/close state (receives isOpen prop)
 * - Loading state management (receives isClearing prop)
 * 
 * @param isOpen - Whether modal is visible
 * @param onClose - Function to close modal
 * @param onConfirm - Function to execute when user confirms
 * @param isClearing - Loading state during clear operation
 */

import React from 'react';

interface ConfirmClearModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isClearing: boolean;
}

export const ConfirmClearModal: React.FC<ConfirmClearModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isClearing
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Semua Riwayat?</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Semua data riwayat manuver akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={isClearing}
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isClearing}
                    >
                        {isClearing ? 'Menghapus...' : 'Ya, Hapus Semua'}
                    </button>
                </div>
            </div>
        </div>
    );
};
