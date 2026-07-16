"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Flame } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { getStreak } from "@/lib/localStorage";
import { useEffect } from "react";
import { isImmersiveStudyPath } from "@/lib/routes";

export function MobileHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const pathname = usePathname();
  const immersive = isImmersiveStudyPath(pathname);

  useEffect(() => {
    try {
      setStreak(getStreak());
    } catch {
      setStreak(0);
    }
  }, [pathname]);

  // Compact bar during active study so the player gets more room
  if (immersive) {
    return (
      <>
        <header className="md:hidden sticky top-0 z-40 flex h-12 w-full items-center justify-between border-b border-brand-indigo/5 bg-white/90 backdrop-blur-md px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-bold text-brand-indigo"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-indigo text-brand-lime text-xs font-black">
              M
            </span>
            <span className="font-heading">MYLE</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border border-brand-indigo/10 p-1.5 text-brand-indigo hover:bg-brand-indigo/5 transition-all"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </header>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-brand-indigo/5 bg-white/90 backdrop-blur-md px-4 safe-top">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 text-base font-bold tracking-tight text-brand-indigo"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo text-brand-lime shadow-sm shadow-brand-indigo/15 font-black">
            M
          </span>
          <span className="font-heading">MYLE</span>
        </Link>

        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime/15 px-2.5 py-1 text-[11px] font-bold text-brand-indigo">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {streak}
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border border-brand-indigo/10 p-2 text-brand-indigo hover:bg-brand-indigo/5 active:scale-95 transition-all"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
