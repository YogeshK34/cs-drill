# cs-drill — Technical & Architectural Documentation

A comprehensive guide and reference document for **cs-drill**, an interactive Computer Science fundamentals Multiple-Choice Question (MCQ) preparation tool built with Next.js (App Router), TypeScript, Tailwind CSS, and designed for high-performance desktop and mobile/Android drill workflows.

---

## 1. Project Overview

### 1.1 Purpose
`cs-drill` is designed for software engineers, computer science students, and interview candidates seeking rapid-fire, high-yield active recall on core undergraduate and systems engineering concepts. It tests key principles across five foundational computer science domains, delivering immediate feedback, detailed technical explanations, performance analytics, and streak tracking.

### 1.2 Core Pillars
- **Zero-Latency Drilling**: Fast, seamless state transitions without page refreshes.
- **Dual-Input Parity**: Full keyboard driving on desktop (`A`/`B`/`C`/`D`, `Space`, `Enter ↵`) and tactile, thumb-friendly touch gestures on mobile/Android.
- **Deterministic & High-Quality Content**: 100+ curated questions with randomized options and dynamic answer tracking.
- **Pluggable Backend Architecture**: Seamlessly transitions between an in-memory localized question bank, a containerized PostgreSQL database via Docker, or dynamic on-demand generation with Claude Sonnet via the `@anthropic-ai/sdk`.

---

## 2. Technology Stack & Runtime

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.4.2** | App Router architecture, Server Components, Route Handlers, Turbopack |
| **Language** | **TypeScript 5.x** | Strict mode typing across all models, state, and routes |
| **UI & Styling** | **Tailwind CSS v4** | Modern dark theme, dynamic CSS variables, Geist font integration |
| **Fonts** | **Geist & Geist Mono** | Sans-serif for body typography, monospace for keys, tags, and metrics |
| **AI SDK** | **@anthropic-ai/sdk** | Pre-configured for Claude Sonnet MCQ generation |
| **Package Manager**| **pnpm v12.5.1** | Fast, deterministic dependency management |

---

## 3. Supported Topics & Coverage

Every session serves a curated batch of **20 questions** selected either specifically by topic or distributed evenly in mixed mode:

1. **OS (Operating Systems)**:
   - Virtual memory, paging, page replacement algorithms, TLB function and anomalies (Belady's Anomaly).
   - CPU scheduling algorithms (FCFS, Round Robin, SJF, convoy effect, priority aging).
   - Concurrency, semaphores vs. mutexes, atomic hardware instructions (CAS/Test-and-Set).
   - Deadlocks (Coffman's 4 conditions, Banker's algorithm, resource allocation graphs).
   - Unix process model (`fork()`, `exec()`, CoW, zombies, orphans, IPC, shared memory).
   - File systems (inodes, directory entries, VFS abstraction).

2. **Networks (Computer Networks)**:
   - TCP/IP architecture, 3-way handshake (`SYN`, `SYN-ACK`, `ACK`), connection teardown (`TIME_WAIT`, 2 MSL).
   - OSI 7-layer model responsibilities and data encapsulation.
   - Flow control (Receive Window `rwnd`) vs. Congestion control (Congestion Window `cwnd`).
   - Protocols: DNS (A, AAAA, CNAME), DHCP (DORA sequence), ARP, ICMP (`traceroute`), NAT/NAPT, BGP.
   - Web protocols: HTTP/1.1 vs HTTP/2 (multiplexing, HoL blocking) vs HTTP/3 (QUIC over UDP).
   - Network layer concepts: Subnetting (`/26` calculations), MTU/Path MTU Discovery, IP Anycast, VLANs (802.1Q).

3. **DBMS (Database Management Systems)**:
   - ACID properties (Atomicity, Consistency, Isolation levels, Durability via Write-Ahead Logging/WAL).
   - Relational Normalization (1NF, 2NF partial dependencies, 3NF transitive dependencies, BCNF superkey rules).
   - Indexing structures (B-Tree vs. B+ Tree disk-optimized node structures, clustered vs. non-clustered/secondary index).
   - Transaction Isolation Anomaly prevention (Dirty Reads, Non-repeatable Reads, Phantom Reads).
   - Concurrency Control: Two-Phase Locking (2PL), MVCC (Multi-Version Concurrency Control), Wait-For Graphs.
   - Query semantics: `WHERE` vs. `HAVING`, `LEFT OUTER JOIN`, SQL injection defenses (Parameterized queries/Prepared Statements).
   - Scalability: Horizontal sharding, materialized views, CAP Theorem trade-offs.

4. **OOP (Object-Oriented Programming)**:
   - Core OOP pillars: Subtype polymorphism, encapsulation/information hiding, abstraction, inheritance.
   - SOLID Principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).
   - GoF Design Patterns:
     - *Creational*: Singleton, Factory Method, Builder, Prototype.
     - *Structural*: Decorator, Adapter, Facade.
     - *Behavioral*: Observer, Strategy, State.
   - Runtime internals: Dynamic dispatch via Virtual Method Tables (`vtable`) and virtual pointers (`vptr`).
   - Software engineering heuristics: High cohesion vs. low coupling, object composition over class inheritance.

