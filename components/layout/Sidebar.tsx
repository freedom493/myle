"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  BookOpen,
  ClipboardList,
  Trophy,
  User,
  LogOut,
  X,
  Sparkles,
  Wand2,
  FolderOpen,
  Gift,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Flame },
  { href: "/flashcards", label: "Flashcards", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/create", label: "Create with AI", icon: Wand2 },
];

const secondaryLinks = [
  { href: "/library", label: "My Library", icon: FolderOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const accountLinks = [
  { href: "/tasks", label: "Rewards", icon: Gift, authOnly: true },
  { href: "/profile", label: "Profile", icon: User, authOnly: false },
];

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  onClose,
  hoveredPath,
  setHoveredPath,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  pathname: string | null;
  onClose?: () => void;
  hoveredPath: string | null;
  setHoveredPath: (p: string | null) => void;
}) {
  const isActive =
    pathname === href || (pathname?.startsWith(href + "/") ?? false);
  const isHovered = hoveredPath === href;

  return (
    <Link
      href={href}
      onClick={onClose}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 select-none ${
        isActive
          ? "text-brand-indigo bg-brand-indigo/[0.07] shadow-sm"
          : "text-brand-muted hover:text-brand-indigo"
      }`}
      onMouseEnter={() => setHoveredPath(href)}
      onMouseLeave={() => setHoveredPath(null)}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-brand-indigo" />
      )}
      <Icon
        className={`h-[18px] w-[18px] shrink-0 transition-transform ${
          isActive ? "scale-105 text-brand-indigo" : ""
        }`}
      />
      <span className="truncate">{label}</span>
      {isHovered && !isActive && (
        <motion.span
          layoutId="sidebar-hover-pill"
          className="absolute inset-0 bg-brand-indigo/[0.04] rounded-xl -z-10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </Link>
  );
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, signOut, loading } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const visibleAccount = accountLinks.filter(
    (l) => !l.authOnly || isAuthenticated,
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/80 dark:bg-brand-surface backdrop-blur-sm p-4 sm:p-5 text-brand-text">
      {/* Logo */}
      <div className="flex items-center justify-between mb-6 px-1">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2.5 text-xl font-black tracking-tight text-brand-indigo"
          onClick={onClose}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-indigo text-brand-lime shadow-md shadow-brand-indigo/15 text-sm font-black">
            M
          </span>
          <span className="font-heading">MYLE</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-xl border border-brand-indigo/10 hover:bg-brand-indigo/5 transition-all text-brand-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto space-y-5 scrollbar-thin">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-muted/70 mb-2 px-3">
            Study
          </p>
          <div className="space-y-0.5">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                pathname={pathname}
                onClose={onClose}
                hoveredPath={hoveredPath}
                setHoveredPath={setHoveredPath}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-muted/70 mb-2 px-3">
            Explore
          </p>
          <div className="space-y-0.5">
            {secondaryLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                pathname={pathname}
                onClose={onClose}
                hoveredPath={hoveredPath}
                setHoveredPath={setHoveredPath}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-muted/70 mb-2 px-3">
            Account
          </p>
          <div className="space-y-0.5">
            {visibleAccount.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                pathname={pathname}
                onClose={onClose}
                hoveredPath={hoveredPath}
                setHoveredPath={setHoveredPath}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Account card */}
      <div className="pt-4 mt-2 border-t border-brand-indigo/5">
        {!loading && (
          <div className="rounded-2xl bg-brand-surface p-3.5 border border-brand-indigo/[0.06]">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-indigo text-white font-bold text-xs">
                    {user?.email?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold truncate text-brand-indigo">
                      {user?.user_metadata?.display_name || "Student"}
                    </p>
                    <p className="text-[10px] text-brand-muted truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    onClose?.();
                  }}
                  className="p-2 rounded-xl text-brand-danger hover:bg-brand-danger/10 transition-colors shrink-0"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-brand-indigo">
                  <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
                  <span>Studying as Guest</span>
                </div>
                <p className="text-[10px] text-brand-muted leading-snug">
                  Sign up free to sync scores & climb the leaderboard.
                </p>
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="flex-1 text-center py-2 px-2 rounded-xl bg-brand-indigo text-white font-bold text-xs hover:opacity-90 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={onClose}
                    className="flex-1 text-center py-2 px-2 rounded-xl border border-brand-indigo/10 text-brand-indigo font-bold text-xs hover:bg-brand-indigo/5 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 w-64 lg:w-72 border-r border-brand-indigo/5 z-30 flex-col bg-white/60 backdrop-blur-md">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-[min(20rem,88vw)] border-r border-brand-indigo/5 z-50 shadow-2xl flex flex-col bg-white"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
