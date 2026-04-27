import { FormEvent, useState } from 'react';
import { Job } from '../types';

const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Follow-up Needed'];

export function JobTrackerPage({ jobs, onAdd, onUpdate, onDelete }: {
  jobs: Job[];
  onAdd: (job: Omit<Job, 'id'>) => Promise<void>;
  onUpdate: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [form, setForm] = useState<Omit<Job, 'id'>>({
    company: '',
    role: '',
    status: statuses[0],
    recruiter: '',
    follow_up_date: '',
    notes: ''
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await onAdd(form);
    setForm({ company: '', role: '', status: statuses[0], recruiter: '', follow_up_date: '', notes: '' });
  };

  return (
    <section className="space-y-4">
      <form className="card grid gap-2 md:grid-cols-2" onSubmit={submit}>
        <h2 className="md:col-span-2 text-2xl font-bold">Job Tracker</h2>
        <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        <input className="input" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <input className="input" placeholder="Recruiter" value={form.recruiter} onChange={(e) => setForm({ ...form, recruiter: e.target.value })} />
        <input className="input" type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} />
        <input className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary md:col-span-2" type="submit">Add Application</button>
      </form>

      <div className="grid gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="card flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{job.company} — {job.role}</p>
              <p className="text-sm text-slate-400">Recruiter: {job.recruiter || 'N/A'} • Follow-up: {job.follow_up_date || 'N/A'}</p>
              <p className="text-sm text-slate-300">{job.notes}</p>
            </div>
            <div className="flex gap-2">
              <select className="input" value={job.status} onChange={(e) => onUpdate(job.id, e.target.value)}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="btn bg-rose-500 text-white" onClick={() => onDelete(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
