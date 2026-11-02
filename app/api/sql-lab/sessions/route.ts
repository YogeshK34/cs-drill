import { NextRequest, NextResponse, connection } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

// GET /api/sql-lab/sessions — fetch user's SQL Lab progress
export async function GET() {
  await connection();
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT question_id, revealed, attempted_at 
       FROM sql_lab.progress 
       WHERE user_id = $1`,
      [session.userId]
    );

    const progress: Record<number, { revealed: boolean; attemptedAt: string }> = {};
    for (const r of rows) {
      progress[r.question_id] = {
        revealed: r.revealed,
        attemptedAt: r.attempted_at,
      };
    }

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error("[GET /api/sql-lab/sessions]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// POST /api/sql-lab/sessions — record question attempt or answer reveal
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const questionId = Number(body?.questionId);
    const revealed = Boolean(body?.revealed);

    if (!questionId || isNaN(questionId)) {
      return NextResponse.json(
        { error: "Valid questionId is required." },
        { status: 400 }
      );
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO sql_lab.progress (user_id, question_id, revealed, attempted_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, question_id)
       DO UPDATE SET
         revealed = CASE WHEN EXCLUDED.revealed = TRUE THEN TRUE ELSE sql_lab.progress.revealed END,
         attempted_at = NOW()`,
      [session.userId, questionId, revealed]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[POST /api/sql-lab/sessions]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
