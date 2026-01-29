'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LicenseCombobox from '@/components/LicenseCombobox';

export default function ContractorJoinPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        zipCode: '',
        tradeType: '',
        insuranceCertified: false,
        tosAccepted: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Please enter your name';
        }
        if (!formData.email.trim()) {
            errors.email = 'Please enter your email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
            errors.phone = 'Please enter your phone number';
        }
        if (!formData.licenseNumber.trim()) {
            errors.licenseNumber = 'Please enter your license number';
        }
        if (!formData.tradeType) {
            errors.tradeType = 'Please select your license type';
        }
        if (!formData.zipCode.trim()) {
            errors.zipCode = 'Please enter your zip code';
        } else if (!/^\d{5}$/.test(formData.zipCode)) {
            errors.zipCode = 'Please enter a valid 5-digit zip code';
        }
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.insuranceCertified) {
            errors.insuranceCertified = 'You must certify that your license is active and you carry General Liability Insurance';
        }
        if (!formData.tosAccepted) {
            errors.tosAccepted = 'You must accept the Terms of Service to continue';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
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

            // 1. Create Auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('User creation failed');

            // 2. Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    role: 'contractor',
                    phone: formData.phone,
                    zip_code: formData.zipCode,
                    trade_type: formData.tradeType,
                    tos_accepted_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

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
                    business_name: formData.name, // Using name as business name for now
                    license_status: 'ACTIVE',  // Auto-verified for MVP
                    insurance_verified: true,   // Auto-verified for MVP
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
                            onClick={() => router.push('/')}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                        >
                            Return to Home
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Smith"
                                className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {fieldErrors.name && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {fieldErrors.email && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(555) 123-4567"
                                className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {fieldErrors.phone && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                            )}
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                CA Contractor License Number *
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                placeholder="C-10 #123456"
                                className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.licenseNumber ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {fieldErrors.licenseNumber && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.licenseNumber}</p>
                            )}
                        </div>

                        {/* Trade Type / License Classification */}
                        <LicenseCombobox
                            value={formData.tradeType}
                            onChange={(val) => setFormData({ ...formData, tradeType: val })}
                            error={fieldErrors.tradeType}
                            disabled={isSubmitting}
                        />

                        {/* Zip Code */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Service Area Zip Code *
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="94102"
                                className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.zipCode ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {fieldErrors.zipCode && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.zipCode}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className={`w-full px-5 py-4 pr-12 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                        }`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    className={`w-full px-5 py-4 pr-12 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                                        }`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Insurance Certification - CRITICAL */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="insuranceCertified"
                                    checked={formData.insuranceCertified}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-cyan-500"
                                    disabled={isSubmitting}
                                />
                                <span className="text-gray-900 font-semibold">
                                    I certify that my license is active and I carry General Liability Insurance. *
                                </span>
                            </label>
                            <p className="text-sm text-gray-600 mt-3 ml-9">
                                This certification is legally required to receive leads through our platform.
                            </p>
                        </div>

                        {/* Terms of Service Acceptance - REQUIRED */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="tosAccepted"
                                    checked={formData.tosAccepted}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-cyan-500"
                                    disabled={isSubmitting}
                                />
                                <span className="text-gray-900 font-semibold">
                                    I have read and agree to the{' '}
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-600 hover:text-cyan-700 underline"
                                    >
                                        Terms of Service
                                    </a> *
                                </span>
                            </label>
                            {fieldErrors.tosAccepted && (
                                <p className="text-red-600 text-sm mt-2 ml-9">{fieldErrors.tosAccepted}</p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl">
                                {error}
                                {error.includes('already exists') && (
                                    <div className="mt-2">
                                        <a href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold underline">
                                            Click here to log in
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-5 text-lg font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Submit Application'
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <a href="/" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                                Back to home
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
