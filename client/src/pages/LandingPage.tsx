export function LandingPage({ onStart }: { onStart: () => void }) {
  const features = ['AI Coach', 'ATS Scanner', 'Interview Practice', 'Job Tracker', 'Skill Tree'];
  return (
    <section className="space-y-8">
      <div className="card p-8 text-center">
        <p className="mb-2 text-cyan-400">Career RPG</p>
        <h1 className="text-4xl font-bold md:text-5xl">Turn your career growth into a daily game</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Train smarter with AI coaching, interview drills, ATS optimization, and quest-based progress tracking.
        </p>
        <button className="btn-primary mt-6" onClick={onStart}>
          Start Today&apos;s Quest
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {features.map((feature) => (
          <div key={feature} className="card text-center">
            <div className="text-2xl">✨</div>
            <h3 className="mt-2 font-semibold">{feature}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
