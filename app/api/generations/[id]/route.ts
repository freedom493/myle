import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single generation
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
    }

    // Check access
    if (data.visibility === 'private' && data.user_id !== user?.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ generation: data });

  } catch (error) {
    console.error('Error fetching generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update visibility
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { visibility } = body;

    if (!visibility || !['public', 'private'].includes(visibility)) {
      return NextResponse.json({ error: 'Visibility must be "public" or "private"' }, { status: 400 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('generations')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('generations')
      .update({ visibility, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true, visibility });

  } catch (error) {
    console.error('Error updating generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a generation
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('generations')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('generations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
