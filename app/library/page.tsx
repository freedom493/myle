'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, BookOpen, ClipboardList, Lock, Globe, Loader2, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface Generation {
  id: string;
  type: 'flashcard' | 'quiz';
  title: string;
  description: string | null;
  visibility: 'public' | 'private';
  created_at: string;
  count: number;
}

export default function LibraryPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flashcard' | 'quiz'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?next=/library');
      return;
    }

    const fetchGenerations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/generations');
        if (!res.ok) throw new Error('Failed to fetch library');
        const data = await res.json();
        setGenerations(data.generations || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, [isAuthenticated, authLoading, router]);

  const handleToggleVisibility = async (id: string, currentVisibility: string) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
    try {
      const res = await fetch(`/api/generations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: newVisibility })
      });
      if (res.ok) {
        setGenerations(generations.map(g => g.id === id ? { ...g, visibility: newVisibility } : g));
      }
    } catch (error) {
      console.error('Failed to toggle visibility', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await fetch(`/api/generations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGenerations(generations.filter(g => g.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm text-brand-muted font-semibold">Loading your library...</p>
      </div>
    );
  }

  const filtered = filter === 'all' ? generations : generations.filter(g => g.type === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-10 md:py-14 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-brand-indigo/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo">
            <FolderOpen className="h-3.5 w-3.5" />
            My Library
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-indigo font-heading leading-tight">
            Generated Content
          </h1>
          <p className="text-brand-muted text-sm max-w-xl">
            Access, manage, and share all the flashcards and quizzes you've created with AI.
          </p>
        </div>
        <Button href="/create" className="shrink-0 bg-brand-lime text-brand-indigo hover:bg-brand-lime/90 shadow-sm">
          Create New
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger border border-brand-danger/20">
          {error}
        </div>
      )}

      {generations.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <FolderOpen className="h-12 w-12 text-brand-indigo/20 mx-auto" />
          <h3 className="text-xl font-bold text-brand-indigo font-heading">Your library is empty</h3>
          <p className="text-brand-muted text-sm max-w-sm mx-auto">
            You haven't generated any study materials yet. Upload a document to get started.
          </p>
          <Button href="/create" className="mt-4">
            Create with AI
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === 'all' ? 'bg-brand-indigo text-white' : 'bg-brand-indigo/5 text-brand-indigo hover:bg-brand-indigo/10'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('flashcard')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${filter === 'flashcard' ? 'bg-brand-indigo text-white' : 'bg-brand-indigo/5 text-brand-indigo hover:bg-brand-indigo/10'}`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Flashcards
            </button>
            <button
              onClick={() => setFilter('quiz')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${filter === 'quiz' ? 'bg-brand-indigo text-white' : 'bg-brand-indigo/5 text-brand-indigo hover:bg-brand-indigo/10'}`}
            >
              <ClipboardList className="h-3.5 w-3.5" /> Quizzes
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="group flex flex-col rounded-3xl border border-brand-indigo/10 bg-white p-6 shadow-sm transition-all hover:border-brand-lime/40 hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.type === 'flashcard' ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-lime/20 text-brand-lime font-bold'}`}>
                    {item.type === 'flashcard' ? <BookOpen className="h-5 w-5" /> : <ClipboardList className="h-5 w-5 text-brand-indigo" />}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleVisibility(item.id, item.visibility)}
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-colors ${item.visibility === 'public' ? 'bg-brand-success/10 text-brand-success hover:bg-brand-success/20' : 'bg-brand-indigo/5 text-brand-muted hover:bg-brand-indigo/10'}`}
                      title="Toggle Visibility"
                    >
                      {item.visibility === 'public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {item.visibility}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 rounded-lg text-brand-danger/50 hover:bg-brand-danger/10 hover:text-brand-danger transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-brand-indigo text-lg mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-brand-muted line-clamp-2 mb-4 flex-1">
                  {item.description || 'No description provided.'}
                </p>

                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-brand-indigo/5">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span>{item.count} {item.type === 'flashcard' ? 'cards' : 'questions'}</span>
                  </div>
                  <Link 
                    href={`/${item.type === 'flashcard' ? 'flashcards' : 'quizzes'}/${item.id}`}
                    className="w-full py-2.5 text-center rounded-xl bg-brand-indigo/5 text-brand-indigo font-bold text-xs hover:bg-brand-indigo hover:text-white transition-colors"
                  >
                    Open {item.type === 'flashcard' ? 'Deck' : 'Quiz'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
