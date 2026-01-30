'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
    id: string;
    name: string;
    phone: string;
    zip_code: string;
    trade_type: string;
    job_description: string;
    created_at: string;
    tier?: string;
    requester_id?: string;
    requesters?: {
        is_verified: boolean;
    };
}

interface Requester {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    is_verified: boolean;
}

interface LeadDetailModalProps {
    lead: Lead;
    onClose: () => void;
    onVerify?: (leadId: string) => void;
}

export default function LeadDetailModal({ lead, onClose, onVerify }: LeadDetailModalProps) {
    const [requester, setRequester] = useState<Requester | null>(null);
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequesterData();
    }, [lead.requester_id]);

    const fetchRequesterData = async () => {
        try {
            // Fetch requester info if requester_id exists
            if (lead.requester_id) {
                const { data: requesterData } = await supabase
                    .from('requesters')
                    .select('*')
                    .eq('id', lead.requester_id)
                    .single();

                if (requesterData) {
                    setRequester(requesterData);

                    // Fetch all leads from this requester
                    const { data: leadsData } = await supabase
                        .from('leads')
                        .select('*')
                        .eq('requester_id', lead.requester_id)
                        .order('created_at', { ascending: false });

                    if (leadsData) {
                        setAllLeads(leadsData);
                    }
                }
            } else {
                // For leads without requester_id, try to find by email or phone
                const { data: leadsData } = await supabase
                    .from('leads')
                    .select('*')
                    .or(`phone.eq.${lead.phone},name.eq.${lead.name}`)
                    .order('created_at', { ascending: false });

                if (leadsData) {
                    setAllLeads(leadsData);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching requester data:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getVerificationBadge = (isVerified?: boolean) => {
        if (isVerified === false) {
            return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">⚠️ Unverified</span>;
        }
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">✓ Verified</span>;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Lead Info */}
                    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6 border border-cyan-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{lead.trade_type}</h3>
                                <p className="text-gray-600 text-sm">Lead #{String(lead.id).slice(0, 8)}</p>
                            </div>
                            {lead.requesters && getVerificationBadge(lead.requesters.is_verified)}
                        </div>
                        <p className="text-gray-700 mb-4">{lead.job_description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Customer</p>
                                <p className="font-semibold text-gray-900">{lead.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-900">{lead.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Location</p>
                                <p className="font-semibold text-gray-900">Zip: {lead.zip_code}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Created</p>
                                <p className="font-semibold text-gray-900">{formatDate(lead.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Requester Info */}
                    {requester && (
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Requester Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{requester.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{requester.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-900">{requester.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-semibold text-gray-900">{formatDate(requester.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Verification Status</p>
                                    <p className="font-semibold text-gray-900">
                                        {requester.is_verified ? '✓ Verified' : '⚠️ Unverified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lead History */}
                    {allLeads.length > 0 && (
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                📊 Lead History ({allLeads.length} total)
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {allLeads.map((historyLead) => (
                                    <div
                                        key={historyLead.id}
                                        className={`p-3 rounded-lg border ${historyLead.id === lead.id
                                            ? 'bg-cyan-50 border-cyan-200'
                                            : 'bg-gray-50 border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {historyLead.trade_type}
                                                    {historyLead.id === lead.id && (
                                                        <span className="ml-2 text-cyan-600">(Current)</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{historyLead.job_description}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(historyLead.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex gap-3">
                    <a
                        href={`tel:${lead.phone}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all text-center"
                    >
                        📞 Call {lead.name}
                    </a>
                    {requester && (
                        <a
                            href={`mailto:${requester.email}`}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-all text-center"
                        >
                            📧 Email
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
