import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                {/* Disclaimer */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-white font-bold text-lg mb-3">DISCLAIMER: MARKETING SERVICES ONLY</h3>
                    <p className="text-sm leading-relaxed">
                        GC Ventures, operating as The Digital Mechanic ("Company"), is a marketing and lead generation agency.
                        We are <span className="font-semibold text-white">NOT a licensed contractor</span> and <span className="font-semibold text-white">DO NOT perform</span> any
                        construction, repair, installation, or other trade services. All work is performed by independent, third-party
                        licensed contractors who are solely responsible for the quality, safety, and legality of their services.
                        The Company makes no warranties, express or implied, regarding the work performed by any contractor.
                        By using this service, you acknowledge that GC Ventures is not liable for any damages, injuries, or losses
                        resulting from services provided by third-party contractors.
                    </p>
                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">For Contractors</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contractor/join" className="hover:text-white transition-colors">Join Network</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Version History */}
                <div className="border-t border-gray-700 pt-8 mb-8">
                    <h4 className="text-white font-semibold mb-4 text-center">Version History</h4>
                    <div className="max-w-3xl mx-auto space-y-3 text-sm">
                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v2.5 - Terms of Service Acceptance
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Added TOS acceptance checkbox to contractor signup</li>
                                <li>• Database tracking of TOS acceptance timestamp</li>
                                <li>• Required checkbox with link to Terms of Service</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v2.4 - Version History
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Added version history/changelog to footer</li>
                                <li>• Expandable details for each version</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v2.3 - Dev Quick Login for Contractors
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Added "Dev Quick Login" button to contractor login page</li>
                                <li>• Instant login as testpro@example.com for testing</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v2.2 - Simplified Navigation
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Simplified navigation to role-based "Dashboard" and "Home" buttons</li>
                                <li>• Removed cross-role dashboard links for better security</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v2.1 - Work Order Details & Navigation
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Added navigation menu to Requester Dashboard</li>
                                <li>• Made work order cards clickable</li>
                                <li>• Created work order detail page at /requester/lead/[id]</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v2.0 - Requester Portal Foundation
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Created Requester role and database schema</li>
                                <li>• Built Requester login page with dev quick-login</li>
                                <li>• Created Requester dashboard showing work orders</li>
                                <li>• Added "Already have an account? Log In" button to homepage</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                v1.29 - Legal Disclaimers
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Added comprehensive footer disclaimer</li>
                                <li>• Created Terms of Service page with anti-theft clause</li>
                                <li>• Added TCPA consent text to lead form</li>
                            </ul>
                        </details>

                        <details className="bg-gray-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400 transition-colors">
                                Earlier Versions (v1.0 - v1.28)
                            </summary>
                            <ul className="mt-3 ml-4 space-y-1 text-gray-400">
                                <li>• Contractor signup and authentication</li>
                                <li>• Stripe payment integration ($1 first month, $60/month)</li>
                                <li>• Lead preview mode with blurred contact info</li>
                                <li>• Admin dashboard for lead management</li>
                                <li>• Contractor verification workflow</li>
                                <li>• RLS security policies</li>
                            </ul>
                        </details>
                    </div>
                </div>

                {/* Copyright & Contact */}
                <div className="border-t border-gray-700 pt-8 text-center space-y-2">
                    <p className="text-sm">
                        <a href="mailto:Garrett@GagaLeads.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            Garrett@GagaLeads.com
                        </a>
                        {' '} | {' '}
                        <Link href="/admin/leads" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            Admin
                        </Link>
                    </p>
                    <p className="text-sm">&copy; {new Date().getFullYear()} GC Ventures / The Digital Mechanic. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
