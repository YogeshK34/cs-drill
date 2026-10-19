-- ============================================================
-- cs-drill PostgreSQL schema init
-- Mounted at: /docker-entrypoint-initdb.d/init.sql
-- Runs automatically on first container startup
-- ============================================================

-- Questions table: mirrors the local question bank
CREATE TABLE IF NOT EXISTS questions (
    id          SERIAL PRIMARY KEY,
    topic       VARCHAR(50)  NOT NULL,
    question    TEXT         NOT NULL,
    options     JSONB        NOT NULL,   -- Array of 4 strings
    correct     INTEGER      NOT NULL CHECK (correct >= 0 AND correct <= 3),
    explanation TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions (topic);

-- Users table: basic username/password auth
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL       PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password_hash   TEXT         NOT NULL,
    created_at      TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- Notes table: per-user persistent notes, thoughts, and algorithm ideas
CREATE TABLE IF NOT EXISTS notes (
    id          SERIAL        PRIMARY KEY,
    user_id     INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255)  NOT NULL DEFAULT 'Untitled',
    content     TEXT          NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes (user_id);

-- Interview questions table: flashcard-style interview questions by topic & company
CREATE TABLE IF NOT EXISTS interview_questions (
    id          SERIAL PRIMARY KEY,
    company     VARCHAR(100) NOT NULL,
    topic       VARCHAR(50)  NOT NULL,
    question    TEXT         NOT NULL,
    answer      TEXT         NOT NULL,
    tags        JSONB        NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_topic ON interview_questions (topic);
CREATE INDEX IF NOT EXISTS idx_interview_questions_company ON interview_questions (company);