5. **DSA Theory (Data Structures & Algorithms)**:
   - Asymptotic analysis: Master Theorem cases, worst/average case bounds, amortized analysis (dynamic array doubling).
   - Sorting algorithms: QuickSort worst-case conditions, MergeSort stability and divide-and-conquer bounds, HeapSort.
   - Graph algorithms: Dijkstra's with Min-Heap $O((V+E)\log V)$, Bellman-Ford negative weight handling, Kruskal's MST with Disjoint Set Union (DSU) and path compression $O(\alpha(n))$, Kosaraju's SCCs.
   - Search structures: Hash Tables (chaining collisions), Binary Search Trees (in-order sorting), AVL balancing invariants, B-Trees ($m$-way branch factors), Tries ($O(k)$ prefix lookup).
   - Dynamic Programming requirements: Optimal substructure and overlapping subproblems.

6. **Mixed**:
   - Compiles an evenly sampled set of 20 questions (4 from each of the 5 domains) to simulate a comprehensive full-breadth interview drill.

---

## 4. Application Architecture & File Structure

```
cs-drill/
├── app/
│   ├── api/
│   │   ├── auth/                # Session and authentication routes
│   │   ├── notes/               # User notes API
│   │   └── questions/
│   │       └── route.ts         # GET /api/questions Route Handler
│   ├── favicon.ico              # Browser icon
│   ├── globals.css              # Dark theme tokens, touch manipulation, scrollbar styling
│   ├── layout.tsx               # Root layout, Geist font loader, mobile viewport & PWA meta
│   ├── login/page.tsx           # Authentication login page
│   ├── notes/page.tsx           # Revision notes client interface
│   ├── register/page.tsx        # User registration page
│   └── page.tsx                 # Core page with Mode Toggle (MCQ Drill vs Interview Q&A)
├── components/
│   └── InterviewQA.tsx          # Interview Q&A flashcard reader with search & topic filter
├── lib/
│   ├── db.ts                    # Neon DB (serverless Postgres) connection pool singleton
│   ├── interview-questions.ts   # 70+ Curated real interview questions by topic & company
│   ├── questions.ts             # 100+ Question bank & Fisher-Yates shuffle engine
│   ├── session.ts               # JWT session signing and cookie management
│   └── types.ts                 # TypeScript interfaces (Question, InterviewQuestion, etc.)
├── public/                      # Static branding assets
├── next.config.ts               # Next.js 16 configuration (Turbopack, cacheComponents)
├── package.json                 # Project dependencies & scripts
├── pnpm-lock.yaml               # Locked dependency tree
├── prompt.txt                   # Project requirement specification
├── README.md                    # Quickstart & Docker guide
└── info.md                      # Complete technical reference manual (this document)
```

### 4.1 Detailed File Roles

#### `lib/types.ts`
Defines the strict contracts used throughout the app:
- `Topic`: `"Mixed" | "OS" | "Networks" | "DBMS" | "OOP" | "DSA Theory"`
- `InterviewTopic`: `"OS" | "Networks" | "DBMS" | "OOP" | "DSA Theory"`
- `Question`: MCQ schema with `options` and `correct` answer index.
- `InterviewQuestion`:
  ```ts
  export interface InterviewQuestion {
    id?: string;
    company: string;
    topic: InterviewTopic;
    question: string;
    answer: string;      // 3–6 lines max, interview-ready
    tags: string[];      // 1–3 keyword tags
  }
  ```
- `DrillStats`: Tracks `score`, `correctCount`, `wrongCount`, `skippedCount`, `currentStreak`, and `maxStreak`.

