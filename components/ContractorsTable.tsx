'use client';

import { useState } from 'react';
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
    created_at: string;
}

interface ContractorsTableProps {
    contractors: Contractor[];
    onRefresh: () => void;
}

export default function ContractorsTable({ contractors, onRefresh }: ContractorsTableProps) {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    };

    const handleCheckLicense = async (licenseNumber: string) => {
        const copied = await copyToClipboard(licenseNumber);
        if (copied) {
            showToast('License number copied! Paste it in the CA License Board site.', 'success');
            // Open CA License Board in new tab
            window.open('https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx', '_blank');
        } else {
            showToast('Failed to copy license number', 'error');
        }
    };

    const handleVerify = async (contractorId: number) => {
        try {
            const { error } = await supabase
                .from('contractors')
                .update({
                    license_status: 'ACTIVE',
                    insurance_verified: true
                })
                .eq('id', contractorId);

            if (error) throw error;

            showToast('Contractor verified successfully!', 'success');
            onRefresh();
        } catch (err) {
            console.error('Error verifying contractor:', err);
            showToast('Failed to verify contractor', 'error');
        }
    };

    const handleReject = async (contractorId: number) => {
        if (!confirm('Are you sure you want to reject this contractor?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('contractors')
                .update({
                    license_status: 'REJECTED'
                })
                .eq('id', contractorId);

            if (error) throw error;

            showToast('Contractor rejected', 'success');
            onRefresh();
        } catch (err) {
            console.error('Error rejecting contractor:', err);
            showToast('Failed to reject contractor', 'error');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            ACTIVE: 'bg-green-100 text-green-700 border-green-200',
            REJECTED: 'bg-red-100 text-red-700 border-red-200'
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg border-2 ${toast.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    {toast.message}
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Contractor Verification Queue</h2>
                <div className="text-sm text-gray-600">
                    {contractors.length} contractor{contractors.length !== 1 ? 's' : ''}
                </div>
            </div>

            {contractors.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No contractors to review</h3>
                    <p className="text-gray-600">New contractor applications will appear here</p>
                </div>
            )}

            {/* Mobile: Card View */}
            <div className="block md:hidden space-y-4">
                {contractors.map((contractor) => (
                    <div
                        key={contractor.id}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{contractor.name}</h3>
                                <p className="text-sm text-gray-600">{contractor.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(contractor.license_status)}`}>
                                {contractor.license_status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div>
                                <p className="text-gray-500">License #</p>
                                <p className="text-gray-900 font-semibold">{contractor.license_number}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Trade Type</p>
                                <p className="text-gray-900 font-semibold">{contractor.trade_type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <a href={`tel:${contractor.phone}`} className="text-cyan-600 font-semibold">
                                    {contractor.phone}
                                </a>
                            </div>
                            <div>
                                <p className="text-gray-500">Applied</p>
                                <p className="text-gray-900">{formatDate(contractor.created_at)}</p>
                            </div>
                        </div>

                        {contractor.license_status === 'PENDING' && (
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleCheckLicense(contractor.license_number)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Check CA License Board
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleVerify(contractor.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
                                    >
                                        ✓ Verify
                                    </button>
                                    <button
                                        onClick={() => handleReject(contractor.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                License #
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Trade Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Applied
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {contractors.map((contractor) => (
                            <tr key={contractor.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-gray-900 font-semibold">{contractor.name}</p>
                                        <p className="text-sm text-gray-600">{contractor.email}</p>
                                        <a href={`tel:${contractor.phone}`} className="text-sm text-cyan-600 hover:text-cyan-700">
                                            {contractor.phone}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-gray-900 font-semibold">{contractor.license_number}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {contractor.trade_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(contractor.license_status)}`}>
                                        {contractor.license_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                                    {formatDate(contractor.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {contractor.license_status === 'PENDING' ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleCheckLicense(contractor.license_number)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                                                title="Check CA License Board"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Check
                                            </button>
                                            <button
                                                onClick={() => handleVerify(contractor.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                                                title="Mark as Verified"
                                            >
                                                ✓ Verify
                                            </button>
                                            <button
                                                onClick={() => handleReject(contractor.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                                                title="Reject Application"
                                            >
                                                ✗ Reject
                                            </button>
                                        </div>
                                    ) : contractor.license_status === 'ACTIVE' ? (
                                        <span className="text-green-600 font-semibold">✓ Verified</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">✗ Rejected</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
