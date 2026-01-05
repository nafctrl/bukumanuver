'use client';

import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Equipment interface for CascadingDropdown (transformed)
export interface Equipment {
    id: string;
    level_1: string;  // type (PMS, PMT, etc.)
    level_2: string;  // section (BUS A, 150KV, etc.)
    level_3: string;  // bay (BREBES 1, TRAFO 1, etc.)
    full_label: string;  // nama_lengkap
}

// Raw database row interface (for DataAlat)
export interface PeralatanRow {
    id: string;
    type: string;
    section: string;
    bay: string;
    nama_lengkap: string;
    kode_gardu?: string;
    created_at?: string;
    updated_at?: string;
}

// Transform database row to Equipment interface
function mapToEquipment(row: PeralatanRow): Equipment {
    return {
        id: row.id,
        level_1: row.type || '',
        level_2: row.section || '',
        level_3: row.bay || '',
        full_label: row.nama_lengkap || '',
    };
}

/**
 * Global hook for equipment data using SWR.
 * 
 * - Caches data in memory (no duplicate requests)
 * - Shares state across all components
 * - Call `refresh()` after mutations (add/delete/edit) to sync all consumers
 * - Exports both transformed (equipmentList) and raw (rawEquipmentList) formats
 */
export function usePeralatan() {
    const { profile, isMaster } = useAuth();
    const supabase = createClient();

    // Build cache key based on user's gardu (or 'master' for admin)
    const cacheKey = profile || isMaster
        ? ['peralatan', isMaster ? 'master' : profile?.kode_gardu]
        : null; // Don't fetch until authenticated

    // Fetcher function - returns raw data
    const fetcher = async (): Promise<PeralatanRow[]> => {
        let query = supabase
            .from('peralatan')
            .select('id, type, section, bay, nama_lengkap, kode_gardu, created_at, updated_at')
            .order('created_at', { ascending: false }); // Most recent first for DataAlat

        // Filter by kode_gardu if not master
        if (!isMaster && profile?.kode_gardu) {
            query = query.eq('kode_gardu', profile.kode_gardu);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching equipment:', error);
            throw error;
        }

        return data || [];
    };

    const { data: rawData, error, isLoading, mutate } = useSWR(cacheKey, fetcher, {
        revalidateOnFocus: false,     // Don't refetch when window regains focus
        revalidateOnReconnect: true,  // Refetch when network reconnects
        dedupingInterval: 60000,      // Dedupe requests within 60 seconds
    });

    // Transform raw data for CascadingDropdown
    const transformedData = (rawData || []).map(mapToEquipment);

    return {
        equipmentList: transformedData,      // For CascadingDropdown (transformed)
        rawEquipmentList: rawData || [],     // For DataAlat (raw DB format)
        isLoading,
        error,
        refresh: mutate, // Call this after add/delete/edit to update all consumers
    };
}

// ============================================
// Helper functions (work with pre-fetched data)
// ============================================

export const getUniqueLevel1 = (data: Equipment[]) => {
    return Array.from(new Set(data.map((item) => item.level_1))).filter(Boolean);
};

export const getLevel2ByLevel1 = (data: Equipment[], level1: string) => {
    return Array.from(
        new Set(
            data.filter((item) => item.level_1 === level1).map((item) => item.level_2)
        )
    ).filter(Boolean);
};

export const getLevel3ByLevel1And2 = (data: Equipment[], level1: string, level2: string) => {
    return Array.from(
        new Set(
            data.filter(
                (item) => item.level_1 === level1 && item.level_2 === level2
            ).map((item) => item.level_3)
        )
    ).filter(Boolean);
};

export const getEquipmentByLevels = (
    data: Equipment[],
    level1: string,
    level2: string,
    level3: string
) => {
    return data.find(
        (item) =>
            item.level_1 === level1 &&
            item.level_2 === level2 &&
            item.level_3 === level3
    );
};

export const getEquipmentByFullLabel = (data: Equipment[], fullLabel: string) => {
    return data.find((item) => item.full_label === fullLabel);
};
