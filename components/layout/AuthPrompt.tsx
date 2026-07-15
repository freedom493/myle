'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPrompt() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Don't show if authenticated, still loading auth state, or already dismissed
    if (loading || isAuthenticated) return;
    if (sessionStorage.getItem('myle_auth_prompt_dismissed') === 'true') return;

    // Show after 30 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading]);

  const handleDismiss = () => {
    sessionStorage.setItem('myle_auth_prompt_dismissed', 'true');
    setIsOpen(false);
  };

  const handleLogin = () => {
    sessionStorage.setItem('myle_auth_prompt_dismissed', 'true');
    router.push('/auth/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-96 z-50 overflow-hidden rounded-2xl bg-white shadow-2xl border border-brand-indigo/10 p-1"
        >
          <div className="relative rounded-xl bg-brand-surface p-5 h-full w-full">
            <button 
              onClick={handleDismiss}
              className="absolute right-3 top-3 rounded-full p-1.5 text-brand-muted hover:text-brand-indigo hover:bg-brand-indigo/5 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-lime/20 text-brand-lime shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-indigo font-heading mb-1">Create with AI</h3>
                <p className="text-xs text-brand-muted leading-relaxed mb-4">
                  Log in to generate infinite flashcards and quizzes from your own notes using AI!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogin}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-indigo px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-indigo/90"
                  >
                    <LogIn className="h-3 w-3" />
                    Sign In
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="flex-1 rounded-lg border border-brand-indigo/10 px-3 py-2 text-xs font-bold text-brand-indigo transition hover:bg-brand-indigo/5"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
