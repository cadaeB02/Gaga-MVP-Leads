'use client';

import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-semibold mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy & Marketing Consent</h1>
                    <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content */}
                <div className="prose prose-cyan max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We collect information you provide directly to us when you create an account, request a lead,
                            or contact us for support. This includes your name, email address, phone number, zip code,
                            and professional credentials (for contractors).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Marketing Consent</h2>
                        <div className="bg-blue-50 border-l-4 border-cyan-500 p-6 rounded">
                            <p className="text-gray-800 leading-relaxed font-semibold mb-4">
                                By checking the consent box during signup, you expressly agree to the following:
                            </p>
                            <ul className="list-disc ml-6 space-y-3 text-gray-700">
                                <li>
                                    <strong>Multi-Channel Communication:</strong> You consent to receive marketing and informational
                                    communications from GC Ventures and its partners via telephone, SMS/text messages, and email.
                                </li>
                                <li>
                                    <strong>Automated Systems:</strong> You acknowledge that these communications may be sent
                                    using automated dialing systems or pre-recorded voices.
                                </li>
                                <li>
                                    <strong>Frequency:</strong> Message frequency varies based on your preferences and service activity.
                                </li>
                                <li>
                                    <strong>Opt-Out:</strong> You can opt-out of SMS communications at any time by replying "STOP".
                                    For email, you can use the unsubscribe link provided in our messages.
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Usage & Sharing</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use your data to facilitate connections between contractors and customers. We do not sell
                            your personal information to third parties for their own marketing purposes without your
                            explicit consent. Data may be shared with service providers who assist in our operations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information. However,
                            no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this policy or our data practices, please contact us at:
                            <br />
                            <a href="mailto:privacy@gcventures.com" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                                privacy@gcventures.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
