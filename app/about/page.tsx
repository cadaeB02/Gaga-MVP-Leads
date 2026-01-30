'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
                    
                    <div className="space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-lg">
                                At Gaga MVP Leads, we dedicate ourselves to bridging the gap between homeowners and trusted, local professionals. Our platform simplifies the renovation process by providing verified, high-quality connections, ensuring that every project starts on the right foot.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
                            <p>
                                Founded by seasoned industry experts, GCP Ventures (operating as The Digital Mechanic) understands the challenges of the modern construction landscape. We aren't just a lead generation agency; we are your strategic partner in growth, committed to transparency, quality, and rigorous verification standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>
                                    <strong>For Homeowners:</strong> We provide a seamless, stress-free way to find licensed and insured contractors for your home improvement needs.
                                </li>
                                <li>
                                    <strong>For Contractors:</strong> We offer a steady stream of exclusive, high-intent leads to help you grow your business without the hassle of cold calling.
                                </li>
                            </ul>
                        </section>

                         <section className="bg-cyan-50 p-8 rounded-2xl border border-cyan-100 mt-8">
                            <h2 className="text-xl font-bold text-cyan-800 mb-2">Our Promise</h2>
                            <p className="text-cyan-900">
                                We believe in quality over quantity. That's why every contractor in our network undergoes a strict verification process, including license and insurance checks, so you can build with confidence.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
