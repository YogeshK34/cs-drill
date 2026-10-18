import { NextRequest, NextResponse, connection } from "next/server";
import { getPool } from "@/lib/db";
import { getQuestions } from "@/lib/questions";
import { Question } from "@/lib/types";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// GET /api/questions?topic=<topic>
// Priority: Anthropic Claude → PostgreSQL → localized fallback
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  await connection();

  try {
    const topic = request.nextUrl.searchParams.get("topic") || "Mixed";
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // -------------------------------------------------------------------------
    // 1. Anthropic Claude generation (if API key is set)
    // -------------------------------------------------------------------------
    if (apiKey && apiKey.trim() !== "") {
      try {
        const anthropic = new Anthropic({ apiKey: apiKey.trim() });
        const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

        const systemPrompt = `You are an expert Computer Science educator.
Generate exactly 20 multiple-choice questions for CS fundamentals interview preparation on the topic: "${topic}".
Output MUST be a valid JSON array of exactly 20 objects with no conversational intro, no markdown codeblocks, and no trailing comments:
[
  {
    "topic": "${topic}",
    "question": "Clear, precise question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of why this answer is correct"
  }
]
Requirements:
1. Each object must have: topic (string), question (string), options (array of exactly 4 strings), correct (0-indexed number 0, 1, 2, or 3), and explanation (string).
2. Distribute correct answers across indices 0, 1, 2, and 3.
3. Every question must be technically accurate.`;

        const userPrompt = `Generate the 20 MCQs for ${topic} as a pure JSON array.`;

        let message;
        try {
          message = await anthropic.messages.create({
            model: model,
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          });
        } catch (modelErr: unknown) {
          console.warn(`Model ${model} failed, attempting claude-3-5-sonnet-20241022 fallback...`, modelErr);
          message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          });
        }

        let fullText = "";
        for (const block of message.content) {
          if (block.type === "text") {
            fullText += block.text;
          }
        }

        const cleanedText = fullText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsedQuestions: Question[] = JSON.parse(cleanedText);

        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          return NextResponse.json(parsedQuestions, {
            status: 200,
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "X-Data-Source": "anthropic-claude",
            },
          });
        }
      } catch (anthropicError) {
        console.error("Anthropic API generation failed, falling back to PostgreSQL:", anthropicError);
      }
    }

    // -------------------------------------------------------------------------
    // 2. PostgreSQL persistent question bank
    // -------------------------------------------------------------------------
    if (process.env.DATABASE_URL) {
      try {
        const pool = getPool();
        let query: string;
        let params: string[] = [];

        if (topic.toLowerCase() === "mixed") {
          // 4 questions per topic, ordered randomly
          query = `
            (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'os'         ORDER BY RANDOM() LIMIT 4)
            UNION ALL
            (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'networks'   ORDER BY RANDOM() LIMIT 4)
            UNION ALL
            (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'dbms'       ORDER BY RANDOM() LIMIT 4)
            UNION ALL
            (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'oop'        ORDER BY RANDOM() LIMIT 4)
            UNION ALL
            (SELECT topic, question, options, correct, explanation FROM questions WHERE LOWER(topic) = 'dsa theory' ORDER BY RANDOM() LIMIT 4)
          `;
        } else {
          query = `
            SELECT topic, question, options, correct, explanation
            FROM questions
            WHERE LOWER(topic) = LOWER($1)
            ORDER BY RANDOM()
            LIMIT 20
          `;
          params = [topic];
        }

        const { rows } = await pool.query(query, params);

        if (rows.length > 0) {
          // Postgres returns JSONB options as already-parsed objects; cast to string[]
          const questions: Question[] = rows.map((row) => ({
            topic: row.topic,
            question: row.question,
            options: Array.isArray(row.options) ? row.options : JSON.parse(row.options),
            correct: Number(row.correct),
            explanation: row.explanation,
          }));

          return NextResponse.json(questions, {
            status: 200,
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "X-Data-Source": "postgres",
            },
          });
        }

        console.warn("PostgreSQL returned 0 rows — falling back to localized bank. Run `pnpm seed` to seed the DB.");
      } catch (dbError) {
        console.error("PostgreSQL query failed, falling back to localized bank:", dbError);
      }
    }

    // -------------------------------------------------------------------------
    // 3. Localized question bank fallback (guarantees 100% uptime with zero setup)
    // -------------------------------------------------------------------------
    const fallbackQuestions = getQuestions(topic, 20);
    return NextResponse.json(fallbackQuestions, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Data-Source": "localized-bank",
      },
    });
  } catch (error) {
    console.error("Error in /api/questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
