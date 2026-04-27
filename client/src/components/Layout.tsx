import { ReactNode } from 'react';

const links = [
  ['landing', 'Home'],
  ['dashboard', 'Dashboard'],
  ['coach', 'AI Coach'],
  ['ats', 'ATS Scanner'],
  ['interview', 'Interview'],
  ['jobs', 'Jobs'],
  ['skills', 'Skill Tree']
] as const;

type Props = {
  page: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
};

export function Layout({ page, onNavigate, children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 p-4">
          <div className="mr-4 text-xl font-bold text-cyan-400">SkillQuest AI</div>
          {links.map(([key, label]) => (
            <button
              key={key}
              className={`btn ${
                page === key ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
    </div>
  );
}
