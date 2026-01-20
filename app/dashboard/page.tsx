'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Contractor {
    id: number;
    user_id: string;
    name: string;
    email: string;
    subscription_status: string;
    license_status: string;
}

interface Lead {
    id: string;
    name: string;
    phone: string;
    zip_code: string;
    trade_type: string;
    job_description: string;
    created_at: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contractor, setContractor] = useState<Contractor | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingSession, setIsCreatingSession] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/');
            return;
        }

        // Fetch contractor data
        const { data: contractorData, error } = await supabase
            .from('contractors')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !contractorData) {
            console.error('Error fetching contractor:', error);
            router.push('/');
            return;
        }

        setContractor(contractorData);

        // Fetch leads
        const { data: leadsData } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        setLeads(leadsData || []);
        setIsLoading(false);
    };

    const handleSubscribe = async () => {
        if (!contractor) return;

        setIsCreatingSession(true);

        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: contractor.user_id,
                }),
            });

            const { url, error } = await response.json();

            if (error) {
                alert('Error creating checkout session: ' + error);
                return;
            }

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to start checkout');
        } finally {
            setIsCreatingSession(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                    <p className="text-gray-600 mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!contractor) {
        return null;
    }

    const isSubscribed = contractor.subscription_status === 'active';
    const sessionId = searchParams?.get('session_id');

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome, {contractor.name}!</h1>
                            <p className="text-gray-600 mt-1">Contractor Dashboard</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {contractor.license_status === 'ACTIVE' && (
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                                    ✓ License Verified
                                </span>
                            )}
                            {contractor.license_status === 'PENDING' && (
                                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-200">
                                    ⏳ Pending Verification
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {sessionId && isSubscribed && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-900">Subscription Active!</h3>
                                <p className="text-green-700">You now have full access to all leads. Start calling customers!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subscription Gate */}
                {!isSubscribed && contractor.license_status === 'ACTIVE' && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Unlock Leads</h2>
                            <p className="text-xl text-gray-600 mb-6">
                                Get instant access to exclusive local leads for just <span className="font-bold text-cyan-600">$1 for your first month</span>, then $60/month
                            </p>
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-gray-900">Unlimited Leads</p>
                                            <p className="text-sm text-gray-600">Access all incoming leads</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-gray-900">Instant Notifications</p>
                                            <p className="text-sm text-gray-600">Get alerted immediately</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-gray-900">Cancel Anytime</p>
                                            <p className="text-sm text-gray-600">No long-term commitment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSubscribe}
                                disabled={isCreatingSession}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-12 py-5 text-xl font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                            >
                                {isCreatingSession ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : (
                                    'Subscribe Now - $1 First Month'
                                )}
                            </button>
                            <p className="text-sm text-gray-500 mt-4">Secure payment powered by Stripe</p>
                        </div>
                    </div>
                )}

                {/* Pending Verification Message */}
                {contractor.license_status === 'PENDING' && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8 text-center">
                        <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-yellow-900 mb-2">License Verification in Progress</h3>
                        <p className="text-yellow-700">Our team is verifying your contractor license. You'll be able to subscribe once approved (usually within 24 hours).</p>
                    </div>
                )}

                {/* Leads Section */}
                {isSubscribed && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Available Leads</h2>
                            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                                <span className="text-gray-700 font-semibold">{leads.length} active leads</span>
                            </div>
                        </div>

                        {leads.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No leads available right now</h3>
                                <p className="text-gray-600">New leads will appear here when customers submit requests</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {leads.map((lead) => (
                                    <div key={lead.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                        <div className="mb-4">
                                            <div className="inline-block bg-cyan-100 px-3 py-1 rounded-full text-xs font-semibold text-cyan-700 mb-3">
                                                {lead.trade_type || 'General'}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {lead.job_description.substring(0, 50)}...
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(lead.created_at)}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <p className="text-xs text-gray-500">Customer</p>
                                                <p className="text-gray-900 font-semibold">{lead.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Location</p>
                                                <p className="text-gray-900 font-semibold">{lead.zip_code}</p>
                                            </div>
                                        </div>

                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-center transition-all shadow-md flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            Call {lead.phone}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Blurred Leads Preview (when not subscribed) */}
                {!isSubscribed && contractor.license_status === 'ACTIVE' && leads.length > 0 && (
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-cyan-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-xl font-bold text-gray-900">Subscribe to view {leads.length} available leads</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-30">
                            {leads.slice(0, 6).map((lead) => (
                                <div key={lead.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
