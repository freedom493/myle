import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-brand-indigo/5 bg-brand-surface py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-brand-indigo">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo text-brand-lime shadow-md shadow-brand-indigo/10">
                M
              </span>
              <span className="font-heading">MYLE</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-brand-muted">
              Fast, guest-first study tools designed specifically for Nigerian campus routines. Practice quizzes, review flashcard decks, and climb the leaderboards.
            </p>
            {/*<p className="text-xs text-brand-muted/70">
              Loved by students at UNN, UNILAG, ABU, UI, OAU, UNIBEN, LASU, and more.
            </p>*/}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-indigo">Study Tools</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="text-brand-muted transition hover:text-brand-indigo">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="text-brand-muted transition hover:text-brand-indigo">
                  Flashcard Decks
                </Link>
              </li>
              <li>
                <Link href="/quizzes" className="text-brand-muted transition hover:text-brand-indigo">
                  Practice Quizzes
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-brand-muted transition hover:text-brand-indigo">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-indigo">Account & Help</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/auth/signup" className="text-brand-muted transition hover:text-brand-indigo">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-brand-muted transition hover:text-brand-indigo">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-brand-muted transition hover:text-brand-indigo">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-muted transition hover:text-brand-indigo">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-indigo/5 pt-8 text-center md:flex md:items-center md:justify-between md:text-left">
          <p className="text-xs text-brand-muted/80">
            &copy; {new Date().getFullYear()} MYLE. All rights reserved. Created for Nigerian university students.
          </p>
          <p className="mt-4 text-xs text-brand-muted/60 md:mt-0">
            Disclaimer: MYLE is an independent study assistant and is not officially affiliated with any university.
          </p>
        </div>
      </div>
    </footer>
  );
}
