'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ContractorPortal from '@/components/ContractorPortal';
import { useSearchParams, useRouter } from 'next/navigation';

const SERVICE_TYPES = [
    { label: 'Remodel / Addition', value: 'General Building (B)' },
    { label: 'Electrical Issue', value: 'Electrical (C-10)' },
    { label: 'Plumbing / Leak', value: 'Plumbing (C-36)' },
    { label: 'AC / Heating', value: 'HVAC (C-20)' },
    { label: 'Painting', value: 'Painting (C-33)' },
    { label: 'Roofing', value: 'Roofing (C-39)' },
    { label: 'Landscaping', value: 'Landscaping (C-27)' },
    { label: 'Pool Maintenance', value: 'Pools (C-53)' },
];

function HomeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mode, setMode] = useState<'customer' | 'contractor'>('customer');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        zip_code: '',
        trade_type: '',
        job_description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

    // Check if user is logged in and redirect to dashboard
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push('/dashboard');
            }
        };
        checkAuth();
    }, [router]);

    useEffect(() => {
        const paymentStatus = searchParams?.get('payment');
        if (paymentStatus === 'success') {
            setShowPaymentSuccess(true);
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.trade_type) {
            setError('Please select a service type');
            return false;
        }
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        if (!formData.zip_code.trim()) {
            setError('Please enter your zip code');
            return false;
        }
        if (!formData.job_description.trim()) {
            setError('Please describe your job');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error: supabaseError } = await supabase
                .from('leads')
                .insert([
                    {
                        name: formData.name,
                        phone: formData.phone,
                        zip_code: formData.zip_code,
                        trade_type: formData.trade_type,
                        job_description: formData.job_description
                    }
                ])
                .select();

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                throw supabaseError;
            }

            console.log('Lead submitted successfully:', data);
            setIsSuccess(true);
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStripeCheckout = async () => {
        setIsCheckoutLoading(true);
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'test-user-id', // Test user ID
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

    return (
        <div className="min-h-screen relative flex flex-col bg-gradient-to-br from-sky-50 to-cyan-50">
            {/* Header */}
            <header className="relative z-10 px-4 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">LeadMan</h1>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">v1.22</span>
                    </div>
                    <button
                        onClick={handleStripeCheckout}
                        disabled={isCheckoutLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md disabled:opacity-50 text-sm"
                    >
                        {isCheckoutLoading ? 'Loading...' : '💳 Test Stripe ($1)'}
                    </button>
                </div>
            </header>

            {/* Payment Success Banner */}
            {showPaymentSuccess && (
                <div className="relative z-10 bg-green-50 border-b-2 border-green-200 px-4 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-900">Payment Successful!</h3>
                                <p className="text-sm text-green-700">Your subscription is now active. You'll receive leads shortly!</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPaymentSuccess(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl">
                    {/* Toggle Switch */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-full p-1.5 border border-gray-200 inline-flex shadow-sm">
                            <button
                                onClick={() => setMode('customer')}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${mode === 'customer'
                                    ? 'bg-cyan-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Find a Pro
                            </button>
                            <button
                                onClick={() => setMode('contractor')}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${mode === 'contractor'
                                    ? 'bg-cyan-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                I am a Pro
                            </button>
                        </div>
                    </div>

                    {/* Customer View */}
                    {mode === 'customer' && (
                        <div className="w-full max-w-lg mx-auto">
                            {!isSuccess ? (
                                <div className="space-y-8">
                                    {/* Hero Section */}
                                    <div className="text-center space-y-4">
                                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                            We find <span className="text-cyan-600">contractors</span> for you
                                        </h1>
                                        <p className="text-xl text-gray-600">
                                            Just input the information below
                                        </p>
                                    </div>

                                    {/* Form Card */}
                                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                                                <select
                                                    name="trade_type"
                                                    value={formData.trade_type}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all appearance-none cursor-pointer"
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="" className="bg-white">Select a service...</option>
                                                    {SERVICE_TYPES.map((service) => (
                                                        <option key={service.value} value={service.value} className="bg-white">
                                                            {service.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="John Smith"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="(555) 123-4567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                                                <input
                                                    type="text"
                                                    name="zip_code"
                                                    placeholder="80301"
                                                    value={formData.zip_code}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">What do you need help with?</label>
                                                <textarea
                                                    name="job_description"
                                                    placeholder="Describe your project..."
                                                    value={formData.job_description}
                                                    onChange={handleChange}
                                                    rows={4}
                                                    className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all resize-none"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            {error && (
                                                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl text-center">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-cyan-600 text-white py-5 text-lg font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </span>
                                                ) : (
                                                    'Get Your Free Quote'
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                /* Success State */
                                <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className="bg-green-100 p-6 rounded-full">
                                            <svg
                                                className="w-16 h-16 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                                        We Got It!
                                    </h2>
                                    <p className="text-xl text-gray-600 leading-relaxed">
                                        We are finding a verified pro for you
                                    </p>
                                    <div className="pt-4">
                                        <div className="inline-flex items-center gap-2 text-cyan-600 font-semibold">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            Expect a call within 24 hours
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contractor View */}
                    {mode === 'contractor' && <ContractorPortal />}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-4 py-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
                <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm space-y-2">
                    <p>© 2026 LeadMan</p>
                    <p>
                        <a href="mailto:Garrett@GagaLeads.com" className="text-cyan-600 hover:text-cyan-700">Garrett@GagaLeads.com</a>
                        {' '} | {' '}
                        <a href="/admin/leads" className="text-cyan-600 hover:text-cyan-700">Admin</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
            <HomeContent />
        </Suspense>
    );
}
