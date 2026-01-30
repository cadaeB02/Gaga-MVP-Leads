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
                            <li><Link href="/updates" className="hover:text-cyan-400 font-medium transition-colors">Platform Updates</Link></li>
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
                        {' '} | {' '}
                        <Link href="/updates" className="text-gray-500 hover:text-cyan-400 transition-colors">
                            v4.27
                        </Link>
                    </p>
                    <p className="text-sm">&copy; {new Date().getFullYear()} GC Ventures / The Digital Mechanic. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
