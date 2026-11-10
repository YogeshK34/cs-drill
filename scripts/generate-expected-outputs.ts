import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import { SQL_QUESTIONS } from '../lib/sql-questions';

if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function generate() {
  const client = await pool.connect();
  const outputs: Record<number, { columns: string[]; rows: (string | number | boolean | null)[][] }> = {};

  try {
    for (const q of SQL_QUESTIONS) {
      console.log(`Running Q${q.id}: ${q.title}...`);
      await client.query('BEGIN;');
      await client.query('SET TRANSACTION READ ONLY;');
      await client.query('SET LOCAL search_path TO sql_lab, public;');
      await client.query('SET LOCAL statement_timeout = 5000;');

      const result = await client.query(q.answer);
      await client.query('ROLLBACK;');

      const columns = result.fields ? result.fields.map((f) => f.name) : [];
      const rawRows = result.rows || [];
      const cappedRows = rawRows.slice(0, 100);

      const rows = cappedRows.map((row: Record<string, unknown>) =>
        columns.map((col: string) => {
          const val = row[col];
          if (val instanceof Date) {
            return val.toISOString().split('T')[0];
          }
          if (val === null || val === undefined) {
            return null;
          }
          if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
            return val;
          }
          return String(val);
        })
      );

      outputs[q.id] = { columns, rows };
    }

    const outputPath = path.resolve(process.cwd(), 'lib/sql-expected-outputs.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputs, null, 2), 'utf8');
    console.log(`✅ Successfully generated expected outputs for ${SQL_QUESTIONS.length} questions in ${outputPath}`);
  } catch (err) {
    console.error('Error generating outputs:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

generate();
