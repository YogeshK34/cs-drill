import { Pool } from 'pg';
import { QUESTION_BANK } from '../lib/questions';

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://drilluser:drillpassword@localhost:5433/cs_drill';

const isRemote =
  connectionString.includes('neon.tech') ||
  connectionString.includes('sslmode=require');

const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting seed...');
    await client.query('BEGIN');

    // Clear existing questions before re-seeding (idempotent)
    await client.query('TRUNCATE TABLE questions RESTART IDENTITY CASCADE');

    for (const q of QUESTION_BANK) {
      await client.query(
        `INSERT INTO questions (topic, question, options, correct, explanation)
         VALUES ($1, $2, $3::jsonb, $4, $5)`,
        [q.topic, q.question, JSON.stringify(q.options), q.correct, q.explanation]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Seeded ${QUESTION_BANK.length} questions successfully.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed, rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
