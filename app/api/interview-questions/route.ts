import { NextRequest, NextResponse, connection } from "next/server";
import { getPool } from "@/lib/db";
import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";
import { InterviewQuestion, InterviewTopic } from "@/lib/types";

// ---------------------------------------------------------------------------
// GET /api/interview-questions?topic=<topic>&search=<search>
// Fetches interview questions from Neon DB with localized fallback
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  await connection();

  try {
    const topic = request.nextUrl.searchParams.get("topic") || "All";
    const search = request.nextUrl.searchParams.get("search") || "";

    // 1. Neon PostgreSQL query
    if (process.env.DATABASE_URL) {
      try {
        const pool = getPool();
        let query = "SELECT id, company, topic, question, answer, tags FROM interview_questions";
        const conditions: string[] = [];
        const params: string[] = [];

        if (topic && topic.toLowerCase() !== "all") {
          params.push(topic);
          conditions.push(`LOWER(topic) = LOWER($${params.length})`);
        }

        if (search.trim()) {
          params.push(`%${search.trim().toLowerCase()}%`);
          conditions.push(`(
            LOWER(question) LIKE $${params.length} OR
            LOWER(answer) LIKE $${params.length} OR
            LOWER(company) LIKE $${params.length} OR
            LOWER(tags::text) LIKE $${params.length}
          )`);
        }

        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(" AND ")}`;
        }

        query += " ORDER BY id ASC";

        const limitParam = request.nextUrl.searchParams.get("limit");
        const pageParam = request.nextUrl.searchParams.get("page");
        if (limitParam) {
          const limit = Math.max(1, parseInt(limitParam, 10) || 10);
          const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
          const offset = (page - 1) * limit;
          params.push(String(limit), String(offset));
          query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
        }

        const { rows } = await pool.query(query, params);

        // If query ran and table exists (even if 0 rows matched filter)
        const questions: InterviewQuestion[] = rows.map((r) => ({
          id: String(r.id),
          company: r.company,
          topic: r.topic as InterviewTopic,
          question: r.question,
          answer: r.answer,
          tags: Array.isArray(r.tags) ? r.tags : JSON.parse(r.tags || "[]"),
        }));

        return NextResponse.json(questions, {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0",
            "X-Data-Source": "neon-postgres",
          },
        });
      } catch (dbError) {
        console.error("Neon DB query failed for interview questions, falling back to localized bank:", dbError);
      }
    }

    // 2. Localized bank fallback
    let result = INTERVIEW_QUESTIONS;
    if (topic && topic.toLowerCase() !== "all") {
      result = result.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(s) ||
          q.answer.toLowerCase().includes(s) ||
          q.company.toLowerCase().includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
      );
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Data-Source": "localized-fallback",
      },
    });
  } catch (error) {
    console.error("Error in /api/interview-questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview questions" },
      { status: 500 }
    );
  }
}
