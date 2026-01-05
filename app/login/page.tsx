'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_VERSION } from '@/components/ChangeLog';
import ChangeLogModal from '@/components/ChangeLog';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);

    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !password.trim()) {
            setError('Lengkapi username dan password!');
            return;
        }

        setIsLoading(true);

        const { error: signInError } = await signIn(username, password);

        if (signInError) {
            setError(signInError);
            setIsLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    };

    return (
        <main className="min-h-screen bg-[#fdfbf7] p-6 md:p-10 flex flex-col items-center justify-center">
            {/* Login Form - Centered */}
            <div className="w-full max-w-sm">
                {/* Version Badge - Small, above branding */}
                <div className="mb-3">
                    <button
                        onClick={() => setIsChangeLogOpen(true)}
                        className="bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full text-[10px] font-medium hover:bg-orange-200 transition-colors"
                        title="Lihat Changelog"
                    >
                        {APP_VERSION}
                    </button>
                </div>
                {/* Branding */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-10">
                    Buku<span className="text-orange-500">Manuver</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            className="w-full bg-transparent border-b-2 border-gray-200 pb-2 text-gray-800 placeholder-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-xs text-gray-400 mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            className="w-full bg-transparent border-b-2 border-gray-200 pb-2 pr-10 text-gray-800 placeholder-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-8"
                    >
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                {/* Footer - Centered, close to button */}
                <p className="text-xs text-gray-400 text-left mt-8">
                    Hubungi garduindukbatang@gmail.com atau +6281125212388 untuk mendapatkan akun
                </p>
            </div>
            <ChangeLogModal isOpen={isChangeLogOpen} onClose={() => setIsChangeLogOpen(false)} />
        </main>
    );
}

