import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    const userId = searchParams.get('user_id');

    if (!userId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Activate the contractor's subscription
    const { error } = await supabase
        .from('contractors')
        .update({
            subscription_status: 'ACTIVE',
            subscription_start_date: new Date().toISOString()
        })
        .eq('user_id', userId);

    if (error) {
        console.error('Error activating contractor:', error);
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard?payment=success', req.url));
}