#### `lib/interview-questions.ts`
- Houses a curated static reference bank of 70+ real interview questions from companies like Google, Meta, Microsoft, Amazon, Cohesity, Apple, Uber, Netflix, Stripe, and Goldman Sachs.
- Covers the 5 core CS domains (OS, Networks, DBMS, OOP, DSA Theory).
- Includes concise, interview-ready answers (3-6 lines) and keyword tags.
- Provides `getInterviewQuestions(topic?: string)` filter helper.

#### `components/InterviewQA.tsx`
- Client-side flashcard-style reader for interview questions.
- Includes:
  - Topic filter chips matching the MCQ chip design (All, OS, Networks, DBMS, OOP, DSA Theory).
  - Search input filtering dynamically across questions, answers, company badges, and tags.
  - "Expand All" and "Collapse All" controls.
  - Interactive flashcards showing company badge, topic badge, bold question, tap-to-reveal answer, and bottom keyword tags (clickable for quick search filtering).
  - Zero scoring, zero timers — designed for reading and absorption.

#### `lib/questions.ts`
- Houses the localized MCQ question bank (`QUESTION_BANK`) containing 100+ questions.
- Includes `shuffleArray()` utilizing the Fisher-Yates algorithm.
- Includes `shuffleQuestionOptions()`: Scrambles the 4 options on every fetch and dynamically recalculates the `correct` index so that the correct answer is evenly distributed across A, B, C, and D without answer-order bias.
- `getQuestions(topic, count)`: Extracts 20 items based on topic or distributes 4 questions per topic when `Mixed` is selected.

#### `app/api/questions/route.ts`
- Handles `GET /api/questions?topic=<topic>`.
- Compatible with Next.js 16 `cacheComponents` via `await connection()` from `next/server` to ensure request-time execution.
- Returns `Question[]` with HTTP 200 and `Cache-Control: no-store, max-age=0`.
- Priority: Anthropic Claude API (if configured) → Neon PostgreSQL (`questions` table) → localized question bank fallback.

#### `app/api/interview-questions/route.ts`
- Handles `GET /api/interview-questions?topic=<topic>&search=<search>`.
- Directly queries the `interview_questions` table in Neon DB (serverless Postgres) via the connection pool singleton.
- Supports topic and keyword/tag filtering directly in SQL with a fallback to the localized question bank.
- Returns `InterviewQuestion[]` with `X-Data-Source: neon-postgres`.

#### `app/page.tsx`
- Complete interactive client component (`"use client"`).
- Hosts the Header Mode Toggle switching seamlessly between **MCQ Drill** and **Interview Q&A**.
- Preserves MCQ drill state across mode switches.
- Manages state for question indexing, option selection, skipping, scoring, streak tracking, question histories, and keyboard listeners (active exclusively in MCQ mode).
- Renders:
  - Header with mode toggle ("MCQ Drill" vs "Interview Q&A"), branding, topic label, streak badge, score counter, and progress bar.
  - In MCQ mode: topic chips, question card, explanation card, and shortcut footer.
  - In Interview mode: `<InterviewQA />` flashcard reader.

#### `app/globals.css`
- Applies dark theme base colors (`#09090b` background, `#f4f4f5` foreground).
- Disables tap delay with `touch-action: manipulation;`.
- Removes mobile tap highlights with `-webkit-tap-highlight-color: transparent;`.
- Implements custom dark scrollbars and `.no-scrollbar` utility for touch swipe chips.
- Implements `.safe-pb` for Android gesture navigation bars.

#### `app/layout.tsx`
- Injects Geist and Geist Mono variables into the root HTML element.
- Exports a separate `Viewport` configuration (`width=device-width`, `initialScale=1`, `maximumScale=1`, `viewportFit=cover`, `themeColor="#09090b"`).
- Sets up mobile web app compatibility metadata (`mobile-web-app-capable: yes`, `statusBarStyle: black-translucent`).

---

## 5. UI/UX & User Interaction Flow

