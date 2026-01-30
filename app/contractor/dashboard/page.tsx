'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContractorDashboard() {
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: contractorData } = await supabase
                .from('contractors')
                .select('name, license_status')
                .eq('user_id', user.id)
                .single();
            
            if (contractorData) {
                setUserName(contractorData.name);
                setStatus(contractorData.license_status);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl font-bold text-gray-900">
                                Hello, <span className="text-cyan-600">{userName || 'Partner'}</span>
                            </h1>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                                status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {status === 'ACTIVE' ? 'Verified' : 'Verification Pending'}
                            </div>
                        </div>
                        <p className="text-xl text-gray-600">
                            Welcome to your Lead Management Command Center
                        </p>
                    </div>

                    {/* Verification Alert */}
                    {status === 'PENDING' && (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 mb-12 flex items-start gap-6 shadow-sm">
                            <div className="bg-amber-100 p-4 rounded-2xl flex-shrink-0">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Verification in Progress</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Our team is currently verifying your California contractor license (CSLB) and insurance. 
                                    This usually takes <strong>less than 24 hours</strong>. You'll receive an email as soon as you're approved to start receiving exclusive leads.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Placeholder Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">New Leads</p>
                            <p className="text-4xl font-bold text-gray-300">--</p>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Active Jobs</p>
                            <p className="text-4xl font-bold text-gray-300">--</p>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Earnings</p>
                            <p className="text-4xl font-bold text-gray-300">--</p>
                        </div>
                    </div>

                    <div className="mt-12 bg-white rounded-3xl p-12 border border-gray-200 shadow-xl text-center relative overflow-hidden">
                        {/* Glass Overlay for Pending Verification */}
                        {status === 'PENDING' && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-8">
                                <div className="bg-white/90 p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">Locked During Verification</h4>
                                    <p className="text-gray-600 text-sm mb-6">Your lead management features will unlock automatically once your license is verified.</p>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                        <div className="bg-cyan-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verification Status: 75% Complete</p>
                                </div>
                            </div>
                        )}

                        <div className="relative z-0">
                            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Lead Feed</h3>
                            <p className="text-gray-600 max-w-sm mx-auto">No exclusive leads in your area yet. Once verified, we'll start pushing jobs directly to you.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
