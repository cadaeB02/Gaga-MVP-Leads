'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ContractorPortal from '@/components/ContractorPortal';
import { useSearchParams, useRouter } from 'next/navigation';
import ProgressDots from '@/components/ProgressDots';
import StepContainer from '@/components/StepContainer';

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

function HomeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mode, setMode] = useState<'customer' | 'contractor'>('customer');
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        zip_code: '',
        trade_type: '',
        job_description: '',
        password: '',
        confirmPassword: '',
        referralSource: '',
        referralDetail: '',
        tosAccepted: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Persistent Draft Saving
    useEffect(() => {
        const saved = localStorage.getItem('requester_signup_draft');
        if (saved) {
            try {
                const { data, step } = JSON.parse(saved);
                setFormData(prev => ({ ...prev, ...data }));
                setCurrentStep(step);
            } catch (e) {
                console.error('Failed to load draft');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('requester_signup_draft', JSON.stringify({ data: formData, step: currentStep }));
    }, [formData, currentStep]);

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role === 'requester') router.push('/requester/dashboard');
                else if (profile?.role === 'contractor') router.push('/dashboard');
            }
        };
        checkAuth();
    }, [router]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const newValue = type === 'checkbox' ? checked : value;

        const newFormData = {
            ...formData,
            [name]: newValue
        };
        setFormData(newFormData);

        // Auto-advance check
        if (name === 'zip_code' || name === 'trade_type' || name === 'job_description') {
            checkAutoAdvance(currentStep, newFormData);
        }
    };

    const checkAutoAdvance = (step: number, currentData: typeof formData) => {
        if (step === 1) {
            const isComplete = currentData.name && currentData.email && currentData.phone && currentData.zip_code.length === 5;
            if (isComplete) setTimeout(() => setCurrentStep(2), 400);
        }
        if (step === 2) {
            const isComplete = currentData.trade_type && currentData.job_description.trim();
            if (isComplete) setTimeout(() => setCurrentStep(3), 400);
        }
    };

    const validateStep = (step: number) => {
        setError('');
        if (step === 1) {
            if (!formData.name.trim()) { setError('Enter your name'); return false; }
            if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Valid email is required'); return false; }
            if (!formData.phone.trim()) { setError('Phone number is required'); return false; }
            if (!formData.zip_code.trim() || !/^\d{5}$/.test(formData.zip_code)) { setError('Valid zip code is required'); return false; }
        }
        if (step === 2) {
            if (!formData.trade_type) { setError('Select a service type'); return false; }
            if (!formData.job_description.trim()) { setError('Describe your project'); return false; }
        }
        if (step === 3) {
            if (!formData.password || formData.password.length < 8) { setError('Minimum 8 character password'); return false; }
            if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
            if (!formData.referralSource) { setError('Select how you heard about us'); return false; }
            if (formData.referralSource === 'Other' && !formData.referralDetail.trim()) { setError('Please specify how you heard about us'); return false; }
            if (!formData.tosAccepted) { setError('Accept the Terms of Service'); return false; }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;
        setIsSubmitting(true);
        localStorage.removeItem('requester_signup_draft');

        try {
            // Phase 4: Full Account Creation Flow

            // 1. Check if email already exists
            const { data: existingRequester } = await supabase
                .from('requesters')
                .select('email')
                .eq('email', formData.email)
                .single();

            if (existingRequester) {
                setError('An account with this email already exists. Please log in instead.');
                setIsSubmitting(false);
                return;
            }

            // 2. Create Supabase Auth user (profile will be auto-created by trigger)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                    data: {
                        full_name: formData.name,
                        referral_source: formData.referralSource === 'Other' ? formData.referralDetail : formData.referralSource
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('User creation failed');

            // IMPORTANT: Set the session so subsequent requests are authenticated
            if (authData.session) {
                await supabase.auth.setSession({
                    access_token: authData.session.access_token,
                    refresh_token: authData.session.refresh_token
                });
            }

            // 3. Create requester entry
            console.log('Creating requester with user_id:', authData.user.id);
            const { data: requesterData, error: requesterError } = await supabase
                .from('requesters')
                .insert({
                    user_id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    referral_source: formData.referralSource === 'Other' ? formData.referralDetail : formData.referralSource,
                    tos_accepted_at: new Date().toISOString()
                })
                .select()
                .single();

            if (requesterError) {
                console.error('Requester insert error:', requesterError);
                console.error('Full error details:', JSON.stringify(requesterError, null, 2));
                throw requesterError;
            }

            // 4. Create lead linked to requester
            const { error: leadError } = await supabase
                .from('leads')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    zip_code: formData.zip_code,
                    trade_type: formData.trade_type,
                    job_description: formData.job_description,
                    requester_id: requesterData.id
                });

            if (leadError) throw leadError;

            console.log('Account created successfully!', {
                user: authData.user.id,
                requester: requesterData.id
            });

            // 6. Success! User is already auto-logged in by signUp
            setIsSuccess(true);

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err: any) {
            console.error('Error creating account:', err);
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col bg-gradient-to-br from-sky-50 to-cyan-50">
            {/* Header */}
            <header className="relative z-10 px-4 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">LeadMan</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded border border-orange-200">BETA</span>
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">v4.2</span>
                        </div>
                    </div>
                </div>
            </header>



            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl">
                    {/* Toggle Switch */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white rounded-full p-1.5 border border-gray-200 inline-flex shadow-sm">
                            <button
                                onClick={() => setMode('customer')}
                                className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'customer'
                                    ? 'bg-cyan-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Find a Pro
                            </button>
                            <button
                                onClick={() => setMode('contractor')}
                                className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'contractor'
                                    ? 'bg-cyan-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                I am a Pro
                            </button>
                        </div>
                    </div>

                    {/* Customer View */}
                    {mode === 'customer' && (
                        <div className="w-full max-w-2xl mx-auto space-y-8">
                            {!isSuccess ? (
                                <>
                                    {/* Hero Section */}
                                    <div className="text-center space-y-6">
                                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                            We find <span className="text-cyan-600">contractors</span> for you
                                        </h1>
                                        <p className="text-xl text-gray-600">
                                            Just input the information below
                                        </p>
                                    </div>

                                    {/* Form Card */}
                                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 max-w-md mx-auto">
                                        <ProgressDots 
                                            steps={3} 
                                            currentStep={currentStep}
                                            onStepClick={(step) => {
                                                if (step < currentStep) setCurrentStep(step);
                                            }}
                                        />
                                        
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            {/* Step 1: Personal Info */}
                                            <StepContainer active={currentStep === 1}>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                                                        <input type="text" name="name" placeholder="John Smith" value={formData.name} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                                        <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 transition-all" />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                            <input type="tel" name="phone" placeholder="(555) 123-4567" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 transition-all" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                                                            <input type="text" name="zip_code" placeholder="80301" value={formData.zip_code} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 transition-all" />
                                                        </div>
                                                    </div>
                                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                                    <button type="button" onClick={nextStep} className="w-full bg-cyan-600 text-white py-5 text-lg font-bold rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all">Next Step</button>
                                                </div>
                                            </StepContainer>

                                            {/* Step 2: Project Details */}
                                            <StepContainer active={currentStep === 2}>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                                                        <select name="trade_type" value={formData.trade_type} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 transition-all cursor-pointer">
                                                            <option value="">Select a service...</option>
                                                            {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">What do you need help with?</label>
                                                        <textarea name="job_description" placeholder="Describe your project..." value={formData.job_description} onChange={handleChange} rows={4} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 transition-all resize-none" />
                                                    </div>
                                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                                    <div className="flex gap-3">
                                                        <button type="button" onClick={prevStep} className="flex-1 px-5 py-5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">Back</button>
                                                        <button type="button" onClick={nextStep} className="flex-[2] bg-cyan-600 text-white py-5 text-lg font-bold rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all">Next Step</button>
                                                    </div>
                                                </div>
                                            </StepContainer>

                                            {/* Step 3: Account & Legal */}
                                            <StepContainer active={currentStep === 3}>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Passowrd</label>
                                                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Min. 8 chars" value={formData.password} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm</label>
                                                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Repeat..." value={formData.confirmPassword} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">How did you hear about us?</label>
                                                        <select name="referralSource" value={formData.referralSource} onChange={handleChange} className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600 transition-all">
                                                            <option value="">Select option...</option>
                                                            <option value="Google">Google Search</option>
                                                            <option value="Social">Social Media</option>
                                                            <option value="Friend">Friend/Family</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    {formData.referralSource === 'Other' && (
                                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Please specify *</label>
                                                            <input 
                                                                type="text" 
                                                                name="referralDetail" 
                                                                placeholder="Tell us more..." 
                                                                value={formData.referralDetail} 
                                                                onChange={handleChange} 
                                                                className="w-full px-5 py-4 text-lg bg-gray-50 border-2 border-cyan-600 rounded-xl text-gray-900 focus:outline-none transition-all" 
                                                                autoFocus
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                                                        <label className="flex items-start gap-3 cursor-pointer">
                                                            <input type="checkbox" name="tosAccepted" checked={formData.tosAccepted} onChange={handleChange} className="mt-1 w-5 h-5 text-cyan-600 rounded" />
                                                            <span className="text-xs text-gray-900 leading-tight font-semibold">I agree to the <a href="/terms" target="_blank" className="text-cyan-600 underline">Terms of Service</a> & <a href="/privacy" target="_blank" className="text-cyan-600 underline">Marketing Consent</a> *</span>
                                                        </label>
                                                        <p className="text-[10px] text-gray-500 italic leading-tight">By continuing, I express consent to receive marketing and informational communications via telephone, SMS, and email. Frequency varies. Reply STOP to cancel.</p>
                                                    </div>
                                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                                    <div className="flex gap-3">
                                                        <button type="button" onClick={prevStep} className="flex-1 px-5 py-5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">Back</button>
                                                        <button type="submit" disabled={isSubmitting} className="flex-[2] bg-cyan-600 text-white py-5 text-lg font-bold rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all">
                                                            {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </StepContainer>
                                        </form>

                                        <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                                            <a
                                                href="/requester/login"
                                                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 text-base font-bold rounded-xl transition-all border border-gray-200 hover:border-cyan-400 text-center"
                                            >
                                                Already have an account? Log In
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Success State */
                                <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className="bg-green-100 p-6 rounded-full">
                                            <svg
                                                className="w-16 h-16 text-green-600"
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
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                                        We Got It!
                                    </h2>
                                    <p className="text-xl text-gray-600 leading-relaxed">
                                        We are finding a verified pro for you
                                    </p>
                                    <div className="pt-4">
                                        <div className="inline-flex items-center gap-2 text-cyan-600 font-semibold">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            Expect a call within 24 hours
                                        </div>
                                    </div>

                                    {/* Dashboard Button */}
                                    <div className="pt-6">
                                        <button
                                            onClick={() => router.push('/requester/dashboard')}
                                            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg transform hover:scale-105"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            View My Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contractor View */}
                    {mode === 'contractor' && <ContractorPortal />}
                </div>
            </main>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
            <HomeContent />
        </Suspense>
    );
}
