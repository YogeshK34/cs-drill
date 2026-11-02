# SQL Lab — Agent Prompt

> Read `info.md` to understand the current codebase. Add a new mode to cs-drill called **"SQL Lab"** accessible from the main navigation alongside MCQ Drill and Interview Q&A. Everything must use the existing Neon DB connection in `lib/db.ts`. Do not add Docker, do not add in-memory anything — all data is persistent in Neon.

---

## Core Concept

SQL Lab is a **simulated SQL practice environment**. The user sees a question, a visual representation of the relevant table(s) with sample data, a terminal-style input where they type a SQL query, and an output panel that shows the result. They then reveal the correct answer to compare. Nothing is AI-generated — everything is seeded and deterministic.

---

## Simulation Approach — How Queries Work

All practice tables live inside a dedicated Postgres schema called `sql_lab` in the Neon DB. These are real tables with real seeded data. When a user runs a query:

- The app wraps it in a **read-only transaction**: `BEGIN; SET TRANSACTION READ ONLY; <user query>; ROLLBACK;`
- This means `SELECT` queries work perfectly and return real results
- `INSERT`, `UPDATE`, `DELETE`, `DROP`, `CREATE`, `TRUNCATE` all fail safely — Postgres rejects them inside a read-only transaction with a clean error message
- The app catches that error and shows: `⚠ Only SELECT queries are allowed in SQL Lab`
- No blocking/parsing needed — Postgres enforces it natively
- The user sees real query output, real column names, real rows — it feels like a real terminal

---

## Schema — `scripts/sql-lab-schema.sql`

Create a `sql_lab` schema with these fixed tables. Run this as a one-time migration against Neon:

```sql
CREATE SCHEMA IF NOT EXISTS sql_lab;

-- Employees
CREATE TABLE IF NOT EXISTS sql_lab.employees (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50),
  department  VARCHAR(50),
  salary      INTEGER,
  manager_id  INTEGER REFERENCES sql_lab.employees(id),
  joined_on   DATE
);

-- Departments
CREATE TABLE IF NOT EXISTS sql_lab.departments (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(50),
  budget  INTEGER,
  head_id INTEGER
);

-- Projects
CREATE TABLE IF NOT EXISTS sql_lab.projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(100),
  department  VARCHAR(50),
  status      VARCHAR(20),  -- 'active', 'completed', 'on_hold'
  deadline    DATE
);

-- Employee-Project assignments
CREATE TABLE IF NOT EXISTS sql_lab.assignments (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES sql_lab.employees(id),
  project_id  INTEGER REFERENCES sql_lab.projects(id),
  role        VARCHAR(50),
  hours       INTEGER
);

-- Orders (for aggregation and join practice)
CREATE TABLE IF NOT EXISTS sql_lab.orders (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES sql_lab.employees(id),
  product     VARCHAR(50),
  quantity    INTEGER,
  amount      INTEGER,
  ordered_on  DATE
);
```

Seed each table with **15–20 realistic rows** — varied salaries, departments, statuses, dates. Make the data interesting enough that aggregation and join questions have non-obvious answers. Seed via `scripts/sql-lab-seed.ts`, run with:

```bash
npx tsx scripts/sql-lab-seed.ts
```

---

## Questions — `lib/sql-questions.ts`

Static file, no DB. Each question has:

```ts
interface SQLQuestion {
  id: number;
  level: 'beginner' | 'select' | 'where' | 'order-limit' | 'aggregation' | 'joins' | 'subqueries' | 'window';
  title: string;        // short label e.g. "Top earners by department"
  description: string;  // the actual question asked to the user
  tables: string[];     // which sql_lab tables are relevant e.g. ['employees', 'departments']
  hint: string;         // one-line hint, revealed on demand
  answer: string;       // the correct SQL query
  explanation: string;  // why this query works, what to learn from it
}
```

Write at least **8 questions per level** (56+ total) progressing as:

| Level | Concepts Covered |
|---|---|
| **Beginner** | SELECT *, SELECT specific columns, column aliases |
| **SELECT** | DISTINCT, LIMIT, expressions in SELECT (salary * 12) |
| **WHERE** | single condition, AND/OR, IN, BETWEEN, LIKE, NULL checks |
| **ORDER BY / LIMIT** | ORDER BY multiple columns, DESC, TOP-N patterns |
| **Aggregation** | COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING |
| **JOINs** | INNER JOIN, LEFT JOIN, self-join (manager), multi-table join |
| **Subqueries** | WHERE subquery, FROM subquery, correlated subquery |
| **Window Functions** | ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY |

Make questions reference the seeded data specifically — e.g. _"Find all employees in the Engineering department earning more than 80000"_ so the user can visually verify their output against the table shown.

---

## API Routes

### `POST /api/sql-lab/run`
- Body: `{ query: string }`
- Requires auth (read cookie)
- Wraps query in read-only transaction against Neon
- Returns: `{ columns: string[], rows: any[][], error?: string }`
- Cap results at 100 rows max
- Timeout at 5 seconds

### `GET /api/sql-lab/tables`
- Query param: `?names=employees,departments`
- Returns full table data for the table viewer
- Requires auth

### `POST /api/sql-lab/sessions` _(optional but recommended)_
- Saves which questions the user attempted and whether they revealed the answer
- Body: `{ questionId: number, revealed: boolean }`
- Inserts into a `sql_lab_progress` table in Neon (add to schema): `user_id, question_id, revealed, attempted_at`

---

## UI Layout

Layout top to bottom on desktop, stacked on mobile:

### 1. Level Selector
Horizontal chips: `Beginner → SELECT → WHERE → ORDER BY → Aggregation → JOINs → Subqueries → Window Functions`. Clicking a level loads the first question of that level.

### 2. Question Panel
Shows `title`, `description`, and a **"Show hint"** toggle that reveals `hint` on click.

### 3. Table Viewer
Shows the relevant table(s) for the current question as a styled data table with real data fetched from Neon. Scrollable horizontally. Looks like a DB viewer, not a spreadsheet:
- Monospace font
- Zebra rows
- Column headers in uppercase
- Horizontally scrollable for wide tables

### 4. Terminal Input
A dark `<textarea>` styled like a terminal:
- Monospace font
- Green-tinted text (`#4ade80`)
- `$` prompt prefix
- Keyboard shortcut: `Ctrl+Enter` to run
- "Run" button alongside

### 5. Output Panel
Below the terminal. Shows query results as a table (same style as table viewer) or an error message in red. Shows row count: `12 rows returned`. Empty state: `-- run a query to see output`.

### 6. Answer Reveal
A **"Show Answer"** button that expands to show `answer` (monospace code block) and `explanation`. Once revealed, mark the question as revealed in progress tracking.

### 7. Navigation
Previous / Next question buttons within the same level. Question counter: `3 / 8`.

---

## Design Rules

- Same dark zinc design system as the rest of cs-drill (`#09090b` bg, zinc-900 cards, zinc-800 borders)
- Terminal area: `#0d1117` background, `#4ade80` (green-400) text for input, white for output
- Table viewer headers: monospace, uppercase, zinc-500 color
- Error output: rose-400 color
- No new UI libraries — Tailwind only
- Mobile friendly — table viewer and terminal stack vertically, horizontal scroll on wide tables

---

## General Rules

- Do not touch existing MCQ drill or Interview Q&A code
- All DB connections use existing `lib/db.ts`
- DB is hosted on **Neon DB** (serverless Postgres). `DATABASE_URL` in `.env.local` is a Neon connection string. Do not add Docker or local Postgres setup
- Auth required for running queries and tracking progress
- Update `info.md` after implementing