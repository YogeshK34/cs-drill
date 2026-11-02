import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

// Automatically load .env.local if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is not defined in environment or .env.local');
  process.exit(1);
}

const isRemote =
  connectionString.includes('neon.tech') ||
  connectionString.includes('sslmode=require') ||
  process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function runSeed() {
  const client = await pool.connect();
  try {
    console.log('🚀 Connecting to Neon DB...');

    // 1. Run schema migration
    const schemaSqlPath = path.resolve(__dirname, 'sql-lab-schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    console.log('📦 Applying schema migration scripts/sql-lab-schema.sql...');
    await client.query(schemaSql);

    console.log('🧹 Truncating existing sql_lab tables...');
    await client.query(`
      TRUNCATE TABLE 
        sql_lab.assignments,
        sql_lab.orders,
        sql_lab.projects,
        sql_lab.departments,
        sql_lab.employees
      RESTART IDENTITY CASCADE;
    `);

    console.log('🌱 Seeding departments...');
    await client.query(`
      INSERT INTO sql_lab.departments (id, name, budget, head_id) VALUES
      (1, 'Engineering', 850000, 1),
      (2, 'Marketing', 350000, 6),
      (3, 'Sales', 500000, 9),
      (4, 'HR', 200000, 13),
      (5, 'Finance', 400000, 15);
      SELECT setval('sql_lab.departments_id_seq', 5);
    `);

    console.log('🌱 Seeding employees (18 realistic records)...');
    await client.query(`
      INSERT INTO sql_lab.employees (id, name, department, salary, manager_id, joined_on) VALUES
      (1, 'Alice Johnson', 'Engineering', 120000, NULL, '2021-03-15'),
      (2, 'Bob Smith', 'Engineering', 95000, 1, '2021-06-01'),
      (3, 'Charlie Brown', 'Engineering', 82000, 1, '2022-01-10'),
      (4, 'Diana Prince', 'Engineering', 105000, 1, '2021-09-20'),
      (5, 'Evan Wright', 'Engineering', 72000, 2, '2023-04-12'),
      (6, 'Fiona Gallagher', 'Marketing', 88000, NULL, '2020-11-05'),
      (7, 'George Clark', 'Marketing', 62000, 6, '2022-08-15'),
      (8, 'Hannah Abbott', 'Marketing', 58000, 6, '2023-02-01'),
      (9, 'Ian Malcolm', 'Sales', 92000, NULL, '2020-05-18'),
      (10, 'Julia Roberts', 'Sales', 75000, 9, '2021-10-11'),
      (11, 'Kevin Bacon', 'Sales', 68000, 9, '2022-12-01'),
      (12, 'Laura Croft', 'Sales', 81000, 9, '2021-04-22'),
      (13, 'Michael Scott', 'HR', 70000, NULL, '2019-01-15'),
      (14, 'Nina Simone', 'HR', 52000, 13, '2023-05-10'),
      (15, 'Oscar Martinez', 'Finance', 98000, NULL, '2019-08-20'),
      (16, 'Pam Beesly', 'Finance', 65000, 15, '2022-03-14'),
      (17, 'Quentin Tarantino', 'Engineering', 115000, 1, '2020-02-01'),
      (18, 'Rachel Green', 'Marketing', 64000, 6, '2023-07-01');
      SELECT setval('sql_lab.employees_id_seq', 18);
    `);

    console.log('🌱 Seeding projects (15 records)...');
    await client.query(`
      INSERT INTO sql_lab.projects (id, title, department, status, deadline) VALUES
      (1, 'Cloud Migration', 'Engineering', 'active', '2026-12-31'),
      (2, 'AI Chatbot', 'Engineering', 'active', '2026-10-15'),
      (3, 'Security Audit', 'Engineering', 'completed', '2026-03-01'),
      (4, 'Brand Redesign', 'Marketing', 'completed', '2026-02-15'),
      (5, 'Q3 Ad Campaign', 'Marketing', 'active', '2026-09-30'),
      (6, 'SEO Optimization', 'Marketing', 'on_hold', '2026-11-01'),
      (7, 'Enterprise CRM', 'Sales', 'active', '2026-11-30'),
      (8, 'Global Expansion', 'Sales', 'on_hold', '2027-01-31'),
      (9, 'Lead Scoring', 'Sales', 'completed', '2026-01-20'),
      (10, 'Employee Wellness', 'HR', 'active', '2026-10-31'),
      (11, 'Payroll Upgrade', 'HR', 'completed', '2026-04-15'),
      (12, 'ERP Modernization', 'Finance', 'active', '2026-12-15'),
      (13, 'Tax Automation', 'Finance', 'completed', '2026-05-30'),
      (14, 'Mobile App Revamp', 'Engineering', 'active', '2026-11-15'),
      (15, 'Data Lakehouse', 'Engineering', 'on_hold', '2027-03-31');
      SELECT setval('sql_lab.projects_id_seq', 15);
    `);

    console.log('🌱 Seeding assignments (20 records)...');
    await client.query(`
      INSERT INTO sql_lab.assignments (id, employee_id, project_id, role, hours) VALUES
      (1, 1, 1, 'Lead Architect', 35),
      (2, 2, 1, 'DevOps Engineer', 40),
      (3, 4, 2, 'ML Specialist', 38),
      (4, 5, 2, 'Junior Dev', 30),
      (5, 3, 3, 'Security Analyst', 25),
      (6, 17, 3, 'Senior Auditor', 30),
      (7, 6, 4, 'Creative Director', 20),
      (8, 7, 5, 'Content Strategist', 40),
      (9, 8, 5, 'Social Media Lead', 35),
      (10, 18, 6, 'SEO Specialist', 25),
      (11, 9, 7, 'Sales Director', 15),
      (12, 10, 7, 'CRM Admin', 40),
      (13, 11, 8, 'Account Exec', 30),
      (14, 12, 9, 'Data Analyst', 35),
      (15, 13, 10, 'HR Coordinator', 20),
      (16, 14, 11, 'Payroll Analyst', 30),
      (17, 15, 12, 'Finance Lead', 25),
      (18, 16, 13, 'Tax Accountant', 35),
      (19, 2, 14, 'Mobile Engineer', 35),
      (20, 17, 15, 'Data Engineer', 40);
      SELECT setval('sql_lab.assignments_id_seq', 20);
    `);

    console.log('🌱 Seeding orders (20 records)...');
    await client.query(`
      INSERT INTO sql_lab.orders (id, employee_id, product, quantity, amount, ordered_on) VALUES
      (1, 1, 'Laptop Pro', 1, 2400, '2026-01-15'),
      (2, 2, '4K Monitor', 2, 800, '2026-01-18'),
      (3, 3, 'Mechanical Keyboard', 1, 150, '2026-02-02'),
      (4, 4, 'Ergonomic Chair', 1, 450, '2026-02-10'),
      (5, 5, 'Noise-Cancelling Headphones', 1, 300, '2026-02-14'),
      (6, 6, 'Laptop Pro', 1, 2400, '2026-02-20'),
      (7, 7, 'Webcam HD', 2, 180, '2026-03-01'),
      (8, 8, 'Standing Desk', 1, 650, '2026-03-05'),
      (9, 9, 'Laptop Pro', 1, 2400, '2026-03-12'),
      (10, 10, 'USB-C Dock', 2, 320, '2026-03-20'),
      (11, 11, '4K Monitor', 1, 400, '2026-04-02'),
      (12, 12, 'Ergonomic Chair', 1, 450, '2026-04-08'),
      (13, 13, 'Noise-Cancelling Headphones', 1, 300, '2026-04-15'),
      (14, 14, 'Mechanical Keyboard', 1, 150, '2026-04-22'),
      (15, 15, 'Standing Desk', 1, 650, '2026-05-03'),
      (16, 16, 'Laptop Pro', 1, 2400, '2026-05-10'),
      (17, 17, '4K Monitor', 2, 800, '2026-05-18'),
      (18, 1, 'USB-C Dock', 1, 160, '2026-06-01'),
      (19, 2, 'Noise-Cancelling Headphones', 1, 300, '2026-06-12'),
      (20, 10, 'Standing Desk', 1, 650, '2026-06-25');
      SELECT setval('sql_lab.orders_id_seq', 20);
    `);

    console.log('✅ SQL Lab database seeded successfully!');
  } catch (error) {
    console.error('❌ Error during SQL Lab seeding:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
