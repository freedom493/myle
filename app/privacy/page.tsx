export default function PrivacyPage() {
  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.28em] text-brand-lime font-bold">
            Privacy policy
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-brand-indigo font-heading tracking-tight">
            Privacy policy
          </h1>
          <p className="text-sm sm:text-base leading-relaxed sm:leading-8 text-brand-muted max-w-2xl">
            MYLE keeps your experience simple: anonymous study is stored in your
            browser, and only signed-in scores are saved with your permission.
          </p>
        </div>

        <section className="space-y-6 sm:space-y-8 rounded-2xl sm:rounded-3xl border border-brand-indigo/10 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-indigo font-heading">
              What we collect
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
              No data is stored outside your browser when you use the app as a
              guest. If you create an account, we store your email, display name,
              and quiz performance to support leaderboards.
            </p>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-indigo font-heading">
              Local storage
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
              Study streaks and local scores are saved only in localStorage. This
              data stays on your device unless you sign up and choose to share
              quiz results.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
