'use client';

import { useState } from 'react';

export default function ContractorPortal() {
    const [showPreview, setShowPreview] = useState(false);

    if (showPreview) {
        return (
            <div className="space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => setShowPreview(false)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>

                {/* Demo Dashboard */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contractor Dashboard</h2>
                            <p className="text-gray-600">Preview of your lead management center</p>
                        </div>
                        <div className="bg-cyan-100 px-4 py-2 rounded-full">
                            <span className="text-cyan-700 font-semibold">DEMO MODE</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 text-sm font-semibold">New Leads</span>
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">12</p>
                            <p className="text-xs text-gray-600 mt-1">This week</p>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl p-6 border border-cyan-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 text-sm font-semibold">Active Jobs</span>
                                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">8</p>
                            <p className="text-xs text-gray-600 mt-1">In progress</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 text-sm font-semibold">Completed</span>
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">47</p>
                            <p className="text-xs text-gray-600 mt-1">All time</p>
                        </div>
                    </div>

                    {/* Sample Leads */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Latest Leads</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-cyan-400 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="inline-block bg-cyan-100 px-2 py-1 rounded text-xs font-semibold text-cyan-700 mb-2">
                                        Electrical (C-10)
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900">Panel upgrade needed</h4>
                                    <p className="text-sm text-gray-600 mt-1">San Francisco, CA 94102</p>
                                </div>
                                <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all">
                                View Details
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-cyan-400 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="inline-block bg-cyan-100 px-2 py-1 rounded text-xs font-semibold text-cyan-700 mb-2">
                                        Electrical (C-10)
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900">Outlet installation in garage</h4>
                                    <p className="text-sm text-gray-600 mt-1">Oakland, CA 94601</p>
                                </div>
                                <span className="text-xs text-gray-500">5 hours ago</span>
                            </div>
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all">
                                View Details
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-cyan-400 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="inline-block bg-cyan-100 px-2 py-1 rounded text-xs font-semibold text-cyan-700 mb-2">
                                        Electrical (C-10)
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900">Ceiling fan and light fixture</h4>
                                    <p className="text-sm text-gray-600 mt-1">Berkeley, CA 94704</p>
                                </div>
                                <span className="text-xs text-gray-500">1 day ago</span>
                            </div>
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all">
                                View Details
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm mb-4">This is a preview of what your dashboard will look like</p>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                        >
                            Join to Get Started
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                    Grow your business with <span className="text-cyan-600">exclusive local leads</span>
                </h1>
                <p className="text-xl text-gray-600">
                    Get matched with customers actively looking for your services
                </p>
            </div>

            {/* CTA Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ready to Get Started?</h2>

                <div className="space-y-3">
                    <a
                        href="/contractor/join"
                        className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white py-5 text-lg font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-center"
                    >
                        Join as Contractor
                    </a>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 text-base font-semibold rounded-xl transition-all border border-gray-200 hover:border-cyan-400"
                    >
                        Preview Demo Dashboard
                    </button>
                </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-cyan-600 mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Notifications</h3>
                    <p className="text-gray-600">Get alerts the moment a customer requests your service</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-cyan-600 mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Pre-Qualified Leads</h3>
                    <p className="text-gray-600">Only serious customers ready to hire</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-cyan-600 mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Local Focus</h3>
                    <p className="text-gray-600">Customers in your service area only</p>
                </div>
            </div>
        </div>
    );
}
