'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
    id: string;
    name: string;
    trade_type: string;
    job_description: string;
    created_at: string;
    visible_to_user_id?: string;
}

interface Contractor {
    user_id: string;
    name: string;
    business_name: string;
    trade_type: string;
}

export default function LeadControlView() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [contractorUuid, setContractorUuid] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState<{ [key: string]: string }>({});
    const [showDropdown, setShowDropdown] = useState<{ [key: string]: boolean }>({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUnassignedLeads = async () => {
        setIsLoading(true);
        try {
            // Fetch leads where visible_to_user_id is NULL
            const { data, error: supabaseError } = await supabase
                .from('leads')
                .select('*')
                .is('visible_to_user_id', null)
                .order('created_at', { ascending: false });

            if (supabaseError) throw supabaseError;
            setLeads(data || []);
        } catch (err) {
            console.error('Error fetching unassigned leads:', err);
            setError('Failed to load unassigned leads');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchContractors = async () => {
        try {
            const { data, error } = await supabase
                .from('contractors')
                .select('user_id, name, business_name, trade_type')
                .eq('license_status', 'ACTIVE'); // Only show active contractors
            
            if (error) throw error;
            setContractors(data || []);
        } catch (err) {
            console.error('Error fetching contractors:', err);
        }
    };

    useEffect(() => {
        fetchUnassignedLeads();
        fetchContractors();
    }, []);

    const handleAssign = async (leadId: string) => {
        const uuid = contractorUuid[leadId];
        if (!uuid || uuid.trim() === '') {
            alert('Please enter a Contractor UUID');
            return;
        }

        setAssigningId(leadId);
        setError('');
        setSuccess('');

        try {
            // First, get the contractor's name for a better success message
            const { data: contractorData } = await supabase
                .from('contractors')
                .select('name, business_name')
                .eq('user_id', uuid.trim())
                .single();

            const displayName = contractorData?.business_name || contractorData?.name || uuid.trim();

            const { error: updateError } = await supabase
                .from('leads')
                .update({
                    visible_to_user_id: uuid.trim(),
                    status: 'ASSIGNED'
                })
                .eq('id', leadId);

            if (updateError) throw updateError;

            setSuccess(`Lead successfully assigned to ${displayName}`);
            // Refresh list
            fetchUnassignedLeads();
        } catch (err: any) {
            console.error('Error assigning lead:', err);
            setError(err.message || 'Failed to assign lead');
        } finally {
            setAssigningId(null);
        }
    };

    const handleUuidChange = (leadId: string, value: string) => {
        setContractorUuid(prev => ({
            ...prev,
            [leadId]: value
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Lead Control</h1>
                <p className="text-gray-600">Manually assign unassigned leads to specific contractors</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            {leads.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No unassigned leads</h3>
                    <p className="text-gray-600">All leads currently have assignments or are in the open pool</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {leads.map((lead) => (
                        <div key={lead.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-cyan-600 px-3 py-1 bg-cyan-50 rounded-full uppercase">
                                            {lead.trade_type}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ID: {lead.id}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{lead.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {lead.job_description}
                                    </p>
                                </div>

                                <div className="w-full md:w-80 space-y-3 relative">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">ASSIGN CONTRACTOR</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search contractor name..."
                                                value={searchTerm[lead.id] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setSearchTerm(prev => ({ ...prev, [lead.id]: val }));
                                                    setShowDropdown(prev => ({ ...prev, [lead.id]: true }));
                                                    // If user clears input, clear selection
                                                    if (!val) setContractorUuid(prev => ({ ...prev, [lead.id]: '' }));
                                                }}
                                                onFocus={() => setShowDropdown(prev => ({ ...prev, [lead.id]: true }))}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-600"
                                            />
                                            {showDropdown[lead.id] && (searchTerm[lead.id]?.length > 0) && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {contractors
                                                        .filter(c => 
                                                            c.name.toLowerCase().includes(searchTerm[lead.id].toLowerCase()) || 
                                                            c.business_name?.toLowerCase().includes(searchTerm[lead.id].toLowerCase())
                                                        )
                                                        .map(c => (
                                                            <button
                                                                key={c.user_id}
                                                                className="w-full text-left px-4 py-2 hover:bg-cyan-50 text-sm transition-colors"
                                                                onClick={() => {
                                                                    setSearchTerm(prev => ({ ...prev, [lead.id]: c.business_name || c.name }));
                                                                    setContractorUuid(prev => ({ ...prev, [lead.id]: c.user_id }));
                                                                    setShowDropdown(prev => ({ ...prev, [lead.id]: false }));
                                                                }}
                                                            >
                                                                <p className="font-bold text-gray-900">{c.business_name || c.name}</p>
                                                                <p className="text-[10px] text-gray-500 uppercase">{c.trade_type}</p>
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAssign(lead.id)}
                                        disabled={assigningId === lead.id || !contractorUuid[lead.id]}
                                        className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${assigningId === lead.id || !contractorUuid[lead.id]
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-cyan-600 hover:bg-cyan-700 active:scale-[0.98]'
                                            }`}
                                    >
                                        {assigningId === lead.id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Assigning...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Assign Lead
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
