# cs-drill ⚡

A fast-paced, keyboard-driven Computer Science fundamentals MCQ prep tool built with Next.js App Router, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Topics**: `OS`, `Networks`, `DBMS`, `OOP`, `DSA Theory`, and `Mixed`.
- **Keyboard Shortcuts**:
  - `[A]` `[B]` `[C]` `[D]`: Instantly select an option.
  - `[Space]`: Skip current question and reveal the explanation.
  - `[Enter ↵]`: Advance to the next question or restart when complete.
- **Dynamic Feedback**:
  - Immediate visual feedback on correct / incorrect answers.
  - In-depth technical explanations for every question.
  - Real-time progress bar across 20 questions.
  - **Streak Counter**: Automatically activates after 2+ consecutive correct answers (`🔥 2 STREAK`).
- **Comprehensive End Screen**:
  - Accuracy percentage and total score.
  - Breakdown of correct, wrong, and skipped questions.
  - Best streak record.
  - Per-question result pill timeline.
  - One-touch restart (`[Enter ↵]`) or quick topic switching.
- **Persistent Notes Scratchpad**:
  - Auto-saving technical notebook saved directly to PostgreSQL.
  - Track algorithm ideas to revisit, system design notes, and interview thoughts.
  - Search notes, instant debounced persistence, and `⌘N` shortcut.
- **Design**:
  - Clean, minimalist dark theme (`#09090b` background).
  - Monospace typography for keys, badges, and counters.
  - Zero external UI libraries.

---

## 🛠️ Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI SDK**: `@anthropic-ai/sdk` (optional/ready for Claude integration)
- **Data Source**: Localized question bank in `lib/questions.ts` served via `/api/questions` route handler.

---

## 🏃 Running Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Docker & Postgres Migration Guide

Currently, `/api/questions` serves questions from the curated localized question bank in `lib/questions.ts`. When you are ready to persist questions into PostgreSQL using Docker, follow this simple schema:

### 1. Postgres Schema

```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- JSON array of 4 strings: ["opt1", "opt2", "opt3", "opt4"]
  correct INTEGER NOT NULL, -- 0-indexed: 0, 1, 2, or 3
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index by topic for fast random queries
CREATE INDEX idx_questions_topic ON questions(topic);
```

### 2. Sample Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: cs-drill-db
    environment:
      POSTGRES_USER: drilluser
      POSTGRES_PASSWORD: drillpassword
      POSTGRES_DB: cs_drill
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 3. Querying in `/api/questions/route.ts`

Replace `getQuestions(topic, 20)` in `app/api/questions/route.ts` with a query like:

```ts
// Example SQL query:
SELECT topic, question, options, correct, explanation
FROM questions
WHERE ($1 = 'Mixed' OR topic = $1)
ORDER BY RANDOM()
LIMIT 20;
```
# cs-drill
# cs-drill
