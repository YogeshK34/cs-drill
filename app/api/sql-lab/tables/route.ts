import { NextRequest, NextResponse, connection } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

const ALLOWED_TABLES = ["employees", "departments", "projects", "assignments", "orders"];

export async function GET(request: NextRequest) {
  await connection();
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const namesParam = searchParams.get("names");

  let requestedTables: string[];
  if (namesParam) {
    requestedTables = namesParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => ALLOWED_TABLES.includes(t));
  } else {
    requestedTables = ALLOWED_TABLES;
  }

  if (requestedTables.length === 0) {
    requestedTables = ALLOWED_TABLES;
  }

  try {
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query("SET search_path TO sql_lab, public;");

      const tablesData: Record<
        string,
        { columns: string[]; rows: (string | number | boolean | null)[][]; rowCount: number }
      > = {};

      for (const table of requestedTables) {
        // Safe identifier interpolation from ALLOWED_TABLES whitelist
        const result = await client.query(`SELECT * FROM sql_lab."${table}" ORDER BY id ASC;`);
        const columns = result.fields ? result.fields.map((f: { name: string }) => f.name) : [];
        const rows = result.rows.map((row: Record<string, unknown>) =>
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

        tablesData[table] = {
          columns,
          rows,
          rowCount: result.rowCount || rows.length,
        };
      }

      return NextResponse.json({ tables: tablesData });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error("[GET /api/sql-lab/tables]", error);
    return NextResponse.json(
      { error: "Failed to fetch SQL Lab tables." },
      { status: 500 }
    );
  }
}