```mermaid
flowchart TD
    Start([User opens cs-drill]) --> Load[Fetch 20 Questions via /api/questions]
    Load --> DisplayQ[Render Question X of 20]
    DisplayQ --> Choice{User Action}
    Choice -->|Press A, B, C, D or Tap Option| Answer[Evaluate Answer]
    Choice -->|Press Space or Tap Skip| Skip[Mark Question as Skipped]
    Choice -->|Tap Topic Chip| SwitchTopic[Change Topic & Re-fetch]
    
    Answer --> Check{Is Correct?}
    Check -->|Yes| CorrectState[Score +1, Streak +1, Highlight Green]
    Check -->|No| WrongState[Wrong +1, Streak Reset to 0, Highlight Red & Green]
    Skip --> SkipState[Skipped +1, Streak Reset to 0, Reveal Correct Answer]
    
    CorrectState --> Reveal[Show Technical Explanation]
    WrongState --> Reveal
    SkipState --> Reveal
    
    Reveal --> NextAction{Advance Question}
    NextAction -->|Press Enter / Tap Next Question| NextCheck{Is Question 20?}
    NextCheck -->|No| NextQ[Increment Question Index] --> DisplayQ
    NextCheck -->|Yes| EndScreen[Show End Screen & Accuracy Analytics]
    
    EndScreen --> RestartChoice{User Decision}
    RestartChoice -->|Press Enter or Tap Restart| Reset[Re-shuffle & Start Over] --> DisplayQ
    RestartChoice -->|Tap Another Topic| SwitchTopic
```

### 5.1 Keyboard Shortcuts Map (Desktop)
- **`A` / `B` / `C` / `D`**: Select option 0, 1, 2, or 3 respectively.
- **`Space`**: Skip the current question and immediately view the explanation.
- **`Enter ↵`**: Advance to the next question when answered or skipped; restart drill on the End Screen.

### 5.2 Android & Mobile Optimizations
- **48px+ Touch Compliance**: Options have `min-h-[52px]` and action buttons have `min-h-[46px]`.
- **Dynamic Viewport (`min-h-dvh`)**: Automatically scales with Android Chrome's expanding and collapsing URL bar.
- **Tactile Feedback**: Active touch down triggers `active:scale-[0.98]` or `active:scale-95` on chips and buttons.
- **Gesture Bar Safe Area**: `safe-pb` ensures that the Android gesture navigation bar never covers the "NEXT QUESTION" or "SKIP" button.
- **Selection Suppression**: `select-none` prevents accidental browser text selection when tapping options in rapid succession.
- **Horizontal Swipe Chips**: Topics can be swiped horizontally across the top on mobile, styled like native Android filter chips.

### 5.3 Streak Counter Mechanics
- Activates when `currentStreak >= 2`.
- Displays an animated flame badge: `🔥 2 STREAK`, `🔥 3 STREAK`.
- Resets to 0 immediately if a question is answered incorrectly or skipped.
- The highest streak achieved during a session is recorded and showcased on the End Screen as `BEST STREAK`.

### 5.4 Interview Q&A Flashcard Mode
- **Reference-First Design**: Dedicated study mode focused on reading and absorbing high-yield concepts actually tested in technical interviews.
- **Zero Stress**: No scoring, timers, or answer tracking; questions are reviewed at the candidate's own pace.
- **Topic Filter Chips**: Native Android-style filter chips for `All`, `OS`, `Networks`, `DBMS`, `OOP`, and `DSA Theory`.
- **Dynamic Search**: Instant search bar filtering across question titles, company names, full-text answers, and tags.
- **Interactive Flashcards**:
  - Company badge (`🏢 Google`, `🏢 Cohesity`, `🏢 Amazon`, etc.)
  - Domain topic tag (`OS`, `Networks`, `DBMS`, `OOP`, `DSA Theory`)
  - Bold question statement
  - Tap / click toggle to expand or collapse the interview-ready answer (3–6 lines max, no fluff)
  - Keyword tags at the base of the answer (clickable to immediately filter the search view)
  - Global "Expand Page" and "Collapse All" quick-action toggles
- **Pagination & Page Size Controls**:
  - Configurable page sizes: **10** (default), **20**, or **All** questions per view.
  - Active item range counter (`Showing 1–10 of 70 questions`) with dynamic total page indicators.
  - Numeric page buttons with intelligent ellipsis truncation (`1`, `2`, `3`, `4`, `...`, `7`).
  - Tactile `← Prev` and `Next →` navigation buttons with auto-disabled boundaries.
  - Automatic page reset to Page 1 upon changing topic filter chips or typing search queries.
  - Smooth scroll to the top of the question list when navigating across pages.

---

## 6. Docker & PostgreSQL Migration Guide

When you are ready to transition from the localized in-memory bank to a PostgreSQL database running in Docker, use the following guide:

### 6.1 `docker-compose.yml`
Place this file in the project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: cs-drill-postgres
    restart: always
    environment:
      POSTGRES_USER: drilluser
      POSTGRES_PASSWORD: drillpassword
      POSTGRES_DB: cs_drill
    ports:
      - "5432:5432"
    volumes:
      - cs_drill_data:/var/lib/postgresql/data

volumes:
  cs_drill_data:
