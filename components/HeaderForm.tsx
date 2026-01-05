'use client';

import React from 'react';

interface HeaderFormProps {
    formData: {
        judul_manuver: string;
        tanggal: string;
        kode_gardu: string;
        pengawas_pekerjaan: string;
        pengawas_k3: string;
        pengawas_manuver: string;
        pelaksana_manuver: string;
        dispa: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({ formData, onChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-orange-500 pb-2 inline-block">
                Detail Pekerjaan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {/* Full Width for Title */}
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Judul Manuver
                    </label>
                    <input
                        type="text"
                        name="judul_manuver"
                        value={formData.judul_manuver}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                        placeholder="Contoh: Manuver Pemeliharaan Bay Trafo 1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Tanggal
                    </label>
                    <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Gardu Induk
                    </label>
                    <input
                        type="text"
                        name="kode_gardu"
                        value={formData.kode_gardu}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                        placeholder="Contoh: GI 150 KV Batang"
                    />
                </div>

                {/* Supervision Team */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Pengawas Pekerjaan
                    </label>
                    <input
                        type="text"
                        name="pengawas_pekerjaan"
                        value={formData.pengawas_pekerjaan}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Pengawas K3
                    </label>
                    <input
                        type="text"
                        name="pengawas_k3"
                        value={formData.pengawas_k3}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Pengawas Manuver
                    </label>
                    <input
                        type="text"
                        name="pengawas_manuver"
                        value={formData.pengawas_manuver}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Pelaksana Manuver
                    </label>
                    <input
                        type="text"
                        name="pelaksana_manuver"
                        value={formData.pelaksana_manuver}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Dispatcher
                    </label>
                    <input
                        type="text"
                        name="dispa"
                        value={formData.dispa}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeaderForm;
