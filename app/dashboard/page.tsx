'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

interface Lead {
    id: string;
    name: string;
    phone: string;
    zip_code: string;
    trade_type: string;
    job_description: string;
    created_at: string;
    requesters?: {
        is_verified: boolean;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [contractor, setContractor] = useState<any>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/');
            return;
        }

        setUser(user);

        // Get contractor info
        const { data: contractorData } = await supabase
            .from('contractors')
            .select('*')
            .eq('user_id', user.id)
            .single();

        setContractor(contractorData);

        // Check if contractor is approved by admin
        if (contractorData && contractorData.verification_status !== 'verified') {
            router.push('/contractor/pending');
            return;
        }


        // Get leads with requester info (show preview for all contractors)
        const { data: leadsData } = await supabase
            .from('leads')
            .select(`
                *,
                requesters (
                    is_verified
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        setLeads(leadsData || []);
        setIsLoading(false);
    };

    const handleUnlockLeads = async () => {
        if (!user) return;

        setIsCheckoutLoading(true);

        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                }),
            });

            const { url, error } = await response.json();

            if (error) {
                alert('Error: ' + error);
                return;
            }

            window.location.href = url;
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to start checkout');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const isSubscribed = contractor?.subscription_status === 'active';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-8 pt-24">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
                                <p className="text-gray-600 mt-1">Welcome back, {contractor?.name}!</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {!isSubscribed && (
                                    <div className="bg-amber-100 px-4 py-2 rounded-lg border border-amber-300">
                                        <p className="text-amber-800 font-semibold text-sm">Preview Mode</p>
                                    </div>
                                )}
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.push('/');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Unlock Banner (for unpaid contractors) */}
                    {!isSubscribed && (
                        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 shadow-lg mb-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">🔓 Unlock Full Lead Access</h2>
                                    <p className="text-cyan-100">Get phone numbers and contact info for just <span className="font-bold">$1 for your first month</span></p>
                                </div>
                                <button
                                    onClick={handleUnlockLeads}
                                    disabled={isCheckoutLoading}
                                    className="bg-white text-cyan-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {isCheckoutLoading ? 'Loading...' : 'Unlock Now'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Leads Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isSubscribed ? 'Your Leads' : 'Available Leads Preview'}
                            </h2>
                            <div className="bg-cyan-100 px-4 py-2 rounded-lg">
                                <p className="text-cyan-800 font-bold">{leads.length} Leads</p>
                            </div>
                        </div>

                        {leads.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-lg">No leads available yet</p>
                                <p className="text-gray-500 text-sm mt-2">Check back soon for new opportunities!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {leads.map((lead) => (
                                    <div key={lead.id} className="border border-gray-200 rounded-xl p-5 hover:border-cyan-400 transition-all relative">
                                        {/* Blur overlay for unpaid contractors */}
                                        {!isSubscribed && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 text-cyan-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    <p className="text-gray-900 font-bold">Unlock to View Contact Info</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    <div className="inline-block bg-cyan-100 px-3 py-1 rounded-lg text-sm font-semibold text-cyan-700">
                                                        {lead.trade_type}
                                                    </div>
                                                    {lead.requesters?.is_verified ? (
                                                        <div className="inline-block bg-green-100 px-3 py-1 rounded-lg text-sm font-semibold text-green-700 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Verified Customer
                                                        </div>
                                                    ) : (
                                                        <div className="inline-block bg-amber-100 px-3 py-1 rounded-lg text-sm font-semibold text-amber-700 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                            Unverified Lead
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">{lead.job_description}</h3>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Customer</p>
                                                <p className="font-semibold text-gray-900">
                                                    {isSubscribed ? lead.name : '████████'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Phone</p>
                                                <p className="font-semibold text-gray-900">
                                                    {isSubscribed ? lead.phone : '(███) ███-████'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Location</p>
                                                <p className="font-semibold text-gray-900">
                                                    {isSubscribed ? `Zip: ${lead.zip_code}` : 'Bay Area'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Status</p>
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">v2.7</span>
                                            </div>
                                        </div>

                                        {isSubscribed && (
                                            <button className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold transition-all">
                                                Contact Customer
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
