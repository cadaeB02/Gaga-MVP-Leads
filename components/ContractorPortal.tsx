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
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                </button>

                {/* Demo Dashboard */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Contractor Dashboard</h2>
                            <p className="text-gray-400">Preview of your lead management center</p>
                        </div>
                        <div className="bg-orange-500/20 px-4 py-2 rounded-full">
                            <span className="text-orange-400 font-semibold">DEMO MODE</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">New Leads</span>
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <p className="text-4xl font-bold text-white">12</p>
                            <p className="text-xs text-gray-500 mt-1">This week</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Active Jobs</span>
                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-4xl font-bold text-white">8</p>
                            <p className="text-xs text-gray-500 mt-1">In progress</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Completed</span>
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-4xl font-bold text-white">47</p>
                            <p className="text-xs text-gray-500 mt-1">All time</p>
                        </div>
                    </div>

                    {/* Sample Leads */}
                    <h3 className="text-xl font-bold text-white mb-4">Your Latest Leads</h3>
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-orange-500/50 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="inline-block bg-orange-500/20 px-2 py-1 rounded text-xs font-semibold text-orange-400 mb-2">
                                        Electrical (C-10)
                                    </div>
                                    <h4 className="text-lg font-semibold text-white">Panel upgrade needed</h4>
                                    <p className="text-sm text-gray-400 mt-1">San Francisco, CA 94102</p>
                                </div>
                                <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all">
                                View Details
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-orange-500/50 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="inline-block bg-orange-500/20 px-2 py-1 rounded text-xs font-semibold text-orange-400 mb-2">
                                        Electrical (C-10)
                                    </div>
                                    <h4 className="text-lg font-semibold text-white">Outlet installation in garage</h4>
                                    <p className="text-sm text-gray-400 mt-1">Oakland, CA 94601</p>
                                </div>
                                <span className="text-xs text-gray-500">5 hours ago</span>
                            </div>
                            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all">
                                View Details
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-orange-500/50 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="inline-block bg-orange-500/20 px-2 py-1 rounded text-xs font-semibold text-orange-400 mb-2">
                                        Electrical (C-10)
                                    </div>
                                    <h4 className="text-lg font-semibold text-white">Ceiling fan and light fixture</h4>
                                    <p className="text-sm text-gray-400 mt-1">Berkeley, CA 94704</p>
                                </div>
                                <span className="text-xs text-gray-500">1 day ago</span>
                            </div>
                            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all">
                                View Details
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm mb-4">This is a preview of what your dashboard will look like</p>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                        >
                            Join Waitlist to Get Started
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
                <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                    Grow your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">exclusive local leads</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-medium">
                    Get matched with customers actively looking for your services
                </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Contractor Login</h2>

                {/* TODO: Implement auth after beta */}
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="contractor@example.com"
                            className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                            disabled
                        />
                    </div>

                    <button
                        type="submit"
                        disabled
                        className="w-full bg-white/10 text-gray-400 py-5 text-lg font-bold rounded-xl cursor-not-allowed"
                    >
                        Login (Coming Soon)
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-[1.02] active:scale-[0.98]">
                        Join Waitlist
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-4 text-base font-semibold rounded-xl transition-all border border-white/20 hover:border-orange-500/50"
                    >
                        Preview Demo Dashboard
                    </button>
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Be the first to know when we launch
                    </p>
                </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Instant Notifications</h3>
                    <p className="text-gray-400">Get alerts the moment a customer requests your service</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Pre-Qualified Leads</h3>
                    <p className="text-gray-400">Only serious customers ready to hire</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Local Focus</h3>
                    <p className="text-gray-400">Customers in your service area only</p>
                </div>
            </div>
        </div>
    );
}
