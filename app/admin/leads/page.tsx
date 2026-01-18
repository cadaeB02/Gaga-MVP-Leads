'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ContractorsTable from '@/components/ContractorsTable';
import SettingsView from '@/components/SettingsView';

interface Lead {
    id: string;
    name: string;
    phone: string;
    zip_code: string;
    trade_type: string;
    job_description: string;
    created_at: string;
}

type View = 'leads' | 'contractors' | 'settings';

export default function AdminLeadsPage() {
    const [accessCode, setAccessCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState<View>('leads');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const CORRECT_CODE = 'gaga2026';

    const handleAccessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode === CORRECT_CODE) {
            setIsAuthenticated(true);
            setError('');
            fetchLeads();
        } else {
            setError('Invalid access code');
        }
    };

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const { data, error: supabaseError } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (supabaseError) throw supabaseError;

            setLeads(data || []);
        } catch (err) {
            console.error('Error fetching leads:', err);
            setError('Failed to load leads');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
                        <p className="text-gray-400">Enter access code to view dashboard</p>
                    </div>

                    <form onSubmit={handleAccessSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Access Code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-white/5 border-r border-white/10 p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">GC Ventures</h1>
                    <p className="text-sm text-gray-400 mt-1">Command Center</p>
                </div>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setCurrentView('leads')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'leads'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-semibold">Live Leads</span>
                    </button>

                    <button
                        onClick={() => setCurrentView('contractors')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'contractors'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-semibold">Contractors</span>
                    </button>

                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'settings'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">Settings</span>
                    </button>
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500">GC Ventures LLC</p>
                    <a href="mailto:Garrett@GagaLeads.com" className="text-xs text-orange-400 hover:text-orange-300">
                        Garrett@GagaLeads.com
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-4 md:p-8">
                    {/* Mobile Header */}
                    <div className="md:hidden mb-6">
                        <h1 className="text-2xl font-bold text-white">GC Ventures</h1>
                        <p className="text-sm text-gray-400">Command Center</p>
                    </div>

                    {/* Live Leads View */}
                    {currentView === 'leads' && (
                        <div>
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-white mb-2">Live Leads</h1>
                                        <p className="text-gray-400">Manage incoming customer requests</p>
                                    </div>
                                    <button
                                        onClick={fetchLeads}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </button>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-semibold">{leads.length}</span> active job{leads.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                                    <p className="text-gray-400 mt-4">Loading leads...</p>
                                </div>
                            )}

                            {!isLoading && leads.length === 0 && (
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10">
                                    <div className="bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">No active jobs right now</h3>
                                    <p className="text-gray-400">New leads will appear here when customers submit the form</p>
                                </div>
                            )}

                            {!isLoading && leads.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {leads.map((lead) => (
                                        <div
                                            key={lead.id}
                                            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all shadow-xl hover:shadow-2xl cursor-pointer"
                                            onClick={() => setSelectedLead(lead)}
                                        >
                                            <div className="mb-4">
                                                <div className="inline-block bg-orange-500/20 px-3 py-1 rounded-full text-xs font-semibold text-orange-400 mb-3">
                                                    {lead.trade_type || 'General'}
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">
                                                    {truncateText(lead.job_description, 50)}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {formatDate(lead.created_at)}
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-500/20 p-2 rounded-lg">
                                                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Customer</p>
                                                        <p className="text-white font-semibold">{lead.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-500/20 p-2 rounded-lg">
                                                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Location</p>
                                                        <p className="text-white font-semibold">{lead.zip_code}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center text-sm text-gray-400 mb-4">
                                                Click to view full details
                                            </div>

                                            <a
                                                href={`tel:${lead.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold text-center hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
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

                            {selectedLead && (
                                <div
                                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                    onClick={() => setSelectedLead(null)}
                                >
                                    <div
                                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto relative"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => setSelectedLead(null)}
                                            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                                        >
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <div className="mb-6">
                                            <div className="inline-block bg-orange-500/20 px-3 py-1 rounded-full text-sm font-semibold text-orange-400 mb-3">
                                                {selectedLead.trade_type || 'General'}
                                            </div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Job Details</h2>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(selectedLead.created_at)}
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h3 className="text-sm font-semibold text-gray-400 mb-4">CUSTOMER INFORMATION</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Name</p>
                                                        <p className="text-xl font-semibold text-white">{selectedLead.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                        <p className="text-xl font-semibold text-white">{selectedLead.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Location</p>
                                                        <p className="text-xl font-semibold text-white">{selectedLead.zip_code}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h3 className="text-sm font-semibold text-gray-400 mb-4">JOB DESCRIPTION</h3>
                                                <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                                                    {selectedLead.job_description || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <a
                                                href={`tel:${selectedLead.phone}`}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-center hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                Call Now
                                            </a>
                                            <button
                                                onClick={() => setSelectedLead(null)}
                                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contractors View */}
                    {currentView === 'contractors' && <ContractorsTable />}

                    {/* Settings View */}
                    {currentView === 'settings' && <SettingsView />}
                </div>
            </main>

            {/* Mobile Bottom Tabs */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-40">
                <div className="flex justify-around items-center">
                    <button
                        onClick={() => setCurrentView('leads')}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${currentView === 'leads' ? 'text-orange-400' : 'text-gray-400'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-xs font-semibold">Leads</span>
                    </button>

                    <button
                        onClick={() => setCurrentView('contractors')}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${currentView === 'contractors' ? 'text-orange-400' : 'text-gray-400'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs font-semibold">Contractors</span>
                    </button>

                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${currentView === 'settings' ? 'text-orange-400' : 'text-gray-400'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-semibold">Settings</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
