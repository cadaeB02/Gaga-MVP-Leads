import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    const userId = searchParams.get('user_id');

    if (!userId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Activate the contractor's subscription using admin client
    console.log('🔄 Activating subscription for user:', userId);

    const { data, error } = await supabaseAdmin
        .from('contractors')
        .update({
            subscription_status: 'active',
            subscription_start_date: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

    if (error) {
        console.error('❌ Error activating contractor:', error);
    } else {
        console.log('✅ Contractor activated:', data);
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard?payment=success', req.url));
}
