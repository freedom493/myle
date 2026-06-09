export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-lime">Profile</p>
        <h1 className="text-4xl font-semibold text-brand-indigo">Your profile</h1>
        <p className="text-base leading-8 text-brand-muted">
          When you sign in, your profile page will show your quiz streak, completed decks, and leaderboard status.
        </p>
      </div>
      <div className="mt-10 rounded-3xl border border-brand-indigo/10 bg-white p-8 shadow-sm">
        <p className="text-brand-muted">Sign in to view your account details and synced progress.</p>
      </div>
    </div>
  );
}
