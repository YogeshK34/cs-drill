import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";
import { createSession } from "@/lib/session";

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // --- Validate ---
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length < 3 ||
      username.trim().length > 50
    ) {
      return NextResponse.json(
        { error: "Username must be between 3 and 50 characters." },
        { status: 400 }
      );
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const pool = getPool();

    // --- Check duplicate ---
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username.trim()]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 409 }
      );
    }

    // --- Hash & insert ---
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username.trim(), passwordHash]
    );

    const user = rows[0];

    // --- Create session ---
    await createSession(user.id, user.username);

    return NextResponse.json(
      { message: "Account created successfully.", username: user.username },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
