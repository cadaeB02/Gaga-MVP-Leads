'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ContractorPortal from '@/components/ContractorPortal';

const SERVICE_TYPES = [
    { label: 'Remodel / Addition', value: 'General Building (B)' },
    { label: 'Electrical Issue', value: 'Electrical (C-10)' },
    { label: 'Plumbing / Leak', value: 'Plumbing (C-36)' },
    { label: 'AC / Heating', value: 'HVAC (C-20)' },
    { label: 'Painting', value: 'Painting (C-33)' },
    { label: 'Roofing', value: 'Roofing (C-39)' },
    { label: 'Landscaping', value: 'Landscaping (C-27)' },
    { label: 'Pool Maintenance', value: 'Pools (C-53)' },
];

export default function Home() {
    const [mode, setMode] = useState<'customer' | 'contractor'>('customer');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        zip_code: '',
        trade_type: '',
        job_description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.trade_type) {
            setError('Please select a service type');
            return false;
        }
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        if (!formData.zip_code.trim()) {
            setError('Please enter your zip code');
            return false;
        }
        if (!formData.job_description.trim()) {
            setError('Please describe your job');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error: supabaseError } = await supabase
                .from('leads')
                .insert([
                    {
                        name: formData.name,
                        phone: formData.phone,
                        zip_code: formData.zip_code,
                        trade_type: formData.trade_type,
                        job_description: formData.job_description
                    }
                ])
                .select();

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                throw supabaseError;
            }

            console.log('Lead submitted successfully:', data);
            setIsSuccess(true);
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Background accent shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-white">GC Ventures</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl">
                    {/* Toggle Switch */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-full p-1.5 border border-white/20 inline-flex">
                            <button
                                onClick={() => setMode('customer')}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${mode === 'customer'
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                Find a Pro
                            </button>
                            <button
                                onClick={() => setMode('contractor')}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${mode === 'contractor'
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                I am a Pro
                            </button>
                        </div>
                    </div>

                    {/* Customer View */}
                    {mode === 'customer' && (
                        <div className="w-full max-w-lg mx-auto">
                            {!isSuccess ? (
                                <div className="space-y-8">
                                    {/* Hero Section */}
                                    <div className="text-center space-y-6">
                                        {/* Tool Icon */}
                                        <div className="flex justify-center mb-4">
                                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                                            We find <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">contractors</span> for you
                                        </h1>
                                        <p className="text-xl md:text-2xl text-gray-300 font-medium">
                                            Just input the information below
                                        </p>
                                    </div>

                                    {/* Form Card */}
                                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Service Type</label>
                                                <select
                                                    name="trade_type"
                                                    value={formData.trade_type}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="" className="bg-gray-800">Select a service...</option>
                                                    {SERVICE_TYPES.map((service) => (
                                                        <option key={service.value} value={service.value} className="bg-gray-800">
                                                            {service.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="John Smith"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="(555) 123-4567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">Zip Code</label>
                                                <input
                                                    type="text"
                                                    name="zip_code"
                                                    placeholder="80301"
                                                    value={formData.zip_code}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">What do you need help with?</label>
                                                <textarea
                                                    name="job_description"
                                                    placeholder="Describe your project..."
                                                    value={formData.job_description}
                                                    onChange={handleChange}
                                                    rows={4}
                                                    className="w-full px-5 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all resize-none"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            {error && (
                                                <div className="bg-red-500/10 border-2 border-red-500/50 text-red-300 px-5 py-4 rounded-xl text-center backdrop-blur-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </span>
                                                ) : (
                                                    'Get Your Free Quote'
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Trust Badge */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400">
                                            🔒 Your information is secure and will never be shared
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Success State */
                                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-full shadow-lg shadow-green-500/30">
                                            <svg
                                                className="w-16 h-16 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                                        We Got It!
                                    </h2>
                                    <p className="text-xl text-gray-300 leading-relaxed">
                                        Garrett or Cade will call you shortly to discuss your project
                                    </p>
                                    <div className="pt-4">
                                        <div className="inline-flex items-center gap-2 text-orange-400 font-semibold">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            Expect a call within 24 hours
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contractor View */}
                    {mode === 'contractor' && <ContractorPortal />}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-4 py-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
                    <p>GC Ventures LLC | <a href="mailto:Garrett@GagaLeads.com" className="text-orange-400 hover:text-orange-300">Garrett@GagaLeads.com</a></p>
                </div>
            </footer>
        </div>
    );
}
