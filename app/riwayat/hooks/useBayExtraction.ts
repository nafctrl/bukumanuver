/**
 * useBayExtraction Hook
 * 
 * RESPONSIBILITIES:
 * - Extract bay names from riwayat items
 * - Handle both dummy data (sync) and real data (async)
 * - **FIX N+1 QUERY**: Batch fetch all real data bays in single query
 * - Compute combined bay map for all riwayat
 * 
 * NOT RESPONSIBLE FOR:
 * - Fetching riwayat list
 * - Rendering bay cells
 * - Managing filter state
 * 
 * @param riwayatList - List of all riwayat to extract bays from
 * @param sortedList - Sorted/filtered list for display
 * @returns riwayatBays - Map of riwayat IDs to their bay names
 */

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DUMMY_RIWAYAT_ITEMS } from '@/utils/dummyRiwayatItems';

interface RiwayatManuver {
    id: string;
    [key: string]: any;
}

export function useBayExtraction(riwayatList: RiwayatManuver[], sortedList: RiwayatManuver[]) {
    const [realDataBays, setRealDataBays] = useState<Record<string, string[]>>({});
    const supabase = createClient();

    // Fetch bay names for real data - FIXED N+1 QUERY
    useEffect(() => {
        const fetchRealBays = async () => {
            const realRiwayat = riwayatList.filter(r => !r.id.startsWith('dummy-'));
            if (realRiwayat.length === 0) return;

            const riwayatIds = realRiwayat.map(r => r.id);

            // 🎯 BATCH QUERY: Single query instead of loop
            const { data, error } = await supabase
                .from('riwayat_items')
                .select('riwayat_id, nama_peralatan')
                .in('riwayat_id', riwayatIds);

            if (error) {
                console.error('Failed to fetch bay names:', error);
                return;
            }

            if (!data || data.length === 0) return;

            // Group by riwayat_id
            const baysData: Record<string, string[]> = {};

            data.forEach(item => {
                const parts = item.nama_peralatan.split(' ');
                const bay = parts.slice(-2).join(' ');

                if (!baysData[item.riwayat_id]) {
                    baysData[item.riwayat_id] = [];
                }

                // Add if unique
                if (bay && !baysData[item.riwayat_id].includes(bay)) {
                    baysData[item.riwayat_id].push(bay);
                }
            });

            setRealDataBays(baysData);
        };

        fetchRealBays();
    }, [riwayatList]);

    // Pre-compute bay names for all riwayat to avoid flickering
    const riwayatBays = useMemo(() => {
        const baysMap: Record<string, string[]> = {};

        sortedList.forEach(riwayat => {
            if (riwayat.id.startsWith('dummy-')) {
                const items = DUMMY_RIWAYAT_ITEMS[riwayat.id] || [];
                const uniqueBays = items
                    .map(item => {
                        const parts = item.nama_peralatan.split(' ');
                        return parts.slice(-2).join(' ');
                    })
                    .filter((bay, index, self) => bay && self.indexOf(bay) === index);
                baysMap[riwayat.id] = uniqueBays;
            } else {
                // Use pre-fetched real data bays
                baysMap[riwayat.id] = realDataBays[riwayat.id] || [];
            }
        });

        return baysMap;
    }, [sortedList, realDataBays]);

    return riwayatBays;
}
