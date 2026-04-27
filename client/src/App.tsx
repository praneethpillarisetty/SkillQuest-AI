import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { api } from './lib/api';
import { AICoachPage } from './pages/AICoachPage';
import { ATSPage } from './pages/ATSPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewPage } from './pages/InterviewPage';
import { JobTrackerPage } from './pages/JobTrackerPage';
import { LandingPage } from './pages/LandingPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { Job, Quest, SkillNode, User } from './types';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [nodes, setNodes] = useState<SkillNode[]>([]);

  const load = async () => {
    const [u, q, j, s] = await Promise.all([
      api<User>('/api/user'),
      api<Quest[]>('/api/quests'),
      api<Job[]>('/api/jobs'),
      api<SkillNode[]>('/api/skills')
    ]);
    setUser(u);
    setQuests(q);
    setJobs(j);
    setNodes(s);
  };

  useEffect(() => {
    load();
  }, []);

  const completeQuest = async (id: number) => {
    await api(`/api/quests/${id}/complete`, { method: 'POST' });
    await load();
  };

  const addJob = async (job: Omit<Job, 'id'>) => {
    await api('/api/jobs', { method: 'POST', body: JSON.stringify(job) });
    await load();
  };

  const updateJob = async (id: number, status: string) => {
    await api(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    await load();
  };

  const deleteJob = async (id: number) => {
    await api(`/api/jobs/${id}`, { method: 'DELETE' });
    await load();
  };

  const completeSkill = async (id: number) => {
    await api(`/api/skills/${id}/complete`, { method: 'POST' });
    await load();
  };

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === 'landing' && <LandingPage onStart={() => setPage('dashboard')} />}
      {user && page === 'dashboard' && <DashboardPage user={user} quests={quests} onComplete={completeQuest} />}
      {page === 'coach' && <AICoachPage />}
      {page === 'ats' && <ATSPage />}
      {page === 'interview' && <InterviewPage />}
      {page === 'jobs' && <JobTrackerPage jobs={jobs} onAdd={addJob} onUpdate={updateJob} onDelete={deleteJob} />}
      {page === 'skills' && <SkillTreePage nodes={nodes} onComplete={completeSkill} />}
    </Layout>
  );
}
