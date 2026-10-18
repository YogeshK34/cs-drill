import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

// ---------------------------------------------------------------------------
// GET /api/notes — list all notes for the authenticated user (newest first)
// ---------------------------------------------------------------------------
export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, title, content, created_at, updated_at
       FROM notes
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [session.userId]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("[GET /api/notes]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/notes — create a new note
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();

    const safeTitle = (title ?? "Untitled").toString().trim().slice(0, 255) || "Untitled";
    const safeContent = (content ?? "").toString();

    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO notes (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, created_at, updated_at`,
      [session.userId, safeTitle, safeContent]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("[POST /api/notes]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
