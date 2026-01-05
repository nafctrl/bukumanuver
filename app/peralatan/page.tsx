'use client';

import React from 'react';
import Link from 'next/link';
import HeaderAlat from '@/components/HeaderAlat';
import DataAlat from '@/components/DataAlat';
import Footer from '@/components/Footer';

export default function PeralatanPage() {
    return (
        <main className="min-h-screen bg-[#fdfbf7] text-gray-800 p-2 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <HeaderAlat />
                <DataAlat />

                {/* Navigation to Catat Manuver */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/catat"
                        className="flex items-center gap-2 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 font-medium px-6 py-3 rounded-xl shadow-sm transition-all duration-200 group"
                    >
                        <span>Mulai Catat Manuver</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>

                <Footer />
            </div>
        </main>
    );
}
