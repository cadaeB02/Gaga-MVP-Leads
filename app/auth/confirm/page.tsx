'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Check for error in URL params
        const error = searchParams?.get('error');
        const errorDescription = searchParams?.get('error_description');

        if (error) {
            setStatus('error');
            setErrorMessage(errorDescription || 'Email verification failed. Please try again.');
        } else {
            // Success!
            setStatus('success');
        }
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                    <p className="text-gray-600 mt-4">Verifying your email...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-xl border border-gray-200 text-center">
                    {/* Error Icon */}
                    <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h1>
                    <p className="text-gray-600 mb-8">{errorMessage}</p>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-xl border border-gray-200 text-center">
                {/* Success Icon */}
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h1>
                <p className="text-gray-600 mb-8">
                    Your email has been successfully verified. You can now log in to your account.
                </p>

                {/* Next Steps */}
                <div className="bg-cyan-50 rounded-xl p-6 mb-8 text-left">
                    <h2 className="font-bold text-gray-900 mb-3">What happens next:</h2>
                    <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-600 font-bold">1.</span>
                            <span>Our team will review your application</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-600 font-bold">2.</span>
                            <span>You'll receive an email confirmation once approved (usually within 24 hours)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-600 font-bold">3.</span>
                            <span>Log in and start receiving exclusive leads!</span>
                        </li>
                    </ol>
                </div>

                <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                >
                    Continue to Login
                </button>
            </div>
        </div>
    );
}

export default function ConfirmEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        }>
            <ConfirmEmailContent />
        </Suspense>
    );
}
