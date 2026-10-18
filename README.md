# cs-drill ⚡

A fast-paced, keyboard-first Computer Science fundamentals MCQ prep tool built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**. Designed for rapid active recall and technical interview prep with zero-latency drilling, mobile ergonomics, persistent notes, and a pluggable 3-tier data pipeline.

---

## 🚀 Features

- **5 Core Topics & Mixed Mode**: High-yield drilling across `OS`, `Networks`, `DBMS`, `OOP`, `DSA Theory`, or an evenly distributed 20-question `Mixed` mode.
- **Dual-Input Parity**:
  - **Desktop Shortcuts**: `[A]` `[B]` `[C]` `[D]` to select options, `[Space]` to skip, and `[Enter ↵]` to advance or restart.
  - **Mobile / Android Ergonomics**: 48px+ touch targets, swipeable topic chips, gesture navigation safe-padding (`safe-pb`), tap-delay suppression, and dynamic viewport sizing (`dvh`).
- **Zero-Latency Active Recall**: Instant answer evaluation, detailed technical explanations, animated streak counter (`🔥 2 STREAK`), and live progress tracking.
- **End-Screen Analytics**: Final accuracy percentage, correct/wrong/skipped breakdown, best streak record, per-question result pill timeline, and one-key restart.
- **Persistent Notes & Auth**: User registration/login with JWT session cookies and an auto-saving technical scratchpad stored directly in PostgreSQL.
- **Pluggable 3-Tier Data Pipeline**:
  1. **Anthropic Claude** (`ANTHROPIC_API_KEY`): Dynamic on-demand MCQ generation via Claude Sonnet.
  2. **PostgreSQL Database** (`DATABASE_URL`): Containerized persistence with random question sampling.
  3. **Localized Question Bank**: 100+ curated questions with Fisher-Yates option scrambling ensuring zero-setup offline capability out of the box.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.4.2 (App Router, Turbopack, React 19) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 (minimalist dark theme `#09090b`, Geist & Geist Mono fonts) |
| **Database & Auth** | PostgreSQL 16 (Docker), `jose` (JWT), `bcryptjs` |
| **AI Integration** | `@anthropic-ai/sdk` (Claude Sonnet 4.6 / 3.5) |
| **Package Manager** | `pnpm` (v12.5.1) |

---

## 🏃 Quickstart

`cs-drill` works immediately out of the box with its localized question bank without needing Docker or API keys:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Desktop Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `A` / `B` / `C` / `D` | Select corresponding answer option |
| `Space` | Skip current question and reveal technical explanation |
| `Enter ↵` | Advance to next question (when answered/skipped) or restart quiz on End Screen |

---

## 🗄️ PostgreSQL & Docker Setup (Optional)

To enable persistent user notes and database-backed question queries:

```bash
# 1. Start the PostgreSQL container (mapped to host port 5433)
docker compose up -d

# 2. Set up environment variables
cp .env.local.example .env.local

# 3. Seed question bank into PostgreSQL
pnpm seed
```

Default connection string:
```env
DATABASE_URL=postgres://drilluser:drillpassword@localhost:5433/cs_drill
SESSION_SECRET=your-secure-random-secret
```

---

## 🤖 Dynamic AI Generation (Optional)

To generate fresh questions dynamically using Claude Sonnet:

1. Add your Anthropic key to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ANTHROPIC_MODEL=claude-sonnet-4-6
   ```
2. Restart `pnpm dev`. Questions will automatically be generated on demand, falling back to PostgreSQL or the localized question bank if the API is unavailable.

---

## 📁 Project Structure

```
cs-drill/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, register, logout, session route handlers
│   │   ├── notes/         # CRUD endpoints for user notes
│   │   └── questions/     # 3-tier GET /api/questions (Claude → Postgres → Local)
│   ├── notes/             # Persistent notes scratchpad page
│   ├── login/ & register/ # Authentication views
│   ├── globals.css        # Tailwind v4 dark theme, touch-action & safe-area rules
│   ├── layout.tsx         # Root layout, Geist fonts, mobile viewport metadata
│   └── page.tsx           # Interactive MCQ drill client component
├── lib/
│   ├── db.ts              # PostgreSQL connection pool singleton
│   ├── questions.ts       # 100+ Question bank & Fisher-Yates shuffle engine
│   ├── session.ts         # JWT session management with jose & cookies
│   └── types.ts           # Question, Topic, and DrillStats contracts
├── scripts/
│   ├── init.sql           # Database schema (questions, users, notes)
│   └── seed.ts            # Idempotent DB seeder (`pnpm seed`)
├── docker-compose.yml     # PostgreSQL 16 container definition (port 5433)
├── info.md                # Comprehensive architectural specification
└── README.md              # Quickstart guide
```

---

## 📜 Available Scripts

- `pnpm dev`: Start Next.js development server with Turbopack.
- `pnpm build`: Compile production build.
- `pnpm start`: Run production server.
- `pnpm lint`: Run ESLint checks.
- `pnpm seed`: Populate PostgreSQL database from the localized question bank.
