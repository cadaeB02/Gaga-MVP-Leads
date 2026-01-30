import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role to bypass RLS for credit deduction
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const { lead_id, contractor_id } = await request.json();

        if (!lead_id || !contractor_id) {
            return NextResponse.json(
                { error: 'Missing lead_id or contractor_id' },
                { status: 400 }
            );
        }

        // 1. Check contractor's credit balance
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('lead_credits')
            .eq('id', contractor_id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Contractor profile not found' },
                { status: 404 }
            );
        }

        // 2. If no credits, return error with redirect
        if (profile.lead_credits <= 0) {
            return NextResponse.json(
                { 
                    error: 'insufficient_credits', 
                    redirect: `/checkout/reveal?lead_id=${lead_id}` 
                },
                { status: 402 } // Payment Required
            );
        }

        // 3. Fetch lead details before revealing
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('name, phone, email, job_description, zip_code, trade_type, visible_to_user_id, status_v2')
            .eq('id', lead_id)
            .single();

        if (leadError || !lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        // 4. Verify this lead is assigned to this contractor
        if (lead.visible_to_user_id !== contractor_id) {
            return NextResponse.json(
                { error: 'This lead is not assigned to you' },
                { status: 403 }
            );
        }

        // 5. Check if already revealed
        if (lead.status_v2 === 'revealed') {
            return NextResponse.json({
                success: true,
                already_revealed: true,
                contact_info: {
                    name: lead.name,
                    phone: lead.phone,
                    email: lead.email,
                    job_description: lead.job_description,
                    zip_code: lead.zip_code,
                    trade_type: lead.trade_type
                }
            });
        }

        // 6. Atomic transaction: Deduct credit + Update lead
        const { error: creditError } = await supabase
            .from('profiles')
            .update({ lead_credits: profile.lead_credits - 1 })
            .eq('id', contractor_id);

        if (creditError) {
            return NextResponse.json(
                { error: 'Failed to deduct credit' },
                { status: 500 }
            );
        }

        const { error: updateError } = await supabase
            .from('leads')
            .update({
                status_v2: 'revealed',
                revealed_at: new Date().toISOString()
            })
            .eq('id', lead_id);

        if (updateError) {
            // Rollback credit deduction
            await supabase
                .from('profiles')
                .update({ lead_credits: profile.lead_credits })
                .eq('id', contractor_id);

            return NextResponse.json(
                { error: 'Failed to reveal lead' },
                { status: 500 }
            );
        }

        // 7. Return success with contact info
        return NextResponse.json({
            success: true,
            credits_remaining: profile.lead_credits - 1,
            contact_info: {
                name: lead.name,
                phone: lead.phone,
                email: lead.email,
                job_description: lead.job_description,
                zip_code: lead.zip_code,
                trade_type: lead.trade_type
            }
        });

    } catch (error) {
        console.error('Reveal API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
