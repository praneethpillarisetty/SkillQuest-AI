import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

type Message = { role: 'user' | 'assistant'; text: string };

export function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    const data = await api<{ response: string }>('/api/ai/coach', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
    setMessages((prev) => [...prev, { role: 'assistant', text: data.response }]);
  };

  return (
    <section className="card space-y-4">
      <h2 className="text-2xl font-bold">AI Career Coach</h2>
      <div className="max-h-[400px] space-y-2 overflow-auto rounded-xl border border-slate-700 p-3">
        {messages.length === 0 && <p className="text-slate-400">Ask anything about your job prep journey.</p>}
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl p-3 ${m.role === 'user' ? 'bg-cyan-600/30' : 'bg-slate-800'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={send}>
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="How do I prepare for Workday analyst interviews?" />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </section>
  );
}
