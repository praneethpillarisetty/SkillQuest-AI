import { Quest, User } from '../types';

export function DashboardPage({ user, quests, onComplete }: { user: User; quests: Quest[]; onComplete: (id: number) => void }) {
  const xpInLevel = user.xp % 100;
  const progress = `${xpInLevel}%`;

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-slate-400">Level</p>
          <p className="text-3xl font-bold text-cyan-400">{user.level}</p>
        </div>
        <div className="card">
          <p className="text-slate-400">Total XP</p>
          <p className="text-3xl font-bold">{user.xp}</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: progress }} />
          </div>
        </div>
        <div className="card">
          <p className="text-slate-400">Daily Streak</p>
          <p className="text-3xl font-bold text-orange-400">🔥 {user.streak}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-xl font-bold">Today&apos;s Quests</h2>
        <div className="space-y-3">
          {quests.map((quest) => (
            <div key={quest.id} className="flex flex-col justify-between gap-2 rounded-xl border border-slate-700 p-3 md:flex-row md:items-center">
              <div>
                <p className="font-semibold">{quest.title}</p>
                <p className="text-sm text-slate-400">
                  {quest.category} • +{quest.xp_reward} XP
                </p>
              </div>
              <button
                disabled={quest.completed === 1}
                className={`btn ${
                  quest.completed === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                }`}
                onClick={() => onComplete(quest.id)}
              >
                {quest.completed === 1 ? 'Completed ✓' : 'Complete Quest'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
