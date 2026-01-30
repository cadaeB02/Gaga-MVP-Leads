'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    job_description: string;
    zip_code: string;
    trade_type: string;
    status_v2: 'new' | 'assigned' | 'revealed' | 'recycled' | 'closed';
    revealed_at: string | null;
    price: number;
    created_at: string;
}

export default function ContractorDashboard() {
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(0);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [revealingId, setRevealingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch contractor info
        const { data: contractorData } = await supabase
            .from('contractors')
            .select('name, license_status')
            .eq('user_id', user.id)
            .single();
        
        if (contractorData) {
            setUserName(contractorData.name);
            setStatus(contractorData.license_status);
        }

        // Fetch credit balance
        const { data: profileData } = await supabase
            .from('profiles')
            .select('lead_credits')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setCredits(profileData.lead_credits || 0);
        }

        // Fetch assigned leads
        const { data: leadsData } = await supabase
            .from('leads')
            .select('*')
            .eq('visible_to_user_id', user.id)
            .order('created_at', { ascending: false });

        if (leadsData) {
            setLeads(leadsData);
        }

        setLoading(false);
    };

    const handleReveal = async (leadId: string) => {
        setRevealingId(leadId);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            const response = await fetch('/api/leads/reveal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_id: leadId,
                    contractor_id: user.id
                })
            });

            const result = await response.json();

            if (result.error === 'insufficient_credits') {
                // Redirect to Stripe checkout for $40 payment
                const checkoutResponse = await fetch('/api/checkout-reveal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lead_id: leadId,
                        contractor_id: user.id
                    })
                });

                const checkoutData = await checkoutResponse.json();
                
                if (checkoutData.url) {
                    window.location.href = checkoutData.url;
                } else {
                    alert('Failed to initiate payment: ' + (checkoutData.error || 'Unknown error'));
                }
                return;
            }

            if (result.success) {
                // Update local state
                setCredits(result.credits_remaining);
                await fetchData(); // Refresh leads
            } else {
                alert('Failed to reveal lead: ' + result.error);
            }
        } catch (error) {
            console.error('Reveal error:', error);
            alert('An error occurred while revealing the lead');
        } finally {
            setRevealingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Hello, <span className="text-cyan-600">{userName || 'Partner'}</span>
                                </h1>
                                <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                                    status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {status === 'ACTIVE' ? 'Verified' : 'Verification Pending'}
                                </div>
                            </div>
                            <p className="text-xl text-gray-600">
                                Lead Management Command Center
                            </p>
                        </div>
                        
                        {/* Credit Balance */}
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-90 mb-1">My Credits</p>
                            <p className="text-5xl font-bold">{credits}</p>
                        </div>
                    </div>

                    {/* Verification Alert */}
                    {status === 'PENDING' && (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-8 flex items-start gap-4 shadow-sm">
                            <div className="bg-amber-100 p-3 rounded-2xl flex-shrink-0">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Verification in Progress</h3>
                                <p className="text-gray-700">
                                    Our team is verifying your license. You'll receive an email once approved.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Leads List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Assigned Leads ({leads.length})</h2>
                        
                        {leads.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Leads Yet</h3>
                                <p className="text-gray-600">Once verified, we'll start assigning exclusive leads to you.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {leads.map((lead) => (
                                    <div key={lead.id} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-xs font-bold text-cyan-600 px-3 py-1 bg-cyan-50 rounded-full uppercase">
                                                        {lead.trade_type}
                                                    </span>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                                        lead.status_v2 === 'revealed' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        {lead.status_v2}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                    {lead.status_v2 === 'revealed' ? lead.name : '████████'}
                                                </h3>
                                                
                                                <p className="text-gray-600 mb-4">{lead.job_description}</p>
                                                
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Phone</p>
                                                        <p className="font-bold text-gray-900">
                                                            {lead.status_v2 === 'revealed' ? lead.phone : '(███) ███-████'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Email</p>
                                                        <p className="font-bold text-gray-900">
                                                            {lead.status_v2 === 'revealed' ? lead.email : '████@████.com'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Location</p>
                                                        <p className="font-bold text-gray-900">Zip: {lead.zip_code}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Assigned</p>
                                                        <p className="font-bold text-gray-900">
                                                            {new Date(lead.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Reveal Button */}
                                            <div className="flex-shrink-0">
                                                {lead.status_v2 === 'assigned' ? (
                                                    <button
                                                        onClick={() => handleReveal(lead.id)}
                                                        disabled={revealingId === lead.id}
                                                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {revealingId === lead.id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                                Revealing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                🔓 Reveal (1 Credit)
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="bg-green-100 text-green-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2">
                                                        ✅ Revealed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
