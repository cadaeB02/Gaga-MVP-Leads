'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

interface Lead {
    id: string;
    trade_type: string;
    job_description: string;
    status: string;
    created_at: string;
    zip_code: string;
}

export default function RequesterDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user's name
            const { data: requesterData } = await supabase
                .from('requesters')
                .select('id, name')
                .eq('user_id', user.id)
                .single();
            
            if (requesterData) setUserName(requesterData.name);

            // Get leads
            const { data: leadsData, error } = await supabase
                .from('leads')
                .select('*')
                .eq('requester_id', requesterData?.id || '')
                .order('created_at', { ascending: false });

            if (leadsData) setLeads(leadsData);
            setLoading(false);
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back, <span className="text-cyan-600">{userName || 'Friend'}</span>!
                        </h1>
                        <p className="text-xl text-gray-600">
                            Track your active service requests and project status
                        </p>
                    </div>

                    {/* Stats/Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl flex items-center gap-6">
                            <div className="bg-cyan-100 p-4 rounded-2xl">
                                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
                                <p className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Total Requests</p>
                            </div>
                        </div>
                        
                        <a href="/" className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-3xl p-8 shadow-xl flex items-center gap-6 group hover:scale-[1.02] transition-all">
                            <div className="bg-white/20 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">New Request</p>
                                <p className="text-cyan-100/80 font-semibold uppercase text-xs tracking-wider">Find another pro</p>
                            </div>
                        </a>
                    </div>

                    {/* Leads List */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Your Recent Requests</h2>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Live Updates</span>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                                <p className="text-gray-500 mt-4 font-semibold">Loading your data...</p>
                            </div>
                        ) : leads.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No requests yet</h3>
                                <p className="text-gray-600 mb-8 max-w-sm mx-auto">Get started by describing your project and we'll find the perfect pro for you.</p>
                                <a href="/" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200">
                                    Post Your First Project
                                </a>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {leads.map((lead) => (
                                    <div key={lead.id} className="p-8 hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                        {lead.trade_type}
                                                    </span>
                                                    <span className="text-sm text-gray-400 font-medium">
                                                        Posted on {formatDate(lead.created_at)}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                                                    {lead.job_description}
                                                </h3>
                                                <div className="flex items-center gap-4 text-gray-600 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        {lead.zip_code}
                                                    </div>
                                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${lead.status === 'MATCHED' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                                                        {lead.status === 'MATCHED' ? 'Matched with Pro' : 'Finding Verified Pro'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button className="w-full md:w-auto px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-cyan-600 hover:text-cyan-600 transition-all">
                                                    View Details
                                                </button>
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
