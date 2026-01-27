'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProfileMenu from '@/components/ProfileMenu';

interface Requester {
    id: number;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    is_verified: boolean;
    verification_status: string;
}

interface WorkOrder {
    id: string;
    name: string;
    phone: string;
    zip_code: string;
    trade_type: string;
    job_description: string;
    created_at: string;
    status: string;
}

export default function RequesterDashboard() {
    const router = useRouter();
    const [requester, setRequester] = useState<Requester | null>(null);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        zip_code: '',
        trade_type: '',
        job_description: ''
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/requester/login');
                return;
            }

            // Get requester profile
            const { data: requesterData, error: requesterError } = await supabase
                .from('requesters')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (requesterError || !requesterData) {
                console.error('Requester not found:', requesterError);
                await supabase.auth.signOut();
                router.push('/requester/login');
                return;
            }

            setRequester(requesterData);

            // Pre-fill form data with requester info
            setFormData({
                phone: requesterData.phone || '',
                email: requesterData.email || '',
                zip_code: '', // Will be filled from previous order or left empty
                trade_type: '',
                job_description: ''
            });

            // Get work orders for this requester
            const { data: ordersData, error: ordersError } = await supabase
                .from('leads')
                .select('*')
                .eq('requester_id', requesterData.id)
                .order('created_at', { ascending: false });

            if (!ordersError && ordersData) {
                setWorkOrders(ordersData);
            }
        } catch (err) {
            console.error('Error loading dashboard:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/requester/login');
    };

    const handleOpenNewOrder = () => {
        // Reset form with requester data
        if (requester) {
            setFormData({
                phone: requester.phone || '',
                email: requester.email || '',
                zip_code: workOrders[0]?.zip_code || '', // Use last zip if available
                trade_type: '',
                job_description: ''
            });
        }
        setShowNewOrderModal(true);
    };

    const handleCloseModal = () => {
        setShowNewOrderModal(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitNewOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requester) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('leads')
                .insert({
                    name: requester.name,
                    email: formData.email,
                    phone: formData.phone,
                    zip_code: formData.zip_code,
                    trade_type: formData.trade_type,
                    job_description: formData.job_description,
                    requester_id: requester.id,
                    status: 'OPEN'
                });

            if (error) throw error;

            // Refresh work orders
            await checkAuth();
            setShowNewOrderModal(false);
        } catch (err) {
            console.error('Error creating work order:', err);
            alert('Failed to create work order. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Work Orders</h1>
                            <p className="text-gray-600 mt-1">Welcome back, {requester?.name}!</p>
                        </div>
                        <ProfileMenu />
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                        <a
                            href="/requester/dashboard"
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold shadow-sm"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/"
                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg font-semibold transition-all"
                        >
                            Home
                        </a>
                        <button
                            onClick={handleOpenNewOrder}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Work Order
                        </button>
                    </div>
                </div>

                {/* Work Orders */}
                {workOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No work orders yet</h3>
                        <p className="text-gray-600 mb-6">Submit a request on the home page to get started</p>
                        <a
                            href="/"
                            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                        >
                            Go to Home Page
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => router.push(`/requester/lead/${order.id}`)}
                                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-cyan-400 transition-all shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <div className="mb-4">
                                    <div className="inline-block bg-cyan-100 px-3 py-1 rounded-full text-xs font-semibold text-cyan-700 mb-3">
                                        {order.trade_type || 'General'}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {order.job_description.length > 60
                                            ? order.job_description.substring(0, 60) + '...'
                                            : order.job_description}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatDate(order.created_at)}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span className="text-gray-700">{order.zip_code}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        {order.status || 'OPEN'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* New Work Order Modal */}
                {showNewOrderModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">New Work Order</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitNewOrder} className="space-y-6">
                                {/* Name (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={requester?.name || ''}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Zip Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Zip Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleFormChange}
                                        required
                                        pattern="[0-9]{5}"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Service Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Service Type
                                    </label>
                                    <select
                                        name="trade_type"
                                        value={formData.trade_type}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    >
                                        <option value="">Select a service...</option>
                                        <option value="General Building (B)">Remodel / Addition</option>
                                        <option value="Electrical (C-10)">Electrical Issue</option>
                                        <option value="Plumbing (C-36)">Plumbing / Leak</option>
                                        <option value="HVAC (C-20)">AC / Heating</option>
                                        <option value="Painting (C-33)">Painting</option>
                                        <option value="Roofing (C-39)">Roofing</option>
                                        <option value="Landscaping (C-27)">Landscaping</option>
                                        <option value="Pools (C-53)">Pool Maintenance</option>
                                    </select>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Description
                                    </label>
                                    <textarea
                                        name="job_description"
                                        value={formData.job_description}
                                        onChange={handleFormChange}
                                        required
                                        rows={4}
                                        placeholder="Describe the work you need done..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Work Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
