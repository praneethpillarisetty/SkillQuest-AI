import { useState } from 'react';
import { api } from '../lib/api';

export function ATSPage() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<{ score: number; missingKeywords: string[]; improvedBullets: string[] } | null>(null);

  const analyze = async () => {
    const data = await api<{ score: number; missingKeywords: string[]; improvedBullets: string[] }>('/api/ai/ats', {
      method: 'POST',
      body: JSON.stringify({ resume, jobDescription })
    });
    setResult(data);
  };

  return (
    <section className="space-y-4">
      <div className="card space-y-3">
        <h2 className="text-2xl font-bold">ATS Resume Scanner</h2>
        <textarea className="input min-h-36" placeholder="Paste your resume text" value={resume} onChange={(e) => setResume(e.target.value)} />
        <textarea className="input min-h-36" placeholder="Paste job description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
        <button className="btn-primary" onClick={analyze}>Analyze Match</button>
      </div>

      {result && (
        <div className="card space-y-3">
          <p className="text-xl font-bold">ATS Score: <span className="text-cyan-400">{result.score}/100</span></p>
          <div>
            <h3 className="font-semibold">Missing Keywords</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.missingKeywords.map((kw) => <span key={kw} className="rounded-full bg-rose-500/20 px-3 py-1 text-sm">{kw}</span>)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Improved Resume Bullets</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-300">
              {result.improvedBullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
