'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        const handleRedirect = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/');
                return;
            }

            try {
                // Get user role from profiles
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role === 'contractor') {
                    router.push('/contractor/dashboard');
                } else if (profile?.role === 'requester') {
                    router.push('/requester/dashboard');
                } else {
                    // Fallback if no specific role or unknown
                    // Try to guess by checking other tables if needed, 
                    // but usually profiles should have it.
                    router.push('/');
                }
            } catch (error) {
                console.error('Error in dashboard redirect:', error);
                router.push('/');
            }
        };

        handleRedirect();
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 flex flex-col items-center max-w-sm w-full gap-6 text-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Syncing Dashboard</h1>
                    <p className="text-gray-500 font-medium">Getting everything ready for you...</p>
                </div>
            </div>
        </div>
    );
}
