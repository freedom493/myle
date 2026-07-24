"use client";

import Link from "next/link";

export default function SitemapPage() {
  const categories = [
    {
      name: "Authentication",
      links: [
        { href: "/auth/login", label: "Login" },
        { href: "/auth/signup", label: "Sign Up" },
      ],
    },
    {
      name: "Main Features",
      links: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/flashcards", label: "Flashcards" },
        { href: "/quizzes", label: "Quizzes" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/create", label: "Create with AI" },
        { href: "/library", label: "My Library" },
      ],
    },
    {
      name: "User",
      links: [
        { href: "/profile", label: "Profile" },
        { href: "/tasks", label: "Rewards" },
      ],
    },
    {
      name: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
  ];

  return (
    <div className="page-shell page-section">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo font-heading tracking-tight">
            Sitemap
          </h1>
          <p className="text-sm sm:text-base text-brand-muted">
            Navigate to any section of MYLE using the links below.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.name}
              className="glass-panel rounded-2xl sm:rounded-[24px] p-5 sm:p-6 border border-brand-text/10"
            >
              <h2 className="text-base sm:text-lg font-semibold text-brand-indigo font-heading mb-3 sm:mb-4">
                {category.name}
              </h2>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-indigo hover:text-brand-lime transition-colors duration-200 underline underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-brand-indigo/8 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-brand-indigo font-heading mb-2">
            Dynamic Pages
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            This sitemap includes main pages. Specific decks and quizzes are
            accessible from their respective sections once you explore Flashcards
            and Quizzes.
          </p>
        </div>
      </div>
    </div>
  );
}
