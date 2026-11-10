-- ============================================================
-- SQL Lab Schema Migration for Neon DB
-- Schema: sql_lab
-- ============================================================

CREATE SCHEMA IF NOT EXISTS sql_lab;

-- Employees
CREATE TABLE IF NOT EXISTS sql_lab.employees (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) NOT NULL,
  department  VARCHAR(50) NOT NULL,
  salary      INTEGER NOT NULL,
  manager_id  INTEGER REFERENCES sql_lab.employees(id),
  joined_on   DATE NOT NULL
);

-- Departments
CREATE TABLE IF NOT EXISTS sql_lab.departments (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(50) NOT NULL,
  budget  INTEGER NOT NULL,
  head_id INTEGER
);

-- Projects
CREATE TABLE IF NOT EXISTS sql_lab.projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  department  VARCHAR(50) NOT NULL,
  status      VARCHAR(20) NOT NULL,  -- 'active', 'completed', 'on_hold'
  deadline    DATE NOT NULL
);

-- Employee-Project assignments
CREATE TABLE IF NOT EXISTS sql_lab.assignments (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES sql_lab.employees(id) ON DELETE CASCADE,
  project_id  INTEGER REFERENCES sql_lab.projects(id) ON DELETE CASCADE,
  role        VARCHAR(50) NOT NULL,
  hours       INTEGER NOT NULL
);

-- Orders (for aggregation and join practice)
CREATE TABLE IF NOT EXISTS sql_lab.orders (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES sql_lab.employees(id) ON DELETE SET NULL,
  product     VARCHAR(50) NOT NULL,
  quantity    INTEGER NOT NULL,
  amount      INTEGER NOT NULL,
  ordered_on  DATE NOT NULL
);

-- SQL Lab User Progress Tracking
CREATE TABLE IF NOT EXISTS sql_lab.progress (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id  INTEGER NOT NULL,
  revealed     BOOLEAN NOT NULL DEFAULT FALSE,
  solved       BOOLEAN NOT NULL DEFAULT FALSE,
  attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_sql_lab_progress_user ON sql_lab.progress (user_id);
