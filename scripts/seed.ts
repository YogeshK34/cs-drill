import { Pool } from 'pg';
import { QUESTION_BANK } from '../lib/questions';
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

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting full database seed into Neon DB...');

    // 1. Ensure tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id          SERIAL PRIMARY KEY,
        topic       VARCHAR(50)  NOT NULL,
        question    TEXT         NOT NULL,
        options     JSONB        NOT NULL,
        correct     INTEGER      NOT NULL CHECK (correct >= 0 AND correct <= 3),
        explanation TEXT         NOT NULL,
        created_at  TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions (topic);

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

    await client.query('BEGIN');

    // 2. Seed MCQ questions
    console.log('🌱 Seeding MCQ drill questions...');
    await client.query('TRUNCATE TABLE questions RESTART IDENTITY CASCADE');
    for (const q of QUESTION_BANK) {
      await client.query(
        `INSERT INTO questions (topic, question, options, correct, explanation)
         VALUES ($1, $2, $3::jsonb, $4, $5)`,
        [q.topic, q.question, JSON.stringify(q.options), q.correct, q.explanation]
      );
    }
    console.log(`✅ Seeded ${QUESTION_BANK.length} MCQ questions.`);

    // 3. Seed Interview Q&A questions
    console.log('🌱 Seeding Interview Q&A questions...');
    await client.query('TRUNCATE TABLE interview_questions RESTART IDENTITY CASCADE');
    for (const iq of INTERVIEW_QUESTIONS) {
      await client.query(
        `INSERT INTO interview_questions (company, topic, question, answer, tags)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [iq.company, iq.topic, iq.question, iq.answer, JSON.stringify(iq.tags)]
      );
    }
    console.log(`✅ Seeded ${INTERVIEW_QUESTIONS.length} interview questions.`);

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
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
