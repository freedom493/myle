"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { showBottomNav, showFooter, showMobileHeader } from "@/lib/routes";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Client shell that switches chrome by route:
 * - Homepage / terms / privacy: marketing footer only
 * - All other pages: mobile header + bottom nav (shared)
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const footer = showFooter(pathname);
  const bottomNav = showBottomNav(pathname);
  const mobileHeader = showMobileHeader(pathname);

  return (
    <div className="flex flex-1 flex-col md:pl-64 lg:pl-72 min-w-0 min-h-screen">
      {mobileHeader && <MobileHeader />}

      <main
        className={`flex-1 relative z-10 w-full min-w-0 ${
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
