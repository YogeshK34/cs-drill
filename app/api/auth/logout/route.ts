import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

// POST /api/auth/logout
export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Logged out successfully." }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
