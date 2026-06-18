'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  const toggleMenu = () => setOpen(prev => !prev);

  const menuVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.05, 
        duration: 0.2, 
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -15, 
      transition: { duration: 0.15, ease: "easeIn" } 
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const activeLinks = isAuthenticated 
    ? [...navLinks, { href: "/profile", label: "Profile" }] 
    : navLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-indigo/5 md:bg-brand-surface/80 bg-brand-surface backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="group flex items-center gap-2 text-xl font-bold tracking-tight text-brand-indigo">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo text-brand-lime shadow-md shadow-brand-indigo/10"
          >
            M
          </motion.span>
          <span className="font-heading transition-colors group-hover:text-brand-indigo/80">MYLE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-2 md:text-sm md:font-semibold md:text-brand-muted">
          {activeLinks.map((link) => {
            const isHovered = hoveredPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 transition-colors hover:text-brand-indigo"
                onMouseEnter={() => setHoveredPath(link.href)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <span className="relative z-10">{link.label}</span>
                {isHovered && (
                  <motion.span
                    layoutId="desktop-nav-hover"
                    className="absolute inset-0 rounded-full bg-brand-indigo/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          {!loading && (
            isAuthenticated ? (
              <Link href="/profile" className="ml-4 rounded-full border border-brand-indigo bg-brand-indigo px-5 py-2 text-white transition-all hover:bg-brand-indigo/90 hover:shadow-md hover:shadow-brand-indigo/10">
                Profile
              </Link>
            ) : (
              <Link href="/auth/login" className="ml-4 rounded-full border border-brand-indigo/10 bg-brand-indigo/5 px-5 py-2 text-brand-indigo transition-all hover:bg-brand-indigo hover:text-white hover:shadow-md hover:shadow-brand-indigo/10">
                Log in
              </Link>
            )
          )}
        </nav>

        {/* Mobile menu toggle button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex md:hidden rounded-md border-2 border-brand-indigo p-1 text-brand-indigo"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile Navigation – Animated */}
      <AnimatePresence>
        {open && (
          <motion.nav 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 w-full overflow-x-auto z-50 border-b border-brand-indigo/5 bg-brand-surface backdrop-blur-md flex flex-col gap-5 px-6 py-8 md:hidden"
          >
            {activeLinks.map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link 
                  href={link.href} 
                  onClick={() => setOpen(false)}
                  className="block py-1 mt-3 text-base font-semibold text-4xl text-brand-muted hover:text-brand-indigo transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            
            {!loading && (
              <motion.div variants={itemVariants} className="flex justify-between pt-5 mt-50 border-t gap-5 border-brand-indigo/10">
                {isAuthenticated ? (
                  <Link href="/profile" onClick={() => setOpen(false)} className="rounded-full border border-brand-indigo bg-brand-indigo px-5 py-2 text-center font-semibold text-white transition-all hover:bg-brand-indigo/90 w-full">
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-full border border-brand-indigo/10 bg-brand-indigo/5 px-5 py-2 text-center font-semibold text-brand-indigo transition-all hover:bg-brand-indigo hover:text-white w-50">
                      Log in
                    </Link>
                    <Link href="/auth/signup" onClick={() => setOpen(false)} className="rounded-full border border-brand-indigo/10 px-5 py-2 text-center font-semibold text-[brand-text] transition-all bg-brand-indigo hover:bg-brand-indigo/30 hover:text-white w-50">
                      Sign up
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
