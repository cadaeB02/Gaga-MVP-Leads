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
    status: string;
    tier: string;
    is_verified?: boolean;
    visible_to_user_id?: string;
    claimed_at?: string;
    is_relead?: boolean;
    requesters?: {
        is_verified: boolean;
    };
}

interface Profile {
    id: string;
    role: string;
    lead_credits: number;
    beta_opt_in: boolean;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [contractor, setContractor] = useState<any>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
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

        // Get profile info (for credits)
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        setProfile(profileData);

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

        // Get leads assigned specifically to this contractor OR eligible standard leads
        // Note: RLS handles the heavy lifting of security
        const { data: leadsData } = await supabase
            .from('leads')
            .select(`
                *,
                requesters (
                    is_verified
                )
            `)
            .order('created_at', { ascending: false });

        setLeads(leadsData || []);
        setIsLoading(false);
    };

    const handleRevealLead = async (leadId: string, tier: string = 'premium') => {
        if (!user || !profile) return;

        // Standard leads require a $20 credit, Premium $40.
        // For now, if we use a unified credit system where 1 credit = $40,
        // we might need to adjust. If 1 credit = 1 lead regardless,
        // we just subtract 1.
        // However, if we want to support $20 leads, we should probably 
        // trigger a specific checkout for $20 if they don't have credits.
        
        if (profile.lead_credits <= 0) {
            handleUnlockLeads('payment', tier === 'standard' ? 2000 : 4000);
            return;
        }

        setIsActionLoading(leadId);

        try {
            // 1. Update the lead status and set claimed_at
            const { error: leadError } = await supabase
                .from('leads')
                .update({
                    status: 'CLAIMED',
                    claimed_at: new Date().toISOString()
                })
                .eq('id', leadId);

            if (leadError) throw leadError;

            // 2. Subtract 1 from credits (Atomic decrement would be better)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ lead_credits: Math.max(0, profile.lead_credits - 1) })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 3. Refresh data
            await checkAuth();
            alert('Lead claimed! You can now view the contact info.');
        } catch (err) {
            console.error('Reveal error:', err);
            alert('Failed to unlock lead');
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleUnlockLeads = async (type: 'payment' | 'subscription' = 'payment', priceAmount?: number) => {
        if (!user) return;

        setIsCheckoutLoading(true);

        try {
            const defaultPrice = type === 'payment' ? 4000 : 6000;
            const finalPrice = priceAmount || defaultPrice;

            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    priceAmount: finalPrice,
                    type: type,
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
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-8 pt-32 md:pt-40">
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

                    {/* Stats Bar - Only show if subscribed */}
                    {isSubscribed && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Available Credits</p>
                                    <h2 className="text-3xl font-bold text-gray-900 mt-1">{profile?.lead_credits || 0}</h2>
                                </div>
                                <div className="bg-cyan-100 p-3 rounded-xl">
                                    <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Jobs</p>
                                    <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                        {leads.filter(l => ['CLAIMED', 'MATCHED'].includes(l.status)).length}
                                    </h2>
                                </div>
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-6 shadow-lg text-white group cursor-pointer" onClick={() => handleUnlockLeads('payment')}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-cyan-100 text-sm font-semibold uppercase tracking-wider">Buy Credits</p>
                                        <h2 className="text-2xl font-bold mt-1">$40 / Lead</h2>
                                    </div>
                                    <button className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-all">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leads Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        {!isSubscribed ? (
                            <div className="text-center py-16 px-4">
                                <div className="bg-cyan-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cyan-100">
                                    <svg className="w-12 h-12 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Maintenance Retainer Required</h2>
                                <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
                                    To unlock the Assigned Marketplace and start receiving exclusive leads, you must activate your monthly maintenance retainer of <strong>$60/month</strong>.
                                </p>
                                <button
                                    onClick={() => handleUnlockLeads('subscription')}
                                    disabled={isCheckoutLoading}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {isCheckoutLoading ? 'Starting Secure Checkout...' : 'Activate Monthly Retainer'}
                                </button>
                                <p className="text-gray-400 text-xs mt-6">
                                    Secure payments powered by Stripe. Cancel anytime.
                                </p>
                            </div>
                        ) : leads.length === 0 ? (
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
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Assigned Marketplace
                                    </h2>
                                    <div className="bg-cyan-100 px-4 py-2 rounded-lg">
                                        <p className="text-cyan-800 font-bold">{leads.length} Active Assignments</p>
                                    </div>
                                </div>
                                {leads.map((lead) => {
                                    const isRevealed = ['CLAIMED', 'MATCHED', 'CLOSED'].includes(lead.status);

                                    return (
                                        <div key={lead.id} className={`border rounded-2xl p-6 transition-all relative overflow-hidden ${isRevealed ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-cyan-400'
                                            }`}>
                                            {/* Status Badge */}
                                            <div className="absolute top-0 right-0">
                                                <div className={`px-4 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl text-white ${isRevealed ? 'bg-green-500' : 'bg-amber-400'
                                                    }`}>
                                                    {lead.status}
                                                </div>
                                            </div>

                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <div className="inline-block bg-cyan-100 px-3 py-1 rounded-lg text-xs font-bold text-cyan-700 uppercase">
                                                            {lead.trade_type}
                                                        </div>
                                                        {lead.tier === 'premium' ? (
                                                            <div className="inline-block bg-purple-100 px-3 py-1 rounded-lg text-xs font-bold text-purple-700 flex items-center gap-1">
                                                                <svg className="w-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Premium Exclusive
                                                            </div>
                                                        ) : (
                                                            <div className="inline-block bg-blue-100 px-3 py-1 rounded-lg text-xs font-bold text-blue-700 flex items-center gap-1">
                                                                Standard Pool ($20)
                                                            </div>
                                                        )}
                                                        {lead.requesters?.is_verified ? (
                                                            <div className="inline-block bg-green-100 px-3 py-1 rounded-lg text-xs font-bold text-green-700 flex items-center gap-1">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                Verified
                                                            </div>
                                                        ) : (
                                                            <div className="inline-block bg-amber-100 px-3 py-1 rounded-lg text-xs font-bold text-amber-700 flex items-center gap-1">
                                                                ⚠️ Unverified
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{lead.job_description}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Assigned {new Date(lead.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/50 rounded-xl border border-gray-100 mt-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Customer</p>
                                                        <p className="font-bold text-gray-900 border-b border-gray-100 pb-1">
                                                            {isRevealed ? lead.name : '████████'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                                                        <p className="font-bold text-cyan-600 text-lg">
                                                            {isRevealed ? lead.phone : '(███) ███-████'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Location</p>
                                                        <p className="font-bold text-gray-900 border-b border-gray-100 pb-1">
                                                            {isRevealed ? `Zip Code: ${lead.zip_code}` : 'Bay Area Region'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Lead Type</p>
                                                        <p className="font-bold text-gray-900">
                                                            {lead.is_relead ? '🔄 RE-LEAD' : '💎 ORIGINAL'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {!isRevealed ? (
                                                <button
                                                    onClick={() => handleRevealLead(lead.id, lead.tier)}
                                                    disabled={isActionLoading === lead.id}
                                                    className={`mt-6 w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
                                                        lead.tier === 'premium' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-blue-600 hover:bg-blue-700'
                                                    } text-white`}
                                                >
                                                    {isActionLoading === lead.id ? (
                                                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                            Claim Lead & Reveal Contact
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="mt-6 flex gap-3">
                                                    <a
                                                        href={`tel:${lead.phone}`}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-center transition-all shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                        </svg>
                                                        Call Now
                                                    </a>
                                                    <button className="flex-1 bg-white border-2 border-cyan-600 text-cyan-600 py-3 rounded-xl font-bold transition-all hover:bg-cyan-50">
                                                        Work Started
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
