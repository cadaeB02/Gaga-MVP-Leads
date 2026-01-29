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
        console.log('💎 Awarding lead credit via RPC to user:', userId);

        const { error } = await supabaseAdmin
            .rpc('increment_credits', { target_user_id: userId, amount: 1 });

        if (error) console.error('❌ Error awarding credit:', error);
    } else {
        // Activate subscription AND award 1 credit (the Hook)
        console.log('🔄 Activating monthly retainer + awarding hook credit for user:', userId);

        const { error: subError } = await supabaseAdmin
            .from('contractors')
            .update({
                subscription_status: 'active',
                subscription_start_date: new Date().toISOString()
            })
            .eq('user_id', userId);

        const { error: creditError } = await supabaseAdmin
            .rpc('increment_credits', { target_user_id: userId, amount: 1 });

        if (subError) console.error('❌ Error activating subscription:', subError);
        if (creditError) console.error('❌ Error awarding hook credit:', creditError);
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard?payment=success', req.url));
}
