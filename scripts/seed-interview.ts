import { Pool } from 'pg';
import { INTERVIEW_QUESTIONS } from '../lib/interview-questions';

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

export async function seedInterviewQuestions() {
  const client = await pool.connect();
  try {
    console.log('🌱 Creating interview_questions table if needed...');
    await client.query(`
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
    `);

    console.log('🌱 Starting interview questions seed into Neon DB...');
    await client.query('BEGIN');

    // Idempotent re-seed: truncate table
    await client.query('TRUNCATE TABLE interview_questions RESTART IDENTITY CASCADE');

    for (const q of INTERVIEW_QUESTIONS) {
      await client.query(
        `INSERT INTO interview_questions (company, topic, question, answer, tags)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [q.company, q.topic, q.question, q.answer, JSON.stringify(q.tags)]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Seeded ${INTERVIEW_QUESTIONS.length} interview questions into Neon DB successfully.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Interview questions seed failed, rolled back:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Direct execution support
if (require.main === module || !process.env.SEED_IMPORTED) {
  seedInterviewQuestions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
