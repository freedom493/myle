"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  BookOpen,
  ClipboardList,
  Wand2,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Flame },
  { href: "/flashcards", label: "Cards", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/create", label: "Create", icon: Wand2 },
  { href: "/profile", label: "Profile", icon: User, authHref: "/auth/login?next=/profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-brand-indigo/8 bg-white/90 backdrop-blur-xl safe-bottom"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const href =
            "authHref" in tab && tab.authHref && !isAuthenticated
              ? tab.authHref
              : tab.href;
          const active =
            pathname === tab.href ||
            (pathname?.startsWith(tab.href + "/") ?? false);
          const Icon = tab.icon;

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-bold transition-colors ${
                  active
                    ? "text-brand-indigo"
                    : "text-brand-muted hover:text-brand-indigo/80"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    active
                      ? "bg-brand-indigo text-brand-lime shadow-sm shadow-brand-indigo/20"
                      : "bg-transparent"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span className={active ? "text-brand-indigo" : ""}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
