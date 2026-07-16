import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-brand-indigo/5 bg-white/60 backdrop-blur-sm py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand-indigo"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo text-brand-lime shadow-sm text-sm font-black">
                M
              </span>
              <span className="font-heading">MYLE</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-brand-muted">
              Guest-first study tools for Nigerian campus life — flashcards,
              quizzes, and leaderboards.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-indigo">
              Study
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/flashcards"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Flashcards
                </Link>
              </li>
              <li>
                <Link
                  href="/quizzes"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-indigo">
              Account
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/auth/signup"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-brand-muted transition hover:text-brand-indigo"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-brand-indigo/5 pt-6 text-center md:flex md:items-center md:justify-between md:text-left">
          <p className="text-xs text-brand-muted/80">
            &copy; {new Date().getFullYear()} MYLE. Built for Nigerian university
            students.
          </p>
          <p className="mt-3 text-xs text-brand-muted/60 md:mt-0">
            Independent study tool — not affiliated with any university.
          </p>
        </div>
      </div>
    </footer>
  );
}
