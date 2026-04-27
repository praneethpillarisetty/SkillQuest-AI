# SkillQuest AI

SkillQuest AI is a gamified career-growth MVP for job seekers and professionals. It combines daily quests, AI coaching, ATS resume analysis, interview practice, job tracking, and a skill tree in one fast, modern web app.

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite
- **AI:** OpenAI API (with full mock fallback when API key is missing)

## Features

- Landing page with CTA and product feature cards
- Dashboard with XP, levels, streaks, and daily quest completion
- AI Coach chat page (`/api/ai/coach`)
- ATS Resume Scanner with score, missing keywords, and improved bullets
- Interview Practice with role-based question generation + answer feedback
- Job Tracker with create/update/delete and SQLite persistence
- Skill Tree with locked/unlocked progression tied to quest completion
- Dark, responsive, game-like UI

## API Routes

- `GET /api/health`
- `GET /api/user`
- `GET /api/quests`
- `POST /api/quests/:id/complete`
- `GET /api/jobs`
- `POST /api/jobs`
- `PATCH /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `POST /api/ai/coach`
- `POST /api/ai/ats`
- `POST /api/ai/interview-question`
- `POST /api/ai/interview-feedback`
- `GET /api/skills`
- `POST /api/skills/:id/complete`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Run full app in development mode:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3001`

4. Build frontend for production sanity check:

```bash
npm run build
```

5. (Optional) Run backend in production mode:

```bash
npm start
```

## Notes

- If `OPENAI_API_KEY` is missing, AI endpoints return deterministic mock responses so the app still works end-to-end.
- SQLite database is created automatically at `server/data/skillquest.db` with starter data.
