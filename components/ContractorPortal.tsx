'use client';

export default function ContractorPortal() {
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

                <div className="mt-6 pt-6 border-t border-white/10">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-[1.02] active:scale-[0.98]">
                        Join Waitlist
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
