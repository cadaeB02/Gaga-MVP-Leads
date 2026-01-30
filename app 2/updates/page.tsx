'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UpdateItem {
    version: string;
    title: string;
    date: string;
    changes: string[];
}

const updates: UpdateItem[] = [
    {
        version: 'v4.26',
        title: 'Lead Tiering, License Filtering & Premium Features',
        date: 'January 29, 2026',
        changes: [
            '🎯 Implemented Lead Tiering: Premium (exclusive) and Standard ($20 pool) leads',
            '🔍 Added Searchable California Contractor License Dropdown (full CSLB list)',
            '⚡ Enhanced Manual Lead Assignment with contractor name/business search',
            '🛠️ Fixed Credit Calculation Bug (atomic increment prevents double-crediting)',
            '🔐 Updated RLS Policies for trade-matching and license-based lead visibility',
            '📋 Added trade_type tracking to contractor profiles for intelligent matching'
        ]
    },
    {
        version: 'v3.4',
        title: 'Contractor Performance Stats & AI Suggestions',
        date: 'January 28, 2026',
        changes: [
            'Added lead statistics: Gotten (Total), Done (Fulfilled), and Now (Active) leads',
            'Implemented "⭐ SUGGESTED" badge for new or inactive contractors',
            'Enhanced lead assignment intelligence based on 30-day activity logs',
            'Improved mobile UI with horizontal performance metric grid'
        ]
    },
    {
        version: 'v3.3',
        title: 'Contractor ID Visibility & Quick Copy',
        date: 'January 28, 2026',
        changes: [
            'Added Contractor UUID display to the verification queue',
            'Implemented one-click copy button for Contractor IDs',
            'Streamlined the manual lead assignment workflow',
            'Improved mobile card view with compact project IDs'
        ]
    },
    {
        version: 'v3.2',
        title: 'Lead Control & Manual Assignment',
        date: 'January 28, 2026',
        changes: [
            'Added "Lead Control" dashboard for manual project-to-contractor matching',
            'Implemented UUID-based lead assignment for precise distribution',
            'Updated lead status management to include transparent "ASSIGNED" state',
            'Enhanced Admin Sidebar with new "Control" navigation section'
        ]
    },
    {
        version: 'v3.1',
        title: 'Admin Detail Views & Lead Verification',
        date: 'January 27, 2026',
        changes: [
            'Added clickable lead cards to Admin Dashboard for deep verification',
            'Implemented Contractor Detail Profiles with real-time performance stats',
            'Added "⚠️ Unverified Lead" badges for leads from unverified requesters',
            'Added lead assignment history to contractor profiles',
            'Improved navigation and layout for Admin Command Center'
        ]
    },
    {
        version: 'v3.0',
        title: 'Production RLS & Launch Prep',
        date: 'January 27, 2026',
        changes: [
            'Implemented comprehensive Row Level Security (RLS) across all tables',
            'Cleaned up Stripe checkout flow for production readiness',
            'Fixed contractor verification status synchronization issues',
            'Removed development quick-login buttons for security',
            'Updated branding to BETA status and improved mobile responsiveness'
        ]
    },
    {
        version: 'v2.9',
        title: 'Email Verification & Admin Approval',
        date: 'January 26, 2026',
        changes: [
            'Created dedicated email verification success page',
            'Added manual admin approval requirement for new contractors',
            'Implemented "Pending Approval" status page with business model context',
            'Secured requester data with targeted RLS policies'
        ]
    },
    {
        version: 'v2.8',
        title: 'Requester Routing & New Work Order',
        date: 'January 25, 2026',
        changes: [
            'Fixed intelligent homepage routing based on user authentication and role',
            'Added "New Work Order" creation flow direct from Requester Dashboard',
            'Implemented automatic pre-filling of customer data for existing users',
            'Fixed screen scrolling issues during navigation transitions'
        ]
    },
    {
        version: 'v2.6',
        title: 'Password Visibility & Timestamp Improvements',
        date: 'January 24, 2026',
        changes: [
            'Added password visibility toggles (eye icons) to all authentication forms',
            'Enhanced Admin Panel to show precise date and time for lead incoming',
            'Standardized timestamp formatting across all internal dashboards'
        ]
    },
    {
        version: 'v2.5',
        title: 'Terms of Service Acceptance',
        date: 'January 23, 2026',
        changes: [
            'Added mandatory TOS acceptance checkbox to contractor onboarding',
            'Implemented database tracking for legal acceptance timestamps',
            'Added direct links to legal documents during signup'
        ]
    },
    {
        version: 'v2.4',
        title: 'Version History Initialization',
        date: 'January 22, 2026',
        changes: [
            'Launched the version history tracking system',
            'Added changelog section to improve transparency with partners'
        ]
    },
    {
        version: 'v2.3',
        title: 'Dev Quick Login (Testing)',
        date: 'January 21, 2026',
        changes: [
            'Added temporary quick-login tools for faster development verification',
            'Streamlined internal testing workflows for contractor features'
        ]
    },
    {
        version: 'v2.2',
        title: 'Simplified Navigation',
        date: 'January 20, 2026',
        changes: [
            'Optimized role-based navigation menus',
            'Reduced menu clutter by removing cross-role links'
        ]
    },
    {
        version: 'v2.1',
        title: 'Work Order Details',
        date: 'January 19, 2026',
        changes: [
            'Made world order cards interactive on the dashboard',
            'Created dedicated detail pages for individual project tracking'
        ]
    },
    {
        version: 'v2.0',
        title: 'Requester Portal Foundation',
        date: 'January 18, 2026',
        changes: [
            'Launched support for Requesters (Homeowners/Customers)',
            'Built separate dashboard architecture for non-contractor users',
            'Integrated customer work order tracking'
        ]
    },
    {
        version: 'v1.0 - v1.29',
        title: 'Platform Genesis',
        date: 'January 2026',
        changes: [
            'Contractor signup and authentication systems',
            'Stripe payment gateway integration',
            'Lead preview and partial contact masking',
            'Admin dashboard for lead distribution',
            'Foundational security and data architecture'
        ]
    }
];

export default function UpdatesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow pt-28 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">
                            Release <span className="text-cyan-600">Notes</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Track our progress as we build the most efficient lead generation platform for contractors.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                        {updates.map((update, index) => (
                            <div key={update.version} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-cyan-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[45%] bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-cyan-600 px-3 py-1 bg-cyan-50 rounded-full">
                                            {update.version}
                                        </span>
                                        <time className="text-sm font-medium text-gray-400">
                                            {update.date}
                                        </time>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{update.title}</h3>
                                    <ul className="space-y-2">
                                        {update.changes.map((change, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-cyan-500 mt-1">•</span>
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-20 p-8 bg-cyan-900 rounded-3xl text-center text-white shadow-xl overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-4">Have feedback or feature requests?</h2>
                            <p className="text-cyan-100 mb-6">We're building Gaga Leads for you. Let us know how we can make it better.</p>
                            <a
                                href="mailto:Garrett@GagaLeads.com"
                                className="inline-block bg-white text-cyan-900 px-8 py-3 rounded-xl font-bold hover:bg-cyan-50 transition-all"
                            >
                                Contact Support
                            </a>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-cyan-800 rounded-full opacity-50 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-800 rounded-full opacity-50 blur-3xl"></div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