```

Launch the database:
```bash
docker compose up -d
```

### 6.2 Database Schema (DDL)
Connect to PostgreSQL and create the `questions` table:

```sql
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 4 strings: ["A", "B", "C", "D"]
    correct INTEGER NOT NULL CHECK (correct >= 0 AND correct <= 3),
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimize random sampling by topic
CREATE INDEX idx_questions_topic ON questions(topic);
```

### 6.3 Seeding Script (`scripts/seed.ts`)
Install the Postgres client:
```bash
pnpm add pg
pnpm add -D @types/pg tsx
```

Create `scripts/seed.ts`:
```ts
import { Pool } from 'pg';
import { QUESTION_BANK } from '../lib/questions';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://drilluser:drillpassword@localhost:5432/cs_drill'
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding question bank into PostgreSQL...');
    await client.query('BEGIN');
    
    for (const q of QUESTION_BANK) {
      await client.query(
        `INSERT INTO questions (topic, question, options, correct, explanation)
         VALUES ($1, $2, $3, $4, $5)`,
        [q.topic, q.question, JSON.stringify(q.options), q.correct, q.explanation]
      );
    }
    
    await client.query('COMMIT');
    console.log(`Successfully seeded ${QUESTION_BANK.length} questions.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
```

Run seed:
```bash
npx tsx scripts/seed.ts
```

### 6.4 Connecting `/api/questions/route.ts` to Postgres
In `app/api/questions/route.ts`, replace the localized call with:

```ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Inside GET handler:
let query = '';
let params: any[] = [];

if (topic.toLowerCase() === 'mixed') {
  query = `
    (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'os' ORDER BY RANDOM() LIMIT 4)
    UNION ALL
    (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'networks' ORDER BY RANDOM() LIMIT 4)
    UNION ALL
    (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'dbms' ORDER BY RANDOM() LIMIT 4)
    UNION ALL
    (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'oop' ORDER BY RANDOM() LIMIT 4)
    UNION ALL
    (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'dsa theory' ORDER BY RANDOM() LIMIT 4);
  `;
} else {
  query = `
    SELECT topic, question, options, correct, explanation 
    FROM questions 
    WHERE LOWER(topic) = LOWER($1)
    ORDER BY RANDOM() 
    LIMIT 20;
  `;  
  params = [topic];
}

const { rows } = await pool.query(query, params);
return NextResponse.json(rows);
```

---

## 7. Optional Anthropic Claude Integration

If dynamic AI question generation is desired in the future:

1. Add your API key to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
2. Enable the Anthropic block in [`app/api/questions/route.ts`](file:///home/yogesh/Documents/Interview-Prep/cs-drill/app/api/questions/route.ts):
   ```ts
   import Anthropic from "@anthropic-ai/sdk";

   const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
   const response = await anthropic.messages.create({
     model: "claude-3-5-sonnet-20241022",
     max_tokens: 4096,
     messages: [{ role: "user", content: `Generate exactly 20 multiple-choice questions for topic "${topic}" in JSON format.` }]
   });
   ```

---

## 8. Development & Build Commands

All standard lifecycle commands using `pnpm`:

```bash
# Install all dependencies
pnpm install

# Start development server with Turbopack on port 3000
pnpm dev

# Run ESLint validation
pnpm lint

# Build production bundle with Next.js Turbopack compiler
pnpm build

# Run production server
pnpm start
```

---

## 9. Design System Tokens & Styling Reference

- **Background Color**: `#09090b` (`bg-[#09090b]`, Zinc-950 tone)
- **Card Background**: `bg-zinc-900/60` with `border-zinc-800/80` and `backdrop-blur-sm`
- **Typography**:
  - Primary text: `text-zinc-100` / `text-zinc-200`
  - Monospace accents: `font-mono text-xs uppercase tracking-wider`
  - Explanations & Questions: `leading-relaxed font-normal`
- **State Colors**:
  - **Correct Option**: `border-emerald-500/80 bg-emerald-950/35 text-emerald-200`
  - **Incorrect Option**: `border-rose-500/80 bg-rose-950/35 text-rose-200`
  - **Skipped Badge**: `bg-zinc-900/90 border-zinc-700/80 text-zinc-300`
  - **Streak Badge**: `bg-amber-500/15 border-amber-500/40 text-amber-400`
- **Accessibility & Touch**:
  - Minimum touch target: 48px $\times$ 48px
  - Tap highlight color: `transparent`
  - Hover states wrapped with `active:` modifiers for instant mobile responsiveness
