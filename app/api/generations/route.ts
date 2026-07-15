import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const visibility = url.searchParams.get('visibility');
    const publicOnly = url.searchParams.get('public') === 'true';

    // Public browsing - no auth required
    if (publicOnly) {
      let query = supabase
        .from('generations')
        .select('id, user_id, type, title, description, source_filename, visibility, created_at, json_data')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(50);

      if (type && ['flashcard', 'quiz'].includes(type)) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching public generations:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
      }

      // Add counts from json_data
      const items = (data || []).map((item) => {
        const jsonData = item.json_data as Record<string, unknown>;
        const cards = jsonData?.cards as unknown[];
        const questions = jsonData?.questions as unknown[];
        return {
          id: item.id,
          user_id: item.user_id,
          type: item.type,
          title: item.title,
          description: item.description,
          source_filename: item.source_filename,
          visibility: item.visibility,
          created_at: item.created_at,
          count: item.type === 'flashcard'
            ? (cards?.length || 0)
            : (questions?.length || 0),
        };
      });

      return NextResponse.json({ generations: items });
    }

    // Authenticated user's own generations
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let query = supabase
      .from('generations')
      .select('id, type, title, description, source_filename, visibility, created_at, json_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (type && ['flashcard', 'quiz'].includes(type)) {
      query = query.eq('type', type);
    }

    if (visibility && ['public', 'private'].includes(visibility)) {
      query = query.eq('visibility', visibility);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching generations:', error);
      return NextResponse.json({ error: 'Failed to fetch generations' }, { status: 500 });
    }

    const items = (data || []).map((item) => {
      const jsonData = item.json_data as Record<string, unknown>;
      const cards = jsonData?.cards as unknown[];
      const questions = jsonData?.questions as unknown[];
      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        source_filename: item.source_filename,
        visibility: item.visibility,
        created_at: item.created_at,
        count: item.type === 'flashcard'
          ? (cards?.length || 0)
          : (questions?.length || 0),
      };
    });

    return NextResponse.json({ generations: items });

  } catch (error) {
    console.error('Error in generations list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
