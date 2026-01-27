'use client';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: NextRequest) {
    try {
        const { contractorId, accessCode } = await request.json();

        // Verify access code
        if (accessCode !== 'gaga2026') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Update contractor with service role (bypasses RLS)
        const { error } = await supabaseAdmin
            .from('contractors')
            .update({
                license_status: 'ACTIVE',
                insurance_verified: true,
                verification_status: 'verified'
            })
            .eq('id', contractorId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error verifying contractor:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to verify contractor' },
            { status: 500 }
        );
    }
}
