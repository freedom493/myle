'use client';

import { WifiOff, RotateCw, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-brand-lime/20 blur-md" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-indigo/10 dark:bg-white/5 text-brand-indigo dark:text-brand-lime">
          <WifiOff className="h-10 w-10" />
        </div>
      </div>
      
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-brand-indigo dark:text-white sm:text-4xl">
        You're Offline
      </h1>
      
      <p className="mt-4 max-w-md text-base leading-relaxed text-brand-muted dark:text-slate-400">
        It looks like you've lost your connection. MYLE has offline support, so some of your previously visited pages, quizzes, and decks might still be available!
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RotateCw className="h-4 w-4" />
          Try Reconnecting
        </Button>
        <Button href="/dashboard" variant="secondary" className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
