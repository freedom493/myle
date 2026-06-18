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
      ],
    },
    {
      name: "User",
      links: [
        { href: "/profile", label: "Profile" },
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
    <div className="min-h-screen bg-brand-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-text mb-4">Sitemap</h1>
        <p className="text-brand-text/70 mb-12">
          Navigate to any section of MYLE using the links below.
        </p>

        <div className="grid gap-8">
          {categories.map((category) => (
            <div key={category.name} className="glass-panel rounded-[24px] p-6 border border-brand-text/10">
              <h2 className="text-xl font-semibold text-brand-text mb-4">
                {category.name}
              </h2>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-indigo hover:text-brand-lime transition-colors duration-200 underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-brand-surface-secondary rounded-lg border border-brand-text/10">
          <h3 className="text-lg font-semibold text-brand-text mb-2">
            Dynamic Pages
          </h3>
          <p className="text-brand-text/70">
            This sitemap includes main pages. Specific decks and quizzes are accessible from their respective sections once you explore the Flashcards and Quizzes pages.
          </p>
        </div>
      </div>
    </div>
  );
}
