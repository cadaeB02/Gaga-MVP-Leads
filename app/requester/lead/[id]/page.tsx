'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface WorkOrder {
    id: string;
    name: string;
    phone: string;
    zip_code: string;
    trade_type: string;
    job_description: string;
    created_at: string;
    status: string;
    visible_to_user_id?: string;
    claimed_at?: string;
    work_started?: string;
}

interface Contractor {
    name: string;
    business_name: string;
    phone: string;
    trade_type: string;
}

export default function WorkOrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
    const [contractor, setContractor] = useState<Contractor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        loadWorkOrder();
    }, []);

    const loadWorkOrder = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/requester/login');
                return;
            }

            // Get work order details
            const { data: orderData, error: orderError } = await supabase
                .from('leads')
                .select('*')
                .eq('id', params.id)
                .single();

            if (orderError || !orderData) {
                console.error('Work order not found:', orderError);
                router.push('/requester/dashboard');
                return;
            }

            setWorkOrder(orderData);

            // If lead is assigned, fetch contractor info
            if (orderData.visible_to_user_id) {
                const { data: contractorData } = await supabase
                    .from('contractors')
                    .select('name, business_name, phone, trade_type')
                    .eq('user_id', orderData.visible_to_user_id)
                    .single();

                if (contractorData) {
                    setContractor(contractorData);
                }
            }
        } catch (err) {
            console.error('Error loading work order:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmContact = async () => {
        if (!workOrder) return;
        setIsConfirming(true);

        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: 'MATCHED' })
                .eq('id', workOrder.id);

            if (error) throw error;

            await loadWorkOrder();
            alert('Handshake confirmed! Your Pro is now locked in.');
        } catch (err) {
            console.error('Error confirming contact:', err);
            alert('Failed to confirm contact');
        } finally {
            setIsConfirming(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
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
                    <p className="text-gray-600 mt-4">Loading work order...</p>
                </div>
            </div>
        );
    }

    if (!workOrder) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Work order not found</h2>
                    <a
                        href="/requester/dashboard"
                        className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/requester/dashboard')}
                    className="flex items-center gap-2 text-gray-700 hover:text-cyan-600 mb-6 font-semibold transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Work Order Details */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="inline-block bg-cyan-100 px-4 py-2 rounded-full text-sm font-semibold text-cyan-700 mb-3">
                                    {workOrder.trade_type || 'General Service'}
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">Work Order Details</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submitted {formatDate(workOrder.created_at)}
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${workOrder.status === 'OPEN'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {workOrder.status || 'OPEN'}
                            </span>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Job Description</h2>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
                                {workOrder.job_description}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-cyan-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Name</p>
                                        <p className="text-gray-900 font-semibold text-lg">{workOrder.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-cyan-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <a href={`tel:${workOrder.phone}`} className="text-cyan-600 hover:text-cyan-700 font-semibold text-lg">
                                            {workOrder.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-cyan-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="text-gray-900 font-semibold text-lg">{workOrder.zip_code}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Handshake Section (Phase 2 Beta Handshake) */}
                    {workOrder.status === 'CLAIMED' && (
                        <div className="mb-8 p-6 bg-cyan-50 border-2 border-cyan-200 rounded-3xl animate-in fade-in duration-500">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-cyan-100 flex-1 w-full text-center md:text-left">
                                    <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-1">Assigned Pro</p>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                        {contractor?.business_name || contractor?.name || 'Local Pro'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Has revealed your lead and is ready to work!</p>
                                </div>
                                <div className="flex-1 w-full">
                                    <button
                                        onClick={handleConfirmContact}
                                        disabled={isConfirming}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isConfirming ? (
                                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                I have been contacted by this Pro
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {workOrder.status === 'MATCHED' && (
                        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-3xl text-center">
                            <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">Double Opt-In Confirmed!</h3>
                            <p className="text-gray-600 font-medium">You are officially matched with <b>{contractor?.business_name || contractor?.name}</b></p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        {workOrder.status === 'MATCHED' ? (
                            <a
                                href={`tel:${contractor?.phone}`}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Call Pro Directly
                            </a>
                        ) : (
                            <a
                                href={`tel:${workOrder.phone}`}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Call My Contact Info
                            </a>
                        )}
                        <button
                            onClick={() => router.push('/requester/dashboard')}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
