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
    const type = searchParams.get('type') || 'subscription';

    if (!userId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (type === 'payment') {
        // Award 1 lead credit for one-time payment
        console.log('💎 Awarding lead credit to user:', userId);

        // First, get current credits to increment properly (avoiding overwriting if multi-tabbed)
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('lead_credits')
            .eq('id', userId)
            .single();

        const currentCredits = profile?.lead_credits || 0;

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({
                lead_credits: currentCredits + 1
            })
            .eq('id', userId)
            .select();

        if (error) {
            console.error('❌ Error awarding credit:', error);
        } else {
            console.log('✅ Credit awarded:', data);
        }
    } else {
        // Legacy: Activate the contractor's subscription
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
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard?payment=success', req.url));
}
