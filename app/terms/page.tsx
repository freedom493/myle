export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-lime">Terms of service</p>
        <h1 className="text-4xl font-semibold text-brand-indigo">Terms of use</h1>
        <p className="text-base leading-8 text-brand-muted">
          MYLE provides free study tools for Nigerian university students. By using the service, you agree to use the platform responsibly and keep your account secure.
        </p>
      </div>
      <section className="mt-10 space-y-8 rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-brand-indigo">Acceptable use</h2>
          <p className="mt-3 text-brand-muted">
            Do not attempt to manipulate leaderboard results, use bots, or share content in violation of academic integrity.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-brand-indigo">Availability</h2>
          <p className="mt-3 text-brand-muted">
            MYLE is offered as-is and may change over time. We do not guarantee uptime, but we aim to keep the study tools available for learners.
          </p>
        </div>
      </section>
    </div>
  );
}
