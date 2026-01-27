'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface UserData {
    name: string;
    email: string;
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            // Try to get data from contractors table
            const { data: contractorData } = await supabase
                .from('contractors')
                .select('name, email')
                .eq('user_id', user.id)
                .single();

            if (contractorData) {
                setUserData({
                    name: contractorData.name,
                    email: contractorData.email
                });
                setLoading(false);
                return;
            }

            // Try to get data from requesters table
            const { data: requesterData } = await supabase
                .from('requesters')
                .select('name, email')
                .eq('user_id', user.id)
                .single();

            if (requesterData) {
                setUserData({
                    name: requesterData.name,
                    email: requesterData.email
                });
                setLoading(false);
                return;
            }

            // Fallback to auth email
            setUserData({
                name: user.email?.split('@')[0] || 'User',
                email: user.email || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (loading || !userData) {
        return null; // Don't show header until user data is loaded
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo/Brand */}
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900">LeadMan</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded border border-orange-200">BETA</span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">v3.0</span>
                    </div>
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={dropdownRef}>
                    {/* Profile Circle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-semibold flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                        aria-label="Open profile menu"
                    >
                        {getInitials(userData.name)}
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info Section */}
                            <div className="p-6 bg-gradient-to-br from-cyan-50 to-sky-50 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                    {/* Large Avatar */}
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold text-xl flex items-center justify-center border-2 border-white shadow-md">
                                        {getInitials(userData.name)}
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 font-bold text-lg truncate">
                                            {userData.name}
                                        </p>
                                        <p className="text-gray-600 text-sm truncate">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Dark Mode Toggle - Coming Soon */}
                            <div className="px-3 py-2 border-b border-gray-200">
                                <div className="w-full flex items-center justify-between px-4 py-3 text-gray-400 rounded-xl cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                            />
                                        </svg>
                                        <span className="font-semibold">Dark Mode</span>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold">Coming Soon</span>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <div className="p-3">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-semibold group"
                                >
                                    <svg
                                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
