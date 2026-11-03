# cs-drill ⚡

A keyboard-first Computer Science interview preparation platform featuring zero-latency MCQ drills, an interactive SQL sandbox, and technical interview flashcards.

---

## ⚡ Modes & Highlights

- **MCQ Drill**: High-yield drilling across `OS`, `Networks`, `DBMS`, `OOP`, `DSA Theory`, or `Mixed` mode with instant explanations, streaks, and analytics.
- **SQL Labs**: Live in-browser SQL sandbox with schema viewers, structured levels, and automated read-only execution.
- **Interview Q&A**: Flashcard-style interview questions filterable by topic and target company.
- **Persistent Notes**: Auto-saving technical scratchpad with JWT authentication.
- **3-Tier Pipeline**: Dynamic AI generation via Claude Sonnet &rarr; PostgreSQL pool &rarr; localized zero-config offline fallback.

---

## 🧪 SQL Labs

An interactive SQL playground executing real queries against PostgreSQL in a safe sandbox (`sql_lab` schema, read-only transaction, 5s timeout).

- **8 Progression Levels**:
  - `Beginner`: Column projection, aliases, and table inspection
  - `SELECT`: `DISTINCT`, computed columns, and row limits
  - `WHERE`: Complex conditionals, pattern matching, and `NULL` handling
  - `ORDER BY`: Multi-column sorting and pagination
  - `Aggregation`: `GROUP BY`, `HAVING`, and aggregate functions (`COUNT`, `SUM`, `AVG`)
  - `JOINs`: `INNER`, `LEFT`, self-joins, and multi-table relationships
  - `Subqueries`: Scalar, `IN`-clause, correlated, and derived tables
  - `Window Functions`: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, and `PARTITION BY`
- **Schema Inspector**: View live schema and sample rows for seeded tables (`employees`, `departments`, `projects`, `assignments`, `orders`).
- **Interactive Practice**: Hints on demand, solution diffs, execution timing, and persistent completion tracking.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| `A` / `B` / `C` / `D` | MCQ Drill | Select corresponding option |
| `Space` | MCQ Drill | Skip question & view technical explanation |
| `Enter ↵` | MCQ Drill | Advance to next question or restart on summary screen |
| `Ctrl` / `Cmd` + `Enter` | SQL Labs | Execute query in SQL terminal |

---

## 🛠️ Tech Stack

- **Frontend & API**: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (dark theme, mobile touch-optimized)
- **Database & Auth**: PostgreSQL 16 (Docker / Neon), `pg` connection pool, `jose` (JWT)
- **AI (Optional)**: Anthropic Claude Sonnet via `@anthropic-ai/sdk`

---

## 🏃 Quickstart

`cs-drill` runs immediately out of the box with zero external dependencies:

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Database Setup & Seeding (Optional)

To enable user persistence, full question sets, and SQL Labs:

```bash
# 1. Start local PostgreSQL container (mapped to port 5433)
docker compose up -d

# 2. Configure environment variables
cp .env.local.example .env.local

# 3. Seed datasets
pnpm seed            # MCQ question bank
pnpm seed:sql-lab    # SQL Lab tables & questions
pnpm seed:interview  # Technical interview questions
```

*(Optional)* To generate fresh questions with AI, set `ANTHROPIC_API_KEY` in `.env.local`.

---

## 📁 Project Structure

```
cs-drill/
├── app/
│   ├── api/
│   │   ├── auth/              # JWT authentication endpoints
│   │   ├── interview-questions/# Interview Q&A API
│   │   ├── notes/             # Scratchpad notes CRUD
│   │   ├── questions/         # 3-tier MCQ pipeline
│   │   └── sql-lab/           # SQL execution sandbox & progress APIs
│   ├── login/ & register/     # Auth views
│   ├── notes/                 # User notes scratchpad
│   └── page.tsx               # Main drill, SQL lab, and interview client
├── components/
│   ├── InterviewQA.tsx        # Interview flashcard component
│   └── SqlLab.tsx             # Interactive SQL playground
├── lib/
│   ├── db.ts                  # PostgreSQL pool singleton
│   ├── questions.ts           # Offline MCQ bank & shuffle logic
│   ├── sql-questions.ts       # 8-tier SQL curriculum & hints
│   └── types.ts               # Shared TypeScript schemas
├── scripts/
│   ├── init.sql               # Base database schema
│   ├── seed.ts                # MCQ seeder
│   ├── seed-interview.ts      # Interview Q&A seeder
│   └── sql-lab-seed.ts        # SQL Lab schema & seed data
└── docker-compose.yml         # Containerized PostgreSQL 16
```
