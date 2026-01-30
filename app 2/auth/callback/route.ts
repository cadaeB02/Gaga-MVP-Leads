import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (code) {
        // In a real Next.js app with SSR, you'd use the PKCE flow with cookies.
        // For a simple client-side focused MVP, we'll let the client handle the hash.
        // However, Supabase recovery links usually come with a 'code' for PKCE or a 'access_token' in the hash.

        // This server route ensures the 'code' is handled if present.
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error('Error exchanging code for session:', error.message);
        }
    }

    return NextResponse.redirect(new URL(next, request.url));
}
