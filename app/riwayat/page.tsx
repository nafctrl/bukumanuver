import Link from 'next/link';

export default function RiwayatPage() {
    return (
        <main className="min-h-screen bg-[#fdfbf7] text-gray-800 p-2 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Riwayat Manuver</h1>
                    <Link
                        href="/"
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                        title="Menu Utama"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </Link>
                </header>

                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center">
                    <h2 className="text-2xl font-bold text-slate-700 mb-2">Coming Soon</h2>
                    <p className="text-slate-500">Fitur Riwayat Manuver sedang dalam pengembangan.</p>
                </div>

                <footer className="text-center text-gray-400 text-xs mt-12 pb-8">
                    &copy; {new Date().getFullYear()} ManuverLog. Designed for heavy-duty switching operations.
                </footer>
            </div>
        </main>
    );
}
