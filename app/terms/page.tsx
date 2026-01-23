'use client';

import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-semibold mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
                    <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content */}
                <div className="prose prose-cyan max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing and using the services provided by GC Ventures, operating as The Digital Mechanic
                            ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                        <p className="text-gray-700 leading-relaxed">
                            GC Ventures is a marketing and lead generation agency that connects contractors with potential
                            customers. We provide lead information through a subscription-based service. We are NOT a
                            licensed contractor and do NOT perform any construction, repair, or trade services.
                        </p>
                    </section>

                    <section className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded">
                        <h2 className="text-2xl font-bold text-red-900 mb-4">3. PROHIBITION ON RESALE AND UNAUTHORIZED USE</h2>

                        <div className="space-y-4 text-gray-800">
                            <p className="font-semibold">
                                Your subscription grants access to leads for use by a single business entity only.
                                The following activities are strictly prohibited:
                            </p>

                            <div className="ml-4 space-y-3">
                                <div>
                                    <h3 className="font-bold text-red-800">a) Resale or Redistribution</h3>
                                    <p>
                                        You may not sell, resell, license, sublicense, distribute, or otherwise transfer leads
                                        to any third party, including but not limited to other contractors, lead aggregators,
                                        or marketing agencies.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-red-800">b) Sharing of Access</h3>
                                    <p>
                                        Account credentials are confidential and may not be shared with employees, subcontractors,
                                        or any other individuals outside your registered business entity. Each business must
                                        maintain its own separate subscription.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-red-800">c) Data Scraping</h3>
                                    <p>
                                        Automated scraping, bulk downloading, or systematic extraction of lead data beyond
                                        normal business use is prohibited.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-red-800">d) Audit Rights</h3>
                                    <p>
                                        GC Ventures reserves the right to monitor account activity, including but not limited
                                        to login patterns, download volumes, and IP addresses, to detect violations of this policy.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-red-800">e) Immediate Termination</h3>
                                    <p>
                                        Upon detection of any prohibited activity, including multiple simultaneous logins,
                                        abnormal download patterns, or evidence of resale, GC Ventures may immediately terminate
                                        your account without refund and pursue legal remedies for damages.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-red-800">f) Liquidated Damages</h3>
                                    <p>
                                        In the event of unauthorized resale or redistribution, you agree to pay liquidated
                                        damages of <span className="font-bold">$500 per lead</span> improperly shared or resold,
                                        in addition to any other remedies available at law or in equity.
                                    </p>
                                </div>
                            </div>

                            <p className="font-semibold mt-4">
                                By subscribing, you acknowledge that leads are proprietary business information and that
                                unauthorized use constitutes theft of trade secrets and breach of contract.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payment</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            Our services are provided on a subscription basis. By subscribing, you agree to:
                        </p>
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                            <li>Pay the subscription fee as specified at the time of purchase</li>
                            <li>Automatic renewal unless cancelled prior to the renewal date</li>
                            <li>No refunds for partial months or unused leads</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            GC Ventures is not liable for any damages, injuries, or losses resulting from services provided
                            by third-party contractors. All contractors are independent businesses responsible for their own
                            licensing, insurance, and quality of work.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modifications to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of our services after
                            changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            For questions about these Terms of Service, please contact us at:
                            <br />
                            <a href="mailto:support@gcventures.com" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                                support@gcventures.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
