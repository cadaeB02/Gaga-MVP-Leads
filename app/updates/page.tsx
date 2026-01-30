'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UpdatesPage() {
    const updates = [
        {
            version: 'v4.6.0',
            date: 'January 29, 2026',
            type: 'Major Update',
            items: [
                'Enhanced Lead Control view with UUID paste support',
                'Added License Copy buttons for easier verification',
                'Fixed multiple UI redundancy issues',
                'Improved unified login flow',
                'Added dedicated contractor portfolio pages'
            ]
        },
        {
            version: 'v4.5.2',
            date: 'January 15, 2026',
            type: 'Patch',
            items: [
                'Stripe payment flow optimizations',
                'Mobile responsiveness improvements on dashboard',
                'Faster load times for lead lists'
            ]
        },
        {
            version: 'v4.5.0',
            date: 'January 02, 2026',
            type: 'Feature Release',
            items: [
                'Launch of "Smart Matching" algorithm',
                'New Contractor onboarding wizard',
                'Real-time lead notifications'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide">Changelog</span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4">Platform Updates</h1>
                        <p className="text-xl text-gray-600">Track the latest improvements and features we've added to Gaga MVP Leads.</p>
                    </div>

                    <div className="space-y-8">
                        {updates.map((update, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900">{update.version}</h2>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                                update.type === 'Major Update' ? 'bg-purple-100 text-purple-700' :
                                                update.type === 'Feature Release' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {update.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 font-medium">{update.date}</p>
                                    </div>
                                </div>
                                
                                <ul className="space-y-3">
                                    {update.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700">
                                            <svg className="w-6 h-6 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
