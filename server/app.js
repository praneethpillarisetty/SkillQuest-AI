const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const OpenAI = require('openai');

dotenv.config();

let db;
let app;
let initPromise;

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function levelFromXp(xp) {
  return Math.floor(xp / 100) + 1;
}

function resolveDbPath() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return '/tmp/skillquest.db';
  const dataDir = path.join(__dirname, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, 'skillquest.db');
}

async function initDb() {
  const filename = resolveDbPath();

  try {
    db = await open({ filename, driver: sqlite3.Database });
  } catch {
    db = await open({ filename: ':memory:', driver: sqlite3.Database });
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      streak INTEGER DEFAULT 0,
      last_quest_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT,
      xp_reward INTEGER,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT,
      role TEXT,
      status TEXT,
      recruiter TEXT,
      follow_up_date TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skill_nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT,
      title TEXT,
      description TEXT,
      unlocked INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0
    );
  `);

  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    await db.run('INSERT INTO users (name, email, xp, level, streak) VALUES (?, ?, ?, ?, ?)', ['Player One', 'player@skillquest.ai', 0, 1, 0]);
  }

  const questCount = await db.get('SELECT COUNT(*) as count FROM quests');
  if (questCount.count === 0) {
    const starterQuests = [
      ['Optimize one resume bullet', 'ATS', 25],
      ['Practice one interview answer', 'Interview', 30],
      ['Apply to one job', 'Applications', 40],
      ['Ask AI coach one career question', 'Coaching', 20]
    ];
    for (const [title, category, xp] of starterQuests) {
      await db.run('INSERT INTO quests (title, category, xp_reward) VALUES (?, ?, ?)', [title, category, xp]);
    }
  }

  const skillCount = await db.get('SELECT COUNT(*) as count FROM skill_nodes');
  if (skillCount.count === 0) {
    const paths = [
      ['Workday Integrations', 'Build your first Studio integration'],
      ['Workday Reporting', 'Create custom calculated fields'],
      ['SQL', 'Master joins and window functions'],
      ['Python', 'Automate ETL and reporting scripts'],
      ['Data Engineering', 'Design scalable pipelines'],
      ['AI Evaluation', 'Write robust model test cases'],
      ['Interview Communication', 'Use STAR storytelling effectively']
    ];
    for (const [pathName, description] of paths) {
      await db.run('INSERT INTO skill_nodes (path, title, description, unlocked, completed) VALUES (?, ?, ?, ?, ?)', [pathName, `${pathName} Node 1`, description, 1, 0]);
      await db.run('INSERT INTO skill_nodes (path, title, description, unlocked, completed) VALUES (?, ?, ?, ?, ?)', [pathName, `${pathName} Node 2`, `Advanced ${description.toLowerCase()}`, 0, 0]);
    }
  }
}

async function aiOrMock(systemPrompt, userPrompt, mock) {
  if (!openai) return mock;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });
  return completion.choices[0]?.message?.content || mock;
}

async function createApp() {
  if (app) return app;
  await initDb();

  app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_, res) => res.json({ ok: true }));
  app.get('/api/user', async (_, res) => res.json(await db.get('SELECT id, name, email, xp, level, streak FROM users LIMIT 1')));
  app.get('/api/quests', async (_, res) => res.json(await db.all('SELECT * FROM quests ORDER BY id')));

  app.post('/api/quests/:id/complete', async (req, res) => {
    const id = Number(req.params.id);
    const quest = await db.get('SELECT * FROM quests WHERE id = ?', [id]);
    if (!quest || quest.completed) return res.json({ ok: true });

    await db.run('UPDATE quests SET completed = 1 WHERE id = ?', [id]);

    const user = await db.get('SELECT * FROM users LIMIT 1');
    const today = new Date().toISOString().slice(0, 10);
    const wasToday = user.last_quest_date === today;
    const newXp = user.xp + quest.xp_reward;
    const newLevel = levelFromXp(newXp);
    const newStreak = wasToday ? user.streak : user.streak + 1;
    await db.run('UPDATE users SET xp = ?, level = ?, streak = ?, last_quest_date = ? WHERE id = ?', [newXp, newLevel, newStreak, today, user.id]);

    const completedCount = await db.get('SELECT COUNT(*) as count FROM quests WHERE completed = 1');
    const unlockThreshold = Math.floor(completedCount.count / 2) + 1;
    await db.run('UPDATE skill_nodes SET unlocked = 1 WHERE id IN (SELECT id FROM skill_nodes WHERE unlocked = 0 ORDER BY id LIMIT ?)', [unlockThreshold]);

    res.json({ ok: true });
  });

  app.get('/api/jobs', async (_, res) => res.json(await db.all('SELECT * FROM jobs ORDER BY created_at DESC')));
  app.post('/api/jobs', async (req, res) => {
    const { company, role, status, recruiter, follow_up_date, notes } = req.body;
    const result = await db.run(
      'INSERT INTO jobs (company, role, status, recruiter, follow_up_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [company, role, status, recruiter, follow_up_date, notes]
    );
    res.json({ id: result.lastID });
  });
  app.patch('/api/jobs/:id', async (req, res) => {
    await db.run('UPDATE jobs SET status = ? WHERE id = ?', [req.body.status, Number(req.params.id)]);
    res.json({ ok: true });
  });
  app.delete('/api/jobs/:id', async (req, res) => {
    await db.run('DELETE FROM jobs WHERE id = ?', [Number(req.params.id)]);
    res.json({ ok: true });
  });

  app.post('/api/ai/coach', async (req, res) => {
    const response = await aiOrMock(
      'You are SkillQuest AI Coach, concise and tactical.',
      req.body.question,
      'Mock coach: Focus on one target role, tailor your resume to 3 keywords, and practice one STAR story tonight.'
    );
    res.json({ response });
  });

  app.post('/api/ai/ats', async (req, res) => {
    const { resume = '', jobDescription = '' } = req.body;
    if (!openai) {
      const jdWords = [...new Set(jobDescription.toLowerCase().match(/[a-zA-Z]{4,}/g) || [])];
      const missingKeywords = jdWords.filter((w) => !resume.toLowerCase().includes(w)).slice(0, 8);
      const score = Math.max(35, 100 - missingKeywords.length * 7);
      return res.json({
        score,
        missingKeywords,
        improvedBullets: [
          'Built cross-functional dashboards that reduced reporting time by 35%.',
          'Automated data validation checks, improving data accuracy and trust.',
          'Partnered with business stakeholders to prioritize KPI-driven insights.'
        ]
      });
    }

    const text = await aiOrMock(
      'Return strict JSON: {"score":number,"missingKeywords":string[],"improvedBullets":string[]}.',
      `Resume:\n${resume}\n\nJob Description:\n${jobDescription}`,
      '{"score":78,"missingKeywords":["workday","integration","sql"],"improvedBullets":["Bullet one","Bullet two","Bullet three"]}'
    );

    try {
      return res.json(JSON.parse(text));
    } catch {
      return res.json({ score: 75, missingKeywords: ['communication', 'sql'], improvedBullets: ['Quantified impact in every bullet.'] });
    }
  });

  app.post('/api/ai/interview-question', async (req, res) => {
    const { role } = req.body;
    const question = await aiOrMock(
      'Generate one interview question only.',
      `Role: ${role}`,
      `Mock question: For a ${role}, describe a project where you solved a complex stakeholder problem.`
    );
    res.json({ question });
  });

  app.post('/api/ai/interview-feedback', async (req, res) => {
    const { role, question, answer } = req.body;
    if (!openai) {
      return res.json({
        score: 82,
        feedback: 'Great structure. Add metrics and tighten your STAR flow.',
        improvedAnswer: `In my previous ${role} project, I aligned with stakeholders, automated a manual process, and improved turnaround by 30%.`
      });
    }

    const text = await aiOrMock(
      'Return strict JSON: {"score":number,"feedback":string,"improvedAnswer":string}.',
      `Role:${role}\nQuestion:${question}\nAnswer:${answer}`,
      '{"score":80,"feedback":"Solid response.","improvedAnswer":"Improved sample"}'
    );

    try {
      res.json(JSON.parse(text));
    } catch {
      res.json({ score: 80, feedback: 'Solid answer with room to quantify impact.', improvedAnswer: answer });
    }
  });

  app.get('/api/skills', async (_, res) => res.json(await db.all('SELECT * FROM skill_nodes ORDER BY path, id')));
  app.post('/api/skills/:id/complete', async (req, res) => {
    const id = Number(req.params.id);
    await db.run('UPDATE skill_nodes SET completed = 1 WHERE id = ?', [id]);
    await db.run('UPDATE skill_nodes SET unlocked = 1 WHERE id = (SELECT id FROM skill_nodes WHERE unlocked = 0 ORDER BY id LIMIT 1)');
    res.json({ ok: true });
  });

  const staticDir = path.join(__dirname, '..', 'dist', 'client');
  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  return app;
}

async function getApp() {
  if (!initPromise) {
    initPromise = createApp();
  }
  return initPromise;
}

module.exports = { getApp };
