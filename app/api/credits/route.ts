import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: credits, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !credits) {
      // Auto-create if missing
      const now = new Date().toISOString();
      const { data: newCredits, error: insertErr } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          credits_balance: 15,
          free_credits_used: 0,
          cycle_start: now,
        })
        .select()
        .single();

      if (insertErr || !newCredits) {
        return NextResponse.json({ error: 'Failed to get credits' }, { status: 500 });
      }

      return NextResponse.json({
        credits_balance: newCredits.credits_balance,
        free_credits_used: newCredits.free_credits_used,
        cycle_start: newCredits.cycle_start,
        days_until_reset: 30,
      });
    }

    // Check cycle reset
    const cycleStart = new Date(credits.cycle_start);
    const now = new Date();
    const daysSinceCycle = (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCycle >= 30) {
      const updatedBalance = credits.credits_balance + 15;
      await supabase
        .from('user_credits')
        .update({
          credits_balance: updatedBalance,
          free_credits_used: 0,
          cycle_start: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('user_id', user.id);

      return NextResponse.json({
        credits_balance: updatedBalance,
        free_credits_used: 0,
        cycle_start: now.toISOString(),
        days_until_reset: 30,
      });
    }

    return NextResponse.json({
      credits_balance: credits.credits_balance,
      free_credits_used: credits.free_credits_used,
      cycle_start: credits.cycle_start,
      days_until_reset: Math.ceil(30 - daysSinceCycle),
    });

  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
