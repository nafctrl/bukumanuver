/**
 * 📖 KAMUS DATA (TYPES)
 * 
 * File ini bertugas sebagai "Kamus" atau "Cetakan Biru".
 * Dia memberitahu komputer (dan programmer):
 * 1. Apa itu "RiwayatManuver": Data apa saja yang wajib ada (Judul, Tanggal, Pengawas, dll).
 * 2. Apa itu "RiwayatItem": Detail alat apa saja yang dicatat (Nama alat, Jam, Posisi switch).
 * 
 * Dengan file ini, semua file lain sepakat tentang bentuk data yang sama.
 */

export interface RiwayatManuver {
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

export interface RiwayatItem {
    id: string;
    nama_peralatan: string;
    posisi_switch: boolean;
    waktu: string;
    act: string;
    order_index: number;
    is_separator: boolean;
}
