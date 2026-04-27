import { SkillNode } from '../types';

export function SkillTreePage({ nodes, onComplete }: { nodes: SkillNode[]; onComplete: (id: number) => void }) {
  const grouped = nodes.reduce<Record<string, SkillNode[]>>((acc, node) => {
    acc[node.path] ??= [];
    acc[node.path].push(node);
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Skill Tree</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(grouped).map(([path, list]) => (
          <div key={path} className="card">
            <h3 className="mb-3 text-lg font-semibold text-cyan-400">{path}</h3>
            <div className="space-y-2">
              {list.map((n) => (
                <div key={n.id} className={`rounded-xl border p-3 ${n.unlocked ? 'border-cyan-700' : 'border-slate-700 opacity-50'}`}>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-slate-400">{n.description}</p>
                  {n.unlocked === 1 && (
                    <button
                      className={`btn mt-2 ${n.completed ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}
                      onClick={() => onComplete(n.id)}
                      disabled={n.completed === 1}
                    >
                      {n.completed ? 'Completed' : 'Complete Node'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
