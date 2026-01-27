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

        console.log('🔍 Verify request received:', { contractorId, accessCode: accessCode ? '***' : 'missing' });

        // Verify access code
        if (accessCode !== 'gaga2026') {
            console.error('❌ Invalid access code');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('✅ Access code valid, updating contractor...');

        // Update contractor with service role (bypasses RLS)
        const { data, error } = await supabaseAdmin
            .from('contractors')
            .update({
                license_status: 'ACTIVE',
                insurance_verified: true,
                verification_status: 'verified'
            })
            .eq('id', contractorId)
            .select();

        if (error) {
            console.error('❌ Database error:', error);
            throw error;
        }

        console.log('✅ Contractor verified successfully:', data);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('❌ Error verifying contractor:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to verify contractor' },
            { status: 500 }
        );
    }
}
