export type User = {
  id: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
};

export type Quest = {
  id: number;
  title: string;
  category: string;
  xp_reward: number;
  completed: number;
};

export type Job = {
  id: number;
  company: string;
  role: string;
  status: string;
  recruiter: string;
  follow_up_date: string;
  notes: string;
};

export type SkillNode = {
  id: number;
  path: string;
  title: string;
  description: string;
  unlocked: number;
  completed: number;
};
