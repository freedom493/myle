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
    <div className="page-shell flex min-h-[60vh] sm:min-h-[70vh] flex-col items-center justify-center py-10 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-brand-lime/20 blur-md" />
        <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-brand-indigo/10 dark:bg-white/5 text-brand-indigo dark:text-brand-lime">
          <WifiOff className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
      </div>
      
      <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-brand-indigo dark:text-white">
        You&apos;re Offline
      </h1>
      
      <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed text-brand-muted dark:text-slate-400">
        It looks like you&apos;ve lost your connection. MYLE has offline support, so some of your previously visited pages, quizzes, and decks might still be available!
      </p>

      <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto max-w-sm sm:max-w-none">
        <Button onClick={handleRetry} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <RotateCw className="h-4 w-4" />
          Try Reconnecting
        </Button>
        <Button href="/dashboard" variant="secondary" className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <LayoutGrid className="h-4 w-4" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
