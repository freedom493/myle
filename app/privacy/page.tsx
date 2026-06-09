export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-lime">Privacy policy</p>
        <h1 className="text-4xl font-semibold text-brand-indigo">Privacy policy</h1>
        <p className="text-base leading-8 text-brand-muted">
          MYLE keeps your experience simple: anonymous study is stored in your browser, and only signed-in scores are saved with your permission.
        </p>
      </div>
      <section className="mt-10 space-y-8 rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-brand-indigo">What we collect</h2>
          <p className="mt-3 text-brand-muted">
            No data is stored outside your browser when you use the app as a guest. If you create an account, we store your email, display name, and quiz performance to support leaderboards.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-brand-indigo">Local storage</h2>
          <p className="mt-3 text-brand-muted">
            Study streaks and local scores are saved only in localStorage. This data stays on your device unless you sign up and choose to share quiz results.
          </p>
        </div>
      </section>
    </div>
  );
}
