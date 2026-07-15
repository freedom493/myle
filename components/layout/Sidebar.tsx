'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Gift
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Flame },
  { href: "/flashcards", label: "Flashcards", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/create", label: "Create with AI", icon: Wand2 },
  { href: "/library", label: "My Library", icon: FolderOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, signOut, loading } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const activeLinks = isAuthenticated 
    ? [...navLinks, { href: "/tasks", label: "Rewards", icon: Gift }, { href: "/profile", label: "Profile", icon: User }] 
    : navLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-brand-surface dark:bg-brand-surface p-6 text-brand-text dark:text-brand-text">
      {/* Header / Logo */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="group flex items-center gap-2.5 text-2xl font-black tracking-tight text-brand-indigo dark:text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-indigo dark:bg-brand-lime text-brand-lime dark:text-brand-indigo shadow-md shadow-brand-indigo/15">
            M
          </span>
          <span className="font-heading">MYLE</span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-xl border border-brand-indigo/10 dark:border-white/10 hover:bg-brand-indigo/5 dark:hover:bg-white/5 transition-all text-brand-muted dark:text-slate-400"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-muted dark:text-slate-500 mb-3 px-3">
          Study Portal
        </div>
        {activeLinks.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          const LinkIcon = link.icon;
          const isHovered = hoveredPath === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 select-none ${
                isActive 
                  ? 'text-brand-indigo dark:text-brand-indigo bg-brand-indigo/5 dark:bg-brand-lime/20 shadow-sm border-l-4 border-brand-indigo dark:border-brand-lime' 
                  : 'text-brand-muted dark:text-slate-400 hover:text-brand-indigo dark:hover:text-white'
              }`}
              onMouseEnter={() => setHoveredPath(link.href)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <LinkIcon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span>{link.label}</span>
              {isHovered && !isActive && (
                <motion.span
                  layoutId="sidebar-hover-pill"
                  className="absolute inset-0 bg-brand-indigo/[0.03] dark:bg-white/[0.03] rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div className="pt-6 border-t border-brand-indigo/5 dark:border-white/10 space-y-5">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-bold text-brand-muted dark:text-slate-400">Theme</span>
          <span className="text-xs font-semibold text-brand-indigo dark:text-brand-lime">Light</span>
        </div>

        {/* User Card */}
        {!loading && (
          <div className="rounded-2xl bg-brand-indigo/5 dark:bg-brand-elevated/5 p-4 border border-brand-indigo/[0.02] dark:border-white/[0.02]">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo dark:bg-brand-lime text-white dark:text-brand-indigo font-bold text-sm">
                    {user?.email?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold truncate text-brand-indigo dark:text-brand-indigo">
                      {user?.user_metadata?.display_name || "Student"}
                    </p>
                    <p className="text-[10px] text-brand-muted dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    if (onClose) onClose();
                  }}
                  className="p-2 rounded-xl text-brand-danger hover:bg-brand-danger/10 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-brand-indigo dark:text-brand-indigo">
                  <Sparkles className="h-4 w-4 text-brand-lime animate-pulse" />
                  <span>Guest Account</span>
                </div>
                <p className="text-[10px] text-brand-muted dark:text-slate-400 leading-normal">
                  Create an account to save scores to the cloud.
                </p>
                <div className="flex gap-2.5">
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="flex-grow text-center py-2 px-3 rounded-xl bg-brand-indigo dark:bg-brand-lime text-white dark:text-brand-indigo font-bold text-xs hover:opacity-90 transition-all shadow-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={onClose}
                    className="flex-grow text-center py-2 px-3 rounded-xl border border-brand-indigo/10 dark:border-white/10 text-brand-indigo dark:text-white font-bold text-xs hover:bg-brand-indigo/5 dark:hover:bg-white/5 transition-all"
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
      {/* Desktop Sidebar - Left Panel */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 w-64 md:w-72 border-r border-brand-indigo/5 dark:border-white/10 z-30 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />
            {/* Slide-out drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] border-r border-brand-indigo/5 dark:border-white/10 z-50 shadow-2xl flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
