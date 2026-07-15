import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      // Should ideally be handled by the trigger, but fallback just in case
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }

    return NextResponse.json({ code: data.code });

  } catch (error) {
    console.error('Error fetching referral code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // 1. Check if user already used a referral code
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', user.id)
      .single();

    if (existingReferral) {
      return NextResponse.json({ error: 'You have already applied a referral code' }, { status: 400 });
    }

    // 2. Find the referrer by code
    const { data: referrer, error: codeError } = await supabase
      .from('referral_codes')
      .select('user_id')
      .eq('code', code)
      .single();

    if (codeError || !referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    if (referrer.user_id === user.id) {
      return NextResponse.json({ error: 'You cannot use your own referral code' }, { status: 400 });
    }

    const CREDITS_REWARD = 4;

    // 3. Create referral record
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.user_id,
        referred_id: user.id,
        credits_awarded: CREDITS_REWARD,
      });

    if (insertError) {
      console.error('Failed to create referral:', insertError);
      return NextResponse.json({ error: 'Failed to apply referral code' }, { status: 500 });
    }

    // 4. Give credits to referrer
    const { data: referrerCredits } = await supabase
      .from('user_credits')
      .select('credits_balance')
      .eq('user_id', referrer.user_id)
      .single();

    if (referrerCredits) {
      await supabase
        .from('user_credits')
        .update({
          credits_balance: referrerCredits.credits_balance + CREDITS_REWARD,
        })
        .eq('user_id', referrer.user_id);
    }

    // 5. Give credits to referred user
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('credits_balance')
      .eq('user_id', user.id)
      .single();

    if (userCredits) {
      await supabase
        .from('user_credits')
        .update({
          credits_balance: userCredits.credits_balance + CREDITS_REWARD,
        })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, reward: CREDITS_REWARD });

  } catch (error) {
    console.error('Error applying referral code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
