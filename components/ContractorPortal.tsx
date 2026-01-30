'use client';

import React from 'react';

const ContractorPortal: React.FC = () => {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                    Grow your <span className="text-cyan-600">business</span> with us
                </h1>
                <p className="text-xl text-gray-600">
                    Get verified and start receiving high-quality leads
                </p>
            </div>

            {/* CTA Card */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="bg-cyan-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg">Direct access to local homeowners</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="bg-cyan-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg">$60/mo Maintenance Retainer to unlock leads</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="bg-cyan-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg">Verified Lead Generation</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        <a
                            href="/contractor/join"
                            className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white py-5 text-xl font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-center"
                        >
                            Apply to Become a Pro
                        </a>
                        <a
                            href="/login"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 text-base font-bold rounded-xl transition-all border border-gray-200 hover:border-cyan-400 text-center"
                        >
                            Already have an account? Log In
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractorPortal;
