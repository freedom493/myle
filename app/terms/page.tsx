export default function TermsPage() {
  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.28em] text-brand-lime font-bold">
            Terms of service
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-brand-indigo font-heading tracking-tight">
            Terms of use
          </h1>
          <p className="text-sm sm:text-base leading-relaxed sm:leading-8 text-brand-muted max-w-2xl">
            MYLE provides free study tools for Nigerian university students. By
            using the service, you agree to use the platform responsibly and keep
            your account secure.
          </p>
        </div>

        <section className="space-y-6 sm:space-y-8 rounded-2xl sm:rounded-3xl border border-brand-indigo/10 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-indigo font-heading">
              Acceptable use
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
              Do not attempt to manipulate leaderboard results, use bots, or share
              content in violation of academic integrity.
            </p>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-indigo font-heading">
              Availability
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
              MYLE is offered as-is and may change over time. We do not guarantee
              uptime, but we aim to keep the study tools available for learners.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
