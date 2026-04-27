import { useState } from 'react';
import { api } from '../lib/api';

const roles = ['Workday Analyst', 'Data Engineer', 'Business Analyst', 'AI Evaluator', 'Software Engineer'];

export function InterviewPage() {
  const [role, setRole] = useState(roles[0]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; improvedAnswer: string } | null>(null);

  const generate = async () => {
    const data = await api<{ question: string }>('/api/ai/interview-question', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    setQuestion(data.question);
  };

  const evaluate = async () => {
    const data = await api<{ score: number; feedback: string; improvedAnswer: string }>('/api/ai/interview-feedback', {
      method: 'POST',
      body: JSON.stringify({ role, question, answer })
    });
    setFeedback(data);
  };

  return (
    <section className="card space-y-4">
      <h2 className="text-2xl font-bold">Interview Practice</h2>
      <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
        {roles.map((r) => <option key={r}>{r}</option>)}
      </select>
      <button className="btn-primary" onClick={generate}>Generate Question</button>
      {question && <p className="rounded-xl border border-slate-700 bg-slate-800 p-3">{question}</p>}
      <textarea className="input min-h-32" placeholder="Write your answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button className="btn bg-violet-500 text-white hover:bg-violet-400" onClick={evaluate}>Get Feedback</button>
      {feedback && (
        <div className="space-y-2 rounded-xl border border-slate-700 p-3">
          <p className="font-semibold">Score: <span className="text-cyan-400">{feedback.score}/100</span></p>
          <p>{feedback.feedback}</p>
          <p className="text-slate-300"><strong>Improved answer:</strong> {feedback.improvedAnswer}</p>
        </div>
      )}
    </section>
  );
}
