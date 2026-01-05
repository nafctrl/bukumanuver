/**
 * DetailModalInfoGrid Component
 * 
 * RESPONSIBILITIES:
 * - Display info grid for pengawas and dispatcher fields
 * - Support view and edit modes
 * - Handle input changes through callback
 * 
 * NOT RESPONSIBLE FOR:
 * - State management (receives data via props)
 * - Form submission (parent handles)
 */

import React from 'react';

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

interface DetailModalInfoGridProps {
    selectedRiwayat: RiwayatManuver;
    isEditMode: boolean;
    editedHeader: RiwayatManuver | null;
    onUpdateHeader: (header: RiwayatManuver) => void;
}

export const DetailModalInfoGrid: React.FC<DetailModalInfoGridProps> = ({
    selectedRiwayat,
    isEditMode,
    editedHeader,
    onUpdateHeader,
}) => {
    const fields = [
        { key: 'pengawas_pekerjaan' as const, label: 'Pengawas Pekerjaan' },
        { key: 'pengawas_k3' as const, label: 'Pengawas K3' },
        { key: 'pengawas_manuver' as const, label: 'Pengawas Manuver' },
        { key: 'pelaksana_manuver' as const, label: 'Pelaksana Manuver' },
        { key: 'dispatcher' as const, label: 'Dispatcher' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {fields.map((field) => (
                <div key={field.key}>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">
                        {field.label}
                    </label>
                    {isEditMode && editedHeader ? (
                        <input
                            type="text"
                            value={editedHeader[field.key]}
                            onChange={(e) => onUpdateHeader({ ...editedHeader, [field.key]: e.target.value })}
                            className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-orange-400"
                        />
                    ) : (
                        <p className="font-medium text-gray-700">
                            {selectedRiwayat[field.key] || '-'}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};
