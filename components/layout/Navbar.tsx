import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-indigo/5 bg-brand-surface/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="group flex items-center gap-2 text-xl font-bold tracking-tight text-brand-indigo">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo text-brand-lime shadow-md shadow-brand-indigo/10 transition-transform group-hover:scale-105">
            M
          </span>
          <span className="font-heading transition-colors group-hover:text-brand-indigo/80">MYLE</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-semibold text-brand-muted">
          <Link href="/dashboard" className="relative py-1 transition-colors hover:text-brand-indigo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-indigo after:transition-all hover:after:w-full">
            Dashboard
          </Link>
          <Link href="/flashcards" className="relative py-1 transition-colors hover:text-brand-indigo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-indigo after:transition-all hover:after:w-full">
            Flashcards
          </Link>
          <Link href="/quizzes" className="relative py-1 transition-colors hover:text-brand-indigo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-indigo after:transition-all hover:after:w-full">
            Quizzes
          </Link>
          <Link href="/leaderboard" className="relative py-1 transition-colors hover:text-brand-indigo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-indigo after:transition-all hover:after:w-full">
            Leaderboard
          </Link>
          <Link href="/auth/login" className="rounded-full border border-brand-indigo/10 bg-brand-indigo/5 px-5 py-2 text-brand-indigo transition-all hover:bg-brand-indigo hover:text-white hover:shadow-md hover:shadow-brand-indigo/10">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
