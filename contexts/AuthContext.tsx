'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    kode_gardu: string;
    nama_gardu: string;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    isMaster: boolean;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    // Check if user is master account
    const isMaster = user?.email === 'master@pln.login';

    // Fetch profile from profiles table
    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, kode_gardu, nama_gardu')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data as Profile;
    };

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (currentUser) {
                setUser(currentUser);
                const userProfile = await fetchProfile(currentUser.id);
                setProfile(userProfile);
            }

            setIsLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sign in with username (will be converted to email)
    const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
        // Convert username to email format: username@pln.login
        const email = `${username.toLowerCase().trim()}@pln.login`;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Map common errors to user-friendly messages
            if (error.message.includes('Invalid login credentials')) {
                return { error: 'Username atau password salah!' };
            }
            if (error.message.includes('Email not confirmed')) {
                return { error: 'Akun belum diaktivasi. Hubungi admin.' };
            }
            return { error: error.message };
        }

        if (data.user) {
            setUser(data.user);
            const userProfile = await fetchProfile(data.user.id);
            setProfile(userProfile);
        }

        return { error: null };
    };

    // Sign out
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, isMaster, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
