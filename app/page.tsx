'use client';

import Link from 'next/link';
import { VersionBadgeClickable } from '@/components/ChangeLog';

export default function Home() {
  const menuItems = [
    { title: 'Data Peralatan', href: '/peralatan', description: 'Kelola database switchgear' },
    { title: 'Catat Manuver', href: '/catat', description: 'Buat catatan manuver baru' },
    { title: 'Riwayat Manuver', href: '/riwayat', description: 'Lihat riwayat manuver' },
  ];

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-gray-800 p-4 md:p-8 font-sans flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Buku<span className="text-orange-500">Manuver</span>
          </h1>
          <p className="text-gray-500 text-lg">Smart Switching Logbook System</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-8 text-center hover:border-orange-400 hover:shadow-md transition-all duration-200"
            >
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Version Badge - Clickable */}
        <div className="text-center mt-12">
          <VersionBadgeClickable />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs pb-8">
        &copy; {new Date().getFullYear()} ManuverLog. Designed for heavy-duty switching operations.
      </footer>
    </main>
  );
}
