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

## Multi-Environment + Serverless Support

SkillQuest AI now works in three modes:

1. **Local full-stack mode** (default): `npm run dev`
2. **Traditional server mode**: `npm start` serves API + built frontend
3. **Serverless API mode**: `api/index.js` exports the Express app as a serverless handler (Vercel-ready via `vercel.json`)

### Environment portability

- `DATABASE_URL`: optional SQLite file path override (useful in Docker/CI/custom hosts)
- On serverless platforms, SQLite falls back to `/tmp/skillquest.db` automatically
- If file-based DB cannot be opened, app falls back to in-memory SQLite for reliability
- `VITE_API_BASE_URL`: optional frontend API base URL override for split frontend/backend deployments


## Chrome Extension (MV3)

A ready-to-load Chrome extension is included in `chrome-extension/`.

### What it does

- Opens SkillQuest AI in the browser action popup
- Lets you open the full app in a tab
- Supports local/staging/prod app URLs via extension settings

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `chrome-extension` folder

### Configure URL

- Open extension **Details** → **Extension options**, or click **Settings** in popup.
- Set your app URL, e.g.:
  - `http://localhost:5173` (local dev)
  - `https://your-deployment-url` (hosted)

## Notes

- If `OPENAI_API_KEY` is missing, AI endpoints return deterministic mock responses so the app still works end-to-end.
- SQLite database is created automatically with starter data.
- For persistent serverless production data, replace SQLite with a managed DB (Postgres, Turso, etc.).
## Notes

- If `OPENAI_API_KEY` is missing, AI endpoints return deterministic mock responses so the app still works end-to-end.
- SQLite database is created automatically at `server/data/skillquest.db` with starter data.
