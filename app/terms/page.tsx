'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                    
                    <div className="space-y-6 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using Gaga MVP Leads ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Service, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                            <p>
                                Gaga MVP Leads provides a platform for connecting homeowners and verify requesters with licensed contractors. We do not guarantee the quality of work performed by contractors, nor do we guarantee that a requester will hire a specific contractor.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contractor Responsibilities</h2>
                            <p>
                                Contractors using our service must:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Maintain valid licensure with the CSLB</li>
                                <li>Carry appropriate insurance coverage</li>
                                <li>Perform work according to industry standards</li>
                                <li>Interact professionally with potential clients</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Lead Delivery & Fees</h2>
                            <p>
                                Leads are distributed based on service area and match criteria. Contractors agree to the $60/month maintenance retainer for access to exclusive leads. Fees are non-refundable unless otherwise stated in writing.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limited Liability</h2>
                            <p>
                                Gaga MVP Leads shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service or for cost of procurement of substitute goods and services or resulting from any goods or services purchased or obtained or messages received or transactions entered into through the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modification of Terms</h2>
                            <p>
                                We reserve the right to change these terms from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms.
                            </p>
                        </section>

                         <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at support@gagamvpleads.com.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-400">Last updated: January 29, 2026</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
