'use client';

import { useState, useRef, useEffect } from 'react';
import { CSLB_LICENSES, LicenseOption } from '@/constants/licenses';

interface LicenseComboboxProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export default function LicenseCombobox({ value, onChange, error, disabled }: LicenseComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter licenses based on search
    const filteredLicenses = CSLB_LICENSES.filter(license =>
        license.searchString.includes(search.toLowerCase())
    );

    // Initial search value based on existing value
    useEffect(() => {
        if (value) {
            const found = CSLB_LICENSES.find(l => l.label === value || l.code === value);
            if (found) {
                setSearch(found.label);
            }
        }
    }, [value]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Reset search to current label if closed without selecting
                const found = CSLB_LICENSES.find(l => l.label === value || l.code === value);
                if (found) setSearch(found.label);
                else if (!value) setSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    const handleSelect = (license: LicenseOption) => {
        onChange(license.label);
        setSearch(license.label);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(prev => (prev < filteredLicenses.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredLicenses[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                License Type (Search by Code or Trade) *
            </label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                        setHighlightedIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search e.g. C-10 or Electrical"
                    disabled={disabled}
                    className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all pr-12 ${
                        error ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-cyan-600'
                    } ${isOpen ? 'ring-2 ring-cyan-100 border-cyan-600' : ''}`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg 
                        className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-500' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Status Indicator for Active Search */}
                {isOpen && search && (
                    <div className="absolute -top-6 right-0">
                        <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest animate-pulse">
                            Searching...
                        </span>
                    </div>
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden transform transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredLicenses.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {filteredLicenses.map((license, index) => (
                                <button
                                    key={license.code}
                                    type="button"
                                    onClick={() => handleSelect(license)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between group ${
                                        index === highlightedIndex ? 'bg-cyan-50 text-cyan-700' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <div>
                                        <span className={`font-bold mr-2 ${index === highlightedIndex ? 'text-cyan-600' : 'text-gray-400'}`}>
                                            {license.code}
                                        </span>
                                        <span className="font-medium">{license.name}</span>
                                    </div>
                                    {license.label === value && (
                                        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 font-medium">No licenses found matching "{search}"</p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}
