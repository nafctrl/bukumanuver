// Dummy items untuk riwayat manuver
// Menggunakan peralatan dari contohalat.ts dengan urutan yang realistis

export interface RiwayatItem {
    id: string;
    riwayat_id: string;
    nama_peralatan: string;
    posisi_switch: boolean; // true = '//', false = '#'
    waktu: string;
    act: string;
    order_index: number;
    is_separator: boolean;
    created_at: string;
}

// Helper untuk generate items
const createItem = (riwayatId: string, index: number, nama: string, posisi: string, waktu: string, act: string): RiwayatItem => ({
    id: `item-${riwayatId}-${index}`,
    riwayat_id: riwayatId,
    nama_peralatan: nama,
    posisi_switch: posisi === '//', // Convert string to boolean
    waktu,
    act,
    order_index: index,
    is_separator: false,
    created_at: new Date().toISOString()
});

export const DUMMY_RIWAYAT_ITEMS: Record<string, RiwayatItem[]> = {
    'dummy-1': [
        createItem('dummy-1', 1, 'PMS BUS A PEKALONGAN 1', '#', '08:15', 'R.ACC'),
        createItem('dummy-1', 2, 'PMT 150KV PEKALONGAN 1', '//', '08:18', 'R.ACC'),
        createItem('dummy-1', 3, 'PMS LINE PEKALONGAN 1', '//', '08:22', 'Local'),
        createItem('dummy-1', 4, 'PMS GROUND PEKALONGAN 1', '#', '08:25', 'Local'),
        createItem('dummy-1', 5, 'PMS BUS B PEKALONGAN 1', '#', '08:30', 'R.ACC'),
    ],
    'dummy-2': [
        createItem('dummy-2', 1, 'PMS BUS A NEW BATANG 1', '#', '14:45', 'R.ACC'),
        createItem('dummy-2', 2, 'PMS BUS B NEW BATANG 1', '#', '14:50', 'R.ACC'),
        createItem('dummy-2', 3, 'PMT 150KV NEW BATANG 1', '//', '14:55', 'HMI'),
        createItem('dummy-2', 4, 'PMS LINE NEW BATANG 1', '//', '15:00', 'Local'),
        createItem('dummy-2', 5, 'PMS GROUND NEW BATANG 1', '#', '15:05', 'Local'),
        createItem('dummy-2', 6, 'PMT 150KV NEW BATANG 1', '#', '15:10', 'HMI'),
        createItem('dummy-2', 7, 'PMS LINE NEW BATANG 1', '#', '15:15', 'Local'),
    ],
    'dummy-3': [
        createItem('dummy-3', 1, 'PMT 150KV PEKALONGAN 2', '//', '03:20', 'HMI'),
        createItem('dummy-3', 2, 'PMS LINE PEKALONGAN 2', '//', '03:25', 'Local'),
        createItem('dummy-3', 3, 'PMS GROUND PEKALONGAN 2', '#', '03:28', 'Local'),
    ],
    'dummy-4': [
        createItem('dummy-4', 1, 'PMS BUS A TRAFO 1', '#', '10:15', 'R.ACC'),
        createItem('dummy-4', 2, 'PMS BUS B TRAFO 1', '#', '10:18', 'R.ACC'),
        createItem('dummy-4', 3, 'PMT 150 KV TRAFO 1', '//', '10:22', 'HMI'),
        createItem('dummy-4', 4, 'PMT INC 20 KV TRAFO 1', '//', '10:28', 'HMI'),
        createItem('dummy-4', 5, 'PMS BUS A TRAFO 1', '//', '10:35', 'Local'),
        createItem('dummy-4', 6, 'PMT 150 KV TRAFO 1', '#', '10:40', 'HMI'),
        createItem('dummy-4', 7, 'PMS BUS A TRAFO 1', '#', '10:45', 'R.ACC'),
        createItem('dummy-4', 8, 'PMT INC 20 KV TRAFO 1', '#', '10:50', 'HMI'),
    ],
    'dummy-5': [
        createItem('dummy-5', 1, 'PMS BUS A KAPASITOR', '#', '07:10', 'R.ACC'),
        createItem('dummy-5', 2, 'PMS BUS B KAPASITOR', '#', '07:15', 'R.ACC'),
        createItem('dummy-5', 3, 'PMT 150 KV KAPASITOR', '//', '07:20', 'HMI'),
        createItem('dummy-5', 4, 'PMS GROUND KAPASITOR', '//', '07:25', 'Local'),
        createItem('dummy-5', 5, 'PMT 150 KV KAPASITOR', '#', '07:35', 'HMI'),
    ],
    'dummy-6': [
        createItem('dummy-6', 1, 'PMT 150KV NEW BATANG 2', '//', '09:40', 'HMI'),
        createItem('dummy-6', 2, 'PMS LINE NEW BATANG 2', '//', '09:45', 'Local'),
        createItem('dummy-6', 3, 'PMS GROUND NEW BATANG 2', '#', '09:50', 'Local'),
        createItem('dummy-6', 4, 'PMT 150KV NEW BATANG 2', '#', '09:58', 'HMI'),
    ],
    'dummy-7': [
        createItem('dummy-7', 1, 'PMS BUS A TRAFO 2', '#', '13:50', 'R.ACC'),
        createItem('dummy-7', 2, 'PMS BUS B TRAFO 2', '#', '13:55', 'R.ACC'),
        createItem('dummy-7', 3, 'PMT INC 20 KV TRAFO 17', '//', '14:00', 'HMI'),
        createItem('dummy-7', 4, 'PMT 150 KV TRAFO 2', '//', '14:05', 'HMI'),
        createItem('dummy-7', 5, 'PMS BUS A TRAFO 2', '//', '14:12', 'Local'),
        createItem('dummy-7', 6, 'PMT 150 KV TRAFO 2', '#', '14:20', 'HMI'),
        createItem('dummy-7', 7, 'PMT INC 20 KV TRAFO 17', '#', '14:25', 'HMI'),
        createItem('dummy-7', 8, 'PMS BUS A TRAFO 2', '#', '14:30', 'R.ACC'),
        createItem('dummy-7', 9, 'PMS BUS B TRAFO 2', '//', '14:35', 'R.ACC'),
    ],
    'dummy-8': [
        createItem('dummy-8', 1, 'PMS BUS A PEKALONGAN 2', '#', '11:10', 'R.ACC'),
        createItem('dummy-8', 2, 'PMS BUS B PEKALONGAN 2', '#', '11:15', 'R.ACC'),
        createItem('dummy-8', 3, 'PMT 150KV PEKALONGAN 2', '//', '11:20', 'HMI'),
        createItem('dummy-8', 4, 'PMS LINE PEKALONGAN 2', '//', '11:25', 'Local'),
        createItem('dummy-8', 5, 'PMT 150KV PEKALONGAN 2', '#', '11:35', 'HMI'),
    ],
    'dummy-9': [
        createItem('dummy-9', 1, 'PMS BUS A NEW BATANG 2', '#', '08:20', 'R.ACC'),
        createItem('dummy-9', 2, 'PMT 150KV NEW BATANG 2', '//', '08:25', 'HMI'),
        createItem('dummy-9', 3, 'PMS LINE NEW BATANG 2', '//', '08:30', 'Local'),
        createItem('dummy-9', 4, 'PMS GROUND NEW BATANG 2', '#', '08:35', 'Manual'),
        createItem('dummy-9', 5, 'PMT 150KV NEW BATANG 2', '#', '08:42', 'HMI'),
        createItem('dummy-9', 6, 'PMS BUS B NEW BATANG 2', '#', '08:48', 'R.ACC'),
    ],
    'dummy-10': [
        createItem('dummy-10', 1, 'PMS BUS A TRAFO 1', '#', '00:30', 'R.ACC'),
        createItem('dummy-10', 2, 'PMT 150 KV TRAFO 1', '//', '00:35', 'HMI'),
        createItem('dummy-10', 3, 'PMS BUS A TRAFO 2', '#', '00:40', 'R.ACC'),
        createItem('dummy-10', 4, 'PMT 150 KV TRAFO 2', '//', '00:45', 'HMI'),
        createItem('dummy-10', 5, 'PMS BUS A KAPASITOR', '#', '00:50', 'R.ACC'),
        createItem('dummy-10', 6, 'PMT 150 KV KAPASITOR', '//', '00:55', 'HMI'),
        createItem('dummy-10', 7, 'PMT 150KV PEKALONGAN 1', '//', '01:00', 'HMI'),
        createItem('dummy-10', 8, 'PMT 150KV NEW BATANG 1', '//', '01:05', 'HMI'),
    ],
    'dummy-11': [
        createItem('dummy-11', 1, 'PMS BUS A PEKALONGAN 1', '#', '14:10', 'R.ACC'),
        createItem('dummy-11', 2, 'PMT 150KV PEKALONGAN 1', '//', '14:15', 'HMI'),
        createItem('dummy-11', 3, 'PMS LINE PEKALONGAN 1', '//', '14:20', 'Local'),
        createItem('dummy-11', 4, 'PMT 150KV PEKALONGAN 2', '//', '14:25', 'HMI'),
    ],
    'dummy-12': [
        createItem('dummy-12', 1, 'PMT 150KV NEW BATANG 1', '//', '10:35', 'HMI'),
        createItem('dummy-12', 2, 'PMS LINE NEW BATANG 1', '//', '10:40', 'Local'),
        createItem('dummy-12', 3, 'PMS GROUND NEW BATANG 1', '#', '10:45', 'Local'),
    ],
    'dummy-13': [
        createItem('dummy-13', 1, 'PMT 150KV PEKALONGAN 1', '//', '02:35', 'Manual'),
        createItem('dummy-13', 2, 'PMS LINE PEKALONGAN 1', '//', '02:40', 'Manual'),
        createItem('dummy-13', 3, 'PMS GROUND PEKALONGAN 1', '#', '02:45', 'Manual'),
        createItem('dummy-13', 4, 'PMS BUS A PEKALONGAN 2', '#', '02:52', 'Manual'),
        createItem('dummy-13', 5, 'PMT 150KV PEKALONGAN 2', '//', '02:58', 'Manual'),
    ],
    'dummy-14': [
        createItem('dummy-14', 1, 'PMS BUS A PEKALONGAN 2', '#', '09:10', 'R.ACC'),
        createItem('dummy-14', 2, 'PMT 150KV PEKALONGAN 2', '//', '09:15', 'HMI'),
        createItem('dummy-14', 3, 'PMS LINE PEKALONGAN 2', '//', '09:20', 'Local'),
        createItem('dummy-14', 4, 'PMT 150KV PEKALONGAN 2', '#', '09:30', 'HMI'),
    ],
    'dummy-15': [
        createItem('dummy-15', 1, 'PMS BUS A NEW BATANG 1', '#', '07:40', 'R.ACC'),
        createItem('dummy-15', 2, 'PMS BUS B NEW BATANG 1', '#', '07:45', 'R.ACC'),
        createItem('dummy-15', 3, 'PMT 150KV NEW BATANG 1', '//', '07:50', 'HMI'),
        createItem('dummy-15', 4, 'PMS LINE NEW BATANG 1', '//', '07:55', 'Local'),
        createItem('dummy-15', 5, 'PMS GROUND NEW BATANG 1', '#', '08:00', 'Local'),
        createItem('dummy-15', 6, 'PMT 150KV NEW BATANG 1', '#', '08:10', 'HMI'),
        createItem('dummy-15', 7, 'PMS BUS A NEW BATANG 2', '#', '08:15', 'R.ACC'),
        createItem('dummy-15', 8, 'PMT 150KV NEW BATANG 2', '//', '08:20', 'HMI'),
    ],
    'dummy-16': [
        createItem('dummy-16', 1, 'PMS BUS A TRAFO 1', '#', '08:50', 'R.ACC'),
        createItem('dummy-16', 2, 'PMT 150 KV TRAFO 1', '//', '08:55', 'HMI'),
        createItem('dummy-16', 3, 'PMT INC 20 KV TRAFO 1', '//', '09:00', 'HMI'),
        createItem('dummy-16', 4, 'PMT 150 KV TRAFO 1', '#', '09:10', 'HMI'),
    ],
    'dummy-17': [
        createItem('dummy-17', 1, 'PMS BUS A PEKALONGAN 1', '#', '13:20', 'R.ACC'),
        createItem('dummy-17', 2, 'PMT 150KV PEKALONGAN 1', '//', '13:25', 'HMI'),
        createItem('dummy-17', 3, 'PMS LINE PEKALONGAN 1', '//', '13:30', 'Local'),
        createItem('dummy-17', 4, 'PMS BUS A PEKALONGAN 2', '#', '13:35', 'R.ACC'),
        createItem('dummy-17', 5, 'PMT 150KV PEKALONGAN 2', '//', '13:40', 'HMI'),
        createItem('dummy-17', 6, 'PMS LINE PEKALONGAN 2', '#', '13:48', 'Local'),
    ],
    'dummy-18': [
        createItem('dummy-18', 1, 'PMS BUS A PEKALONGAN 1', '#', '07:10', 'R.ACC'),
        createItem('dummy-18', 2, 'PMS BUS B PEKALONGAN 1', '#', '07:15', 'R.ACC'),
        createItem('dummy-18', 3, 'PMS BUS A PEKALONGAN 2', '#', '07:20', 'R.ACC'),
        createItem('dummy-18', 4, 'PMS BUS B PEKALONGAN 2', '#', '07:25', 'R.ACC'),
    ],
    'dummy-19': [
        createItem('dummy-19', 1, 'PMS BUS A NEW BATANG 1', '#', '09:50', 'R.ACC'),
        createItem('dummy-19', 2, 'PMT 150KV NEW BATANG 1', '//', '09:55', 'HMI'),
        createItem('dummy-19', 3, 'PMS LINE NEW BATANG 1', '//', '10:00', 'Manual'),
        createItem('dummy-19', 4, 'PMS GROUND NEW BATANG 1', '#', '10:05', 'Manual'),
        createItem('dummy-19', 5, 'PMT 150KV NEW BATANG 1', '#', '10:15', 'HMI'),
    ],
    'dummy-20': [
        createItem('dummy-20', 1, 'PMS BUS A TRAFO 1', '#', '20:10', 'R.ACC'),
        createItem('dummy-20', 2, 'PMT 150 KV TRAFO 1', '//', '20:15', 'HMI'),
        createItem('dummy-20', 3, 'PMT INC 20 KV TRAFO 1', '//', '20:20', 'HMI'),
        createItem('dummy-20', 4, 'PMS BUS A TRAFO 1', '//', '20:30', 'Local'),
        createItem('dummy-20', 5, 'PMT 150 KV TRAFO 1', '#', '20:40', 'HMI'),
        createItem('dummy-20', 6, 'PMT INC 20 KV TRAFO 1', '#', '20:45', 'HMI'),
        createItem('dummy-20', 7, 'PMS BUS A TRAFO 1', '#', '20:50', 'R.ACC'),
    ],
    'dummy-21': [
        createItem('dummy-21', 1, 'PMS BUS A PEKALONGAN 1', '#', '08:10', 'R.ACC'),
        createItem('dummy-21', 2, 'PMS GROUND PEKALONGAN 1', '#', '08:15', 'Local'),
        createItem('dummy-21', 3, 'PMS GROUND PEKALONGAN 2', '#', '08:20', 'Local'),
    ],
    'dummy-22': [
        createItem('dummy-22', 1, 'PMS BUS A PEKALONGAN 1', '#', '10:20', 'R.ACC'),
        createItem('dummy-22', 2, 'PMT 150KV PEKALONGAN 1', '//', '10:25', 'HMI'),
        createItem('dummy-22', 3, 'PMS LINE PEKALONGAN 1', '//', '10:30', 'Local'),
        createItem('dummy-22', 4, 'PMS GROUND PEKALONGAN 1', '#', '10:35', 'Local'),
        createItem('dummy-22', 5, 'PMT 150KV PEKALONGAN 1', '#', '10:45', 'HMI'),
    ],
    'dummy-23': [
        createItem('dummy-23', 1, 'PMS BUS A NEW BATANG 2', '#', '06:35', 'R.ACC'),
        createItem('dummy-23', 2, 'PMS BUS B NEW BATANG 2', '#', '06:40', 'R.ACC'),
        createItem('dummy-23', 3, 'PMT 150KV NEW BATANG 2', '//', '06:45', 'HMI'),
        createItem('dummy-23', 4, 'PMS LINE NEW BATANG 2', '//', '06:50', 'Local'),
        createItem('dummy-23', 5, 'PMS GROUND NEW BATANG 2', '#', '06:55', 'Local'),
        createItem('dummy-23', 6, 'PMT 150KV NEW BATANG 2', '#', '07:05', 'HMI'),
        createItem('dummy-23', 7, 'PMS LINE NEW BATANG 2', '#', '07:10', 'Local'),
        createItem('dummy-23', 8, 'PMS BUS A NEW BATANG 2', '//', '07:15', 'R.ACC'),
    ],
    'dummy-24': [
        createItem('dummy-24', 1, 'PMT 150 KV TRAFO 1', '//', '05:10', 'Manual'),
        createItem('dummy-24', 2, 'PMT 150 KV TRAFO 2', '//', '05:15', 'Manual'),
        createItem('dummy-24', 3, 'PMT 150KV PEKALONGAN 1', '//', '05:20', 'Manual'),
        createItem('dummy-24', 4, 'PMT 150KV NEW BATANG 1', '//', '05:25', 'Manual'),
        createItem('dummy-24', 5, 'PMT 150 KV KAPASITOR', '//', '05:30', 'Manual'),
    ],
    'dummy-25': [
        createItem('dummy-25', 1, 'PMS BUS A NEW BATANG 1', '#', '07:50', 'R.ACC'),
        createItem('dummy-25', 2, 'PMS BUS B NEW BATANG 1', '#', '07:55', 'R.ACC'),
        createItem('dummy-25', 3, 'PMT 150KV NEW BATANG 1', '//', '08:00', 'HMI'),
        createItem('dummy-25', 4, 'PMS LINE NEW BATANG 1', '//', '08:05', 'Local'),
        createItem('dummy-25', 5, 'PMS GROUND NEW BATANG 1', '#', '08:10', 'Local'),
        createItem('dummy-25', 6, 'PMT 150KV NEW BATANG 1', '#', '08:20', 'HMI'),
    ],
};
