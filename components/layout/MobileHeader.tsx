'use client';

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-brand-indigo/5 dark:border-white/10 bg-brand-surface/85 dark:bg-[#0c0b14]/85 backdrop-blur-md px-6 text-brand-text dark:text-white">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 text-lg font-bold tracking-tight text-brand-indigo dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo dark:bg-brand-lime text-brand-lime dark:text-brand-indigo shadow-md shadow-brand-indigo/10">
            M
          </span>
          <span className="font-heading">MYLE</span>
        </Link>

        {/* Hamburger Menu Toggle */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-xl border border-brand-indigo/10 dark:border-white/10 p-2 text-brand-indigo dark:text-white hover:bg-brand-indigo/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Render sidebar drawer in mobile mode */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
