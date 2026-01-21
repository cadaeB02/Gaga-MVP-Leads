'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
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

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to start checkout');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back!</p>
                </div>

                {/* Unlock Leads Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
                    <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlock Exclusive Leads</h2>
                    <p className="text-xl text-gray-600 mb-6">
                        Get instant access to local leads for just <span className="font-bold text-cyan-600">$1 for your first month</span>, then $60/month
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
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
                        onClick={handleUnlockLeads}
                        disabled={isCheckoutLoading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-12 py-5 text-xl font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                    >
                        {isCheckoutLoading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            'Unlock Leads for $1'
                        )}
                    </button>
                    <p className="text-sm text-gray-500 mt-4">Secure payment powered by Stripe</p>
                </div>
            </div>
        </div>
    );
}
