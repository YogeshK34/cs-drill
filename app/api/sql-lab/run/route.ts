import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        { error: "Query cannot be empty." },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Execute within an enforced read-only transaction with a 5 second statement timeout
      await client.query("BEGIN;");
      await client.query("SET TRANSACTION READ ONLY;");
      await client.query("SET LOCAL statement_timeout = 5000;");
      await client.query("SET LOCAL search_path TO sql_lab, public;");

      const result = await client.query(query);

      // Rollback transaction to ensure zero mutations occur
      await client.query("ROLLBACK;");

      // Extract column metadata
      const columns = result.fields ? result.fields.map((f: { name: string }) => f.name) : [];

      // Convert rows to array-of-arrays format, capped at 100 rows
      const rawRows = result.rows || [];
      const cappedRows = rawRows.slice(0, 100);

      const rows = cappedRows.map((row: Record<string, unknown>) =>
        columns.map((col: string) => {
          const val = row[col];
          if (val instanceof Date) {
            return val.toISOString().split("T")[0];
          }
          if (val === null || val === undefined) {
            return null;
          }
          if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            return val;
          }
          return String(val);
        })
      );

      return NextResponse.json({
        columns,
        rows,
        rowCount: rawRows.length,
        isTruncated: rawRows.length > 100,
      });
    } catch (dbErr: unknown) {
      // Ensure rollback on error
      await client.query("ROLLBACK;").catch(() => {});

      const pgError = dbErr as { message?: string; code?: string };
      const errorMessage = pgError?.message || "An error occurred while executing the query.";
      const errorCode = pgError?.code;

      // Detect read-only transaction violation (Postgres error code 25006 or read-only text)
      if (
        errorCode === "25006" ||
        /read-only transaction/i.test(errorMessage) ||
        /cannot execute.*in a read-only transaction/i.test(errorMessage)
      ) {
        return NextResponse.json(
          { error: "⚠ Only SELECT queries are allowed in SQL Lab" },
          { status: 400 }
        );
      }

      // Check timeout
      if (errorCode === "57014" || /statement timeout/i.test(errorMessage)) {
        return NextResponse.json(
          { error: "Execution timeout: query exceeded 5000ms limit." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error("[POST /api/sql-lab/run]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
