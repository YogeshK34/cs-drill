import { Pool } from 'pg';

// Module-level singleton pool — reused across hot-reload and serverless invocations
let pool: Pool | undefined;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}
