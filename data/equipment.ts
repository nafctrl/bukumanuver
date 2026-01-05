import { createClient } from '@/utils/supabase/client';

export interface Equipment {
    id: string;               // UUID from Supabase
    level_1: string;          // type (PMS, PMT, etc.)
    level_2: string;          // section (BUS A, 150KV, etc.)
    level_3: string;          // bay (BREBES 1, TRAFO 1, etc.)
    full_label: string;       // nama_lengkap
}

// Transform Supabase row to Equipment interface
function mapToEquipment(row: any): Equipment {
    return {
        id: row.id,
        level_1: row.type || '',
        level_2: row.section || '',
        level_3: row.bay || '',
        full_label: row.nama_lengkap || '',
    };
}

// Fetch equipment from Supabase with optional kode_gardu filter
export async function fetchEquipmentData(
    kodeGardu?: string,
    isMaster?: boolean
): Promise<Equipment[]> {
    const supabase = createClient();

    let query = supabase
        .from('peralatan')
        .select('id, type, section, bay, nama_lengkap')
        .order('type', { ascending: true })
        .order('section', { ascending: true })
        .order('bay', { ascending: true });

    // Filter by kode_gardu if not master and kodeGardu is provided
    if (!isMaster && kodeGardu) {
        query = query.eq('kode_gardu', kodeGardu);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching equipment:', error);
        return [];
    }

    return (data || []).map(mapToEquipment);
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
