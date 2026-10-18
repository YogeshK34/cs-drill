import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

// ---------------------------------------------------------------------------
// PATCH /api/notes/[id] — update title and/or content of a note
// ---------------------------------------------------------------------------
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const noteId = parseInt(id, 10);
  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid note ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const pool = getPool();

    // Build a dynamic SET clause so partial updates work (title-only or content-only)
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (body.title !== undefined) {
      const safeTitle = body.title.toString().trim().slice(0, 255) || "Untitled";
      fields.push(`title = $${idx++}`);
      values.push(safeTitle);
    }
    if (body.content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(body.content.toString());
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    // Always bump updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Scope to user_id so users can only edit their own notes
    const { rows } = await pool.query(
      `UPDATE notes SET ${fields.join(", ")}
       WHERE id = $${idx++} AND user_id = $${idx}
       RETURNING id, title, content, created_at, updated_at`,
      [...values, noteId, session.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/notes/:id]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/notes/[id] — delete a note
// ---------------------------------------------------------------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const noteId = parseInt(id, 10);
  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid note ID." }, { status: 400 });
  }

  try {
    const pool = getPool();
    const { rowCount } = await pool.query(
      `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
      [noteId, session.userId]
    );

    if (!rowCount) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted." }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/notes/:id]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
