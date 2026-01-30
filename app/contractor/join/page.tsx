'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LicenseCombobox from '@/components/LicenseCombobox';
import ProgressDots from '@/components/ProgressDots';
import StepContainer from '@/components/StepContainer';

export default function ContractorJoinPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        zipCode: '',
        tradeType: '',
        otherLicenseDescription: '',
        referralSource: '',
        referralDetail: '',
        insuranceCertified: false,
        tosAccepted: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        const newValue = type === 'checkbox' ? checked : value;

        const newFormData = {
            ...formData,
            [name]: newValue
        };
        setFormData(newFormData);
    };


    const handleLicenseChange = (val: string) => {
        const newFormData = { ...formData, tradeType: val };
        setFormData(newFormData);
    };

    const validateStep = (step: number) => {
        const errors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.name.trim()) errors.name = 'Full name is required';
            if (!formData.email.trim()) {
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'Enter a valid email address';
            }
            if (!formData.phone.trim()) errors.phone = 'Phone number is required';
            if (!formData.zipCode.trim()) {
                errors.zipCode = 'Zip code is required';
            } else if (!/^\d{5}$/.test(formData.zipCode)) {
                errors.zipCode = 'Enter a valid 5-digit zip code';
            }
        }

        if (step === 2) {
            if (!formData.tradeType) errors.tradeType = 'Please select a license type';
            if (formData.tradeType === 'OTHER (Please Specify)' && !formData.otherLicenseDescription.trim()) {
                errors.otherLicenseDescription = 'Description is required for Other category';
            }
            if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
            if (!formData.insuranceCertified) errors.insuranceCertified = 'Insurance certification is required';
        }

        if (step === 3) {
            if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
            if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
            if (!formData.referralSource) errors.referralSource = 'Please select a referral source';
            if (formData.referralSource === 'Other' && !formData.referralDetail.trim()) {
                errors.referralDetail = 'Please specify how you heard about us';
            }
            if (!formData.tosAccepted) errors.tosAccepted = 'You must accept the Terms of Service';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateStep(3)) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if email already exists in contractors table
            const { data: existingContractor, error: checkError } = await supabase
                .from('contractors')
                .select('email')
                .eq('email', formData.email)
                .single();

            if (existingContractor) {
                setError('Account already exists. Please log in instead.');
                setIsSubmitting(false);
                return;
            }

            // 1. Create Auth user (profile will be auto-created by trigger)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                    data: {
                        full_name: formData.name,
                        role: 'contractor',
                        trade_type: formData.tradeType,
                        referral_source: formData.referralSource === 'Other' ? formData.referralDetail : formData.referralSource
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('User creation failed');

            // 2. Ensure profile exists (create if trigger didn't)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    email: formData.email,
                    full_name: formData.name,
                    role: 'contractor',
                    lead_credits: 0
                }, { onConflict: 'id' });

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Continue anyway - profile might exist from trigger
            }

            // 3. Create contractor entry
            const { error: contractorError } = await supabase
                .from('contractors')
                .insert({
                    user_id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    license_number: formData.licenseNumber,
                    trade_type: formData.tradeType,
                    other_license_description: formData.tradeType === 'OTHER (Please Specify)' ? formData.otherLicenseDescription : null,
                    business_name: formData.name,
                    license_status: 'PENDING',
                    insurance_verified: formData.insuranceCertified,
                    tos_accepted_at: new Date().toISOString()
                });

            if (contractorError) throw contractorError;

            setSuccess(true);

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 max-w-2xl w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-6 rounded-full">
                            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">Application Submitted!</h2>
                    <div className="text-left bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">What happens next:</h3>
                        <ol className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="bg-cyan-100 text-cyan-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                                <span>Our team will verify your license with the California Contractors State License Board</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-cyan-100 text-cyan-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                                <span>You'll receive an email confirmation once your account is approved (usually within 24 hours)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-cyan-100 text-cyan-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                                <span>Once verified, activate your <strong>$60/mo Maintenance Retainer</strong> to unlock leads</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-cyan-100 text-cyan-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">4</span>
                                <span>Start receiving exclusive leads in your area!</span>
                            </li>
                        </ol>
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={() => router.push('/contractor/dashboard')}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg transform hover:scale-105"
                        >
                            Go to My Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Join as a <span className="text-cyan-600">Contractor</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Get verified and start receiving exclusive local leads
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                    <ProgressDots 
                        steps={3} 
                        currentStep={currentStep} 
                        onStepClick={(step) => {
                            if (step < currentStep) setCurrentStep(step);
                        }}
                    />
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Personal Info */}
                        <StepContainer active={currentStep === 1}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Smith"
                                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                    />
                                    {fieldErrors.name && <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                    />
                                    {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(555) 123-4567"
                                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                    />
                                    {fieldErrors.phone && <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Area Zip Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        placeholder="94102"
                                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.zipCode ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                    />
                                    {fieldErrors.zipCode && <p className="text-red-600 text-sm mt-1">{fieldErrors.zipCode}</p>}
                                </div>
                                <button type="button" onClick={nextStep} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-5 text-lg font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                                    Next Step
                                </button>
                            </div>
                        </StepContainer>

                        {/* Step 2: License & Insurance */}
                        <StepContainer active={currentStep === 2}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional credentials</h2>
                            <div className="space-y-4">
                                <LicenseCombobox
                                    value={formData.tradeType}
                                    onChange={handleLicenseChange}
                                    error={fieldErrors.tradeType}
                                />
                                {formData.tradeType === 'OTHER (Please Specify)' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Please describe your license type *</label>
                                        <textarea
                                            name="otherLicenseDescription"
                                            value={formData.otherLicenseDescription}
                                            onChange={(e) => setFormData({ ...formData, otherLicenseDescription: e.target.value })}
                                            placeholder="e.g., Specialty contractor for..."
                                            rows={3}
                                            className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all resize-none ${fieldErrors.otherLicenseDescription ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                        />
                                        {fieldErrors.otherLicenseDescription && <p className="text-red-600 text-sm mt-1">{fieldErrors.otherLicenseDescription}</p>}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">CA Contractor License Number *</label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="1234567"
                                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.licenseNumber ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                    />
                                    {fieldErrors.licenseNumber && <p className="text-red-600 text-sm mt-1">{fieldErrors.licenseNumber}</p>}
                                </div>
                                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="insuranceCertified"
                                            checked={formData.insuranceCertified}
                                            onChange={handleChange}
                                            className="mt-1 w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-cyan-500"
                                        />
                                        <span className="text-gray-900 font-semibold leading-tight">I certify that my license is active and I carry General Liability Insurance. *</span>
                                    </label>
                                    {fieldErrors.insuranceCertified && <p className="text-red-600 text-sm mt-2">{fieldErrors.insuranceCertified}</p>}
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={prevStep} className="flex-1 px-5 py-5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">Back</button>
                                    <button type="button" onClick={nextStep} className="flex-[2] bg-cyan-600 hover:bg-cyan-700 text-white py-5 text-lg font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">Next Step</button>
                                </div>
                            </div>
                        </StepContainer>

                        {/* Step 3: Account Setup */}
                        <StepContainer active={currentStep === 3}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 8 characters"
                                            className={`w-full px-5 py-4 pr-12 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                                            {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                                        </button>
                                    </div>
                                    {fieldErrors.password && <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Re-enter password"
                                            className={`w-full px-5 py-4 pr-12 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                                            {showConfirmPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                                        </button>
                                    </div>
                                    {fieldErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">How did you hear about us? *</label>
                                    <select
                                        name="referralSource"
                                        value={formData.referralSource}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 focus:outline-none focus:bg-white transition-all ${fieldErrors.referralSource ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'}`}
                                    >
                                        <option value="">Select an option...</option>
                                        <option value="Google Search">Google Search</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Referral">Referral from Friend/Colleague</option>
                                        <option value="Event">Industry Event/Trade Show</option>
                                        <option value="Online Ad">Online Ad</option>
                                        <option value="Direct Mail">Direct Mail</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {fieldErrors.referralSource && <p className="text-red-600 text-sm mt-1">{fieldErrors.referralSource}</p>}
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
                                            className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 focus:outline-none focus:bg-white transition-all ${fieldErrors.referralDetail ? 'border-red-500 focus:border-red-600' : 'border-cyan-600'}`}
                                            autoFocus
                                        />
                                        {fieldErrors.referralDetail && <p className="text-red-600 text-sm mt-1">{fieldErrors.referralDetail}</p>}
                                    </div>
                                )}
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="tosAccepted"
                                            checked={formData.tosAccepted}
                                            onChange={handleChange}
                                            className="mt-1 w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-cyan-500"
                                        />
                                        <span className="text-gray-900 font-semibold leading-tight">
                                            I agree to the <a href="/terms" target="_blank" className="text-cyan-600 underline">Terms of Service</a> & <a href="/privacy" target="_blank" className="text-cyan-600 underline">Marketing Consent</a> *
                                        </span>
                                    </label>
                                    {fieldErrors.tosAccepted && <p className="text-red-600 text-sm mt-2">{fieldErrors.tosAccepted}</p>}
                                </div>
                                {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">{error}</div>}
                                <div className="flex gap-3">
                                    <button type="button" onClick={prevStep} className="flex-1 px-5 py-5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">Back</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-[2] bg-cyan-600 hover:bg-cyan-700 text-white py-5 text-lg font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                                        {isSubmitting ? 'Creating...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </StepContainer>

                        <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                            Already have an account? <a href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">Log in here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
