'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SessionCapsule() {
    const { profile, isMaster, signOut } = useAuth();
    const router = useRouter();
    const [showLogout, setShowLogout] = useState(false);

    const displayName = isMaster
        ? 'Master'
        : (profile?.nama_gardu || `GI ${profile?.kode_gardu?.toUpperCase() || '...'}`);

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowLogout(!showLogout)}
                className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all ${showLogout
                        ? 'bg-red-50 text-red-600 ring-2 ring-red-200'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
            >
                {displayName}
            </button>

            {/* Logout Dropdown */}
            {showLogout && (
                <button
                    onClick={handleLogout}
                    className="absolute right-0 top-full mt-1 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg transition-all whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Keluar
                </button>
            )}
        </div>
    );
}
