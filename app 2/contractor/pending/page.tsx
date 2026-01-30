'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function PendingApprovalPage() {
    const router = useRouter();

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4 pt-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-xl border border-gray-200">
                    {/* Pending Icon */}
                    <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Application Under Review</h1>
                    <p className="text-gray-600 mb-8 text-center text-lg">
                        Your email has been verified! ✅ We're now reviewing your contractor license.
                    </p>

                    {/* Status Card */}
                    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl p-6 mb-8 border border-cyan-200">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Current Status
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Email Verified</p>
                                    <p className="text-sm text-gray-600">Your email address has been confirmed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Admin Approval Pending</p>
                                    <p className="text-sm text-gray-600">We're verifying your contractor license with the California Contractors State License Board</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works - Business Model */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 mb-8 border border-cyan-200">
                        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            How LeadMan Works
                        </h2>
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                            We're the bridge between homeowners who need work done and quality contractors like you. Here's how we make it happen:
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 font-bold text-cyan-600">1</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Homeowners Request Services</p>
                                    <p className="text-gray-600">Customers submit their project details and we verify their information</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 font-bold text-cyan-600">2</div>
                                <div>
                                    <p className="font-semibold text-gray-900">We Match You With Qualified Leads</p>
                                    <p className="text-gray-600">Only verified contractors in the right trade and area get exclusive access</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 font-bold text-cyan-600">3</div>
                                <div>
                                    <p className="font-semibold text-gray-900">You Close The Deal</p>
                                    <p className="text-gray-600">Contact the customer directly, quote the job, and grow your business</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-cyan-500">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-cyan-600">Our Mission:</span> We believe quality contractors shouldn't waste time chasing bad leads. We do the heavy lifting so you can focus on what you do best—delivering exceptional work.
                            </p>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h2 className="font-bold text-gray-900 mb-3">What happens next:</h2>
                        <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-600 font-bold text-lg">1.</span>
                                <span>Our team will verify your contractor license with the state board (usually within 24 hours)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-600 font-bold text-lg">2.</span>
                                <span>You'll receive an email notification once your account is approved</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-600 font-bold text-lg">3.</span>
                                <span>Log back in, subscribe, and start receiving exclusive leads in your area!</span>
                            </li>
                        </ol>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            Return to Home
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                        >
                            Check Status Again
                        </button>
                    </div>

                    {/* Help */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Questions? Email us at{' '}
                            <a href="mailto:Garrett@GagaLeads.com" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                                Garrett@GagaLeads.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
