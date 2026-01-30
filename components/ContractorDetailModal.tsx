'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Contractor {
    id: number;
    user_id: string;
    name: string;
    email: string;
    business_name: string;
    license_number: string;
    trade_type: string;
    phone: string;
    license_status: 'PENDING' | 'ACTIVE' | 'REJECTED';
    insurance_verified: boolean;
    verification_status?: string;
    created_at: string;
}

interface WorkOrder {
    id: number;
    description: string;
    trade_type: string;
    status: string;
    created_at: string;
}

interface ContractorDetailModalProps {
    contractor: Contractor;
    onClose: () => void;
    onVerify: (contractorId: number) => void;
    onReject: (contractorId: number) => void;
}

export default function ContractorDetailModal({ contractor, onClose, onVerify, onReject }: ContractorDetailModalProps) {
    const [assignedLeads, setAssignedLeads] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContractorLeads();
    }, [contractor.id]);

    const fetchContractorLeads = async () => {
        try {
            // Fetch leads from the leads table where visible_to_user_id matches this contractor
            const { data: leadsData } = await supabase
                .from('leads')
                .select('*')
                .eq('visible_to_user_id', contractor.user_id)
                .order('created_at', { ascending: false });

            // Also fetch from work_orders (legacy support)
            const { data: woData } = await supabase
                .from('work_orders')
                .select('*')
                .eq('contractor_id', contractor.id);

            // Merge and de-duplicate if necessary (using ID)
            const combined = [
                ...(leadsData || []),
                ...(woData || []).filter(wo => !leadsData?.some(l => l.id === wo.id))
            ];

            setAssignedLeads(combined);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contractor leads:', error);
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

    const getStatusBadge = (status: string) => {
        const statusColors: { [key: string]: string } = {
            'PENDING': 'bg-amber-100 text-amber-700',
            'ACTIVE': 'bg-green-100 text-green-700',
            'REJECTED': 'bg-red-100 text-red-700',
            'OPEN': 'bg-blue-100 text-blue-700',
            'ASSIGNED': 'bg-purple-100 text-purple-700',
            'COMPLETED': 'bg-green-100 text-green-700'
        };

        return (
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    const completedLeads = assignedLeads.filter(lead => lead.status === 'COMPLETED').length;
    const completionRate = assignedLeads.length > 0
        ? Math.round((completedLeads / assignedLeads.length) * 100)
        : 0;

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Contractor Details</h2>
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
                    {/* Contractor Info */}
                    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6 border border-cyan-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{contractor.name}</h3>
                                <p className="text-gray-600">{contractor.business_name}</p>
                            </div>
                            <div className="flex gap-2">
                                {getStatusBadge(contractor.license_status)}
                                {contractor.verification_status === 'verified' ? (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                        ✓ Verified
                                    </span>
                                ) : (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                        ⚠️ Unverified
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-semibold text-gray-900">{contractor.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-900">{contractor.phone}</p>
                            </div>
                             <div>
                                <p className="text-gray-500">License #</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">{contractor.license_number}</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(contractor.license_number);
                                            alert('License number copied!');
                                        }}
                                        className="text-cyan-600 hover:text-cyan-700 p-1"
                                        title="Copy License Number"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500">Trade Type</p>
                                <p className="font-semibold text-gray-900">{contractor.trade_type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Insurance</p>
                                <p className="font-semibold text-gray-900">
                                    {contractor.insurance_verified ? '✓ Verified' : '✗ Not Verified'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Applied</p>
                                <p className="font-semibold text-gray-900">{formatDate(contractor.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-cyan-600">{assignedLeads.length}</p>
                            <p className="text-sm text-gray-600 mt-1">Total Leads</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-green-600">{completedLeads}</p>
                            <p className="text-sm text-gray-600 mt-1">Completed</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                            <p className="text-sm text-gray-600 mt-1">Success Rate</p>
                        </div>
                    </div>

                    {/* Lead History */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            📋 Lead History ({assignedLeads.length} total)
                        </h3>
                        {assignedLeads.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {assignedLeads.map((lead) => (
                                    <div key={lead.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 text-sm">{lead.trade_type}</p>
                                                <p className="text-xs text-gray-500 mt-1">{lead.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
                                            </div>
                                            {getStatusBadge(lead.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No leads assigned yet</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex gap-3">
                    {contractor.verification_status !== 'verified' && (
                        <>
                            <button
                                onClick={() => {
                                    onVerify(contractor.id);
                                    onClose();
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
                            >
                                ✓ Verify Contractor
                            </button>
                            <button
                                onClick={() => {
                                    onReject(contractor.id);
                                    onClose();
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
                            >
                                ✗ Reject
                            </button>
                        </>
                    )}
                    <a
                        href={`mailto:${contractor.email}`}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-all text-center"
                    >
                        📧 Contact
                    </a>
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
