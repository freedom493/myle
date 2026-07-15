import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get all active tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }

    // Get user's completed tasks
    const { data: completions, error: completionsError } = await supabase
      .from('task_completions')
      .select('task_id')
      .eq('user_id', user.id);

    if (completionsError) {
      console.error('Error fetching completions:', completionsError);
      return NextResponse.json({ error: 'Failed to fetch completions' }, { status: 500 });
    }

    // Count completions per task
    const completionCounts = (completions || []).reduce((acc: Record<string, number>, comp) => {
      acc[comp.task_id] = (acc[comp.task_id] || 0) + 1;
      return acc;
    }, {});

    // Map tasks with their completion status
    const tasksWithStatus = (tasks || []).map(task => ({
      ...task,
      times_completed: completionCounts[task.id] || 0,
      is_completed: (completionCounts[task.id] || 0) >= task.max_completions,
    }));

    return NextResponse.json({ tasks: tasksWithStatus });

  } catch (error) {
    console.error('Error fetching tasks:', error);
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
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Task slug is required' }, { status: 400 });
    }

    // Find task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check how many times it's been completed
    const { count, error: countError } = await supabase
      .from('task_completions')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('task_id', task.id);

    if (countError) {
      return NextResponse.json({ error: 'Failed to verify task status' }, { status: 500 });
    }

    if (count !== null && count >= task.max_completions) {
      return NextResponse.json({ error: 'Task already fully completed' }, { status: 400 });
    }

    // Record completion
    const { error: completeError } = await supabase
      .from('task_completions')
      .insert({
        user_id: user.id,
        task_id: task.id,
      });

    if (completeError) {
      return NextResponse.json({ error: 'Failed to record completion' }, { status: 500 });
    }

    // Award credits
    const { data: credits } = await supabase
      .from('user_credits')
      .select('credits_balance')
      .eq('user_id', user.id)
      .single();

    if (credits) {
      await supabase
        .from('user_credits')
        .update({
          credits_balance: credits.credits_balance + task.credits_reward,
        })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, reward: task.credits_reward });

  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
