"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { showBottomNav, showFooter } from "@/lib/routes";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Client shell that switches chrome by route:
 * - Marketing pages: full footer, no bottom nav
 * - App/study pages: no footer, mobile bottom nav
 * - Immersive study sessions: no footer, no bottom nav
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const footer = showFooter(pathname);
  const bottomNav = showBottomNav(pathname);

  return (
    <div className="flex flex-1 flex-col md:pl-64 lg:pl-72 min-w-0 min-h-screen">
      <MobileHeader />

      <main
        className={`flex-1 relative z-10 w-full ${
          bottomNav ? "pb-2 md:pb-0" : ""
        }`}
      >
        {children}
      </main>

      {footer && <Footer />}

      {/* Spacer so content clears fixed mobile bottom nav */}
      {bottomNav && (
        <div className="md:hidden h-[4.5rem] shrink-0 safe-bottom" aria-hidden />
      )}

      {bottomNav && <BottomNav />}
    </div>
  );
}
