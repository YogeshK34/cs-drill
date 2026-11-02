"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  SQL_LEVELS,
  SQLLevel,
  SQLQuestion,
  getQuestionsByLevel,
} from "@/lib/sql-questions";

interface TableData {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
}

interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount?: number;
  error?: string;
  isTruncated?: boolean;
}

interface ProgressItem {
  revealed: boolean;
  attemptedAt?: string;
}

export default function SqlLab() {
  const [level, setLevel] = useState<SQLLevel>("beginner");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Terminal state
  const [userQuery, setUserQuery] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<QueryResult | null>(null);

  // Table viewer state
  const [tablesData, setTablesData] = useState<Record<string, TableData>>({});
  const [loadingTables, setLoadingTables] = useState<boolean>(true);
  const [activeTable, setActiveTable] = useState<string>("employees");

  // User progress state
  const [progress, setProgress] = useState<Record<number, ProgressItem>>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const levelQuestions = getQuestionsByLevel(level);
  const currentQuestion: SQLQuestion = levelQuestions[questionIndex] || levelQuestions[0];

  // Fetch user's saved progress on mount
  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch("/api/sql-lab/sessions");
        if (res.ok) {
          const data = await res.json();
          if (data?.progress) {
            setProgress(data.progress);
          }
        }
      } catch (err) {
        console.warn("Could not load SQL Lab progress:", err);
      }
    }
    fetchProgress();
  }, []);

  // Fetch table data from Neon on mount
  useEffect(() => {
    let isCancelled = false;
    async function loadTables() {
      try {
        const res = await fetch("/api/sql-lab/tables");
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data?.tables) {
            setTablesData(data.tables);
          }
        }
      } catch (err) {
        console.error("Failed to load tables data:", err);
      } finally {
        if (!isCancelled) {
          setLoadingTables(false);
        }
      }
    }
    loadTables();
    return () => {
      isCancelled = true;
    };
  }, []);

  const switchQuestion = useCallback((targetLevel: SQLLevel, targetIndex: number) => {
    setLevel(targetLevel);
    setQuestionIndex(targetIndex);
    setShowHint(false);
    setShowAnswer(false);
    setOutput(null);
    setUserQuery("");
    const targetQuestions = getQuestionsByLevel(targetLevel);
    const targetQ = targetQuestions[targetIndex] || targetQuestions[0];
    if (targetQ?.tables?.[0]) {
      setActiveTable(targetQ.tables[0]);
    }
  }, []);

  // Execute user query
  const handleRunQuery = async () => {
    const trimmed = userQuery.trim();
    if (!trimmed || running) return;

    setRunning(true);
    setOutput(null);

    try {
      const res = await fetch("/api/sql-lab/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setOutput({
          columns: [],
          rows: [],
          error: data.error || `Execution failed with status ${res.status}`,
        });
      } else {
        setOutput({
          columns: data.columns || [],
          rows: data.rows || [],
          rowCount: data.rowCount ?? data.rows?.length ?? 0,
          isTruncated: data.isTruncated,
        });

        // Mark question as attempted in progress
        if (currentQuestion) {
          fetch("/api/sql-lab/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: currentQuestion.id, revealed: false }),
          }).catch(() => {});

          setProgress((prev) => ({
            ...prev,
            [currentQuestion.id]: {
              revealed: prev[currentQuestion.id]?.revealed || false,
              attemptedAt: new Date().toISOString(),
            },
          }));
        }
      }
    } catch (err: unknown) {
      setOutput({
        columns: [],
        rows: [],
        error: (err as Error)?.message || "Network error while running query.",
      });
    } finally {
      setRunning(false);
    }
  };

  // Reveal answer
  const handleToggleAnswer = async () => {
    const nextState = !showAnswer;
    setShowAnswer(nextState);

    if (nextState && currentQuestion) {
      // Record revealed answer in database
      try {
        await fetch("/api/sql-lab/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: currentQuestion.id, revealed: true }),
        });

        setProgress((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            revealed: true,
            attemptedAt: new Date().toISOString(),
          },
        }));
      } catch (err) {
        console.warn("Could not record answer reveal:", err);
      }
    }
  };

  // Copy or load answer into terminal
  const handleLoadAnswerIntoEditor = () => {
    if (currentQuestion) {
      setUserQuery(currentQuestion.answer);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Keyboard shortcut listener for Ctrl+Enter / Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunQuery();
    }
  };

  // Level selector click
  const handleSelectLevel = (newLevel: SQLLevel) => {
    switchQuestion(newLevel, 0);
  };

  // Navigation handlers
  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      switchQuestion(level, questionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < levelQuestions.length) {
      switchQuestion(level, questionIndex + 1);
    }
  };

  const currentTableData = tablesData[activeTable];
  const isQuestionRevealed = currentQuestion && progress[currentQuestion.id]?.revealed;
  const isQuestionAttempted = currentQuestion && !!progress[currentQuestion.id];

  return (
    <div className="flex-1 flex flex-col space-y-4 sm:space-y-6 pb-6">
      {/* 1. LEVEL SELECTOR */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest">
            SQL MASTERY LEVELS
          </span>
          <span className="font-mono text-[11px] sm:text-xs text-zinc-400">
            {levelQuestions.length} QUESTIONS IN LEVEL
          </span>
        </div>

        {/* Horizontal scrollable chips on mobile / wrap on desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {SQL_LEVELS.map((lvl) => {
            const active = level === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(lvl.id)}
                className={`shrink-0 font-mono text-xs px-3.5 py-2 sm:py-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation select-none flex items-center gap-1.5 ${
                  active
                    ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm ring-1 ring-zinc-300"
                    : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800/80 active:bg-zinc-800"
                }`}
              >
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. QUESTION PANEL & NAVIGATION */}
      <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
        {/* Navigation & Question Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
              {level}
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-zinc-400">
              QUESTION {questionIndex + 1} OF {levelQuestions.length}
            </span>
            {isQuestionRevealed ? (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                REVEALED
              </span>
            ) : isQuestionAttempted ? (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                ATTEMPTED
              </span>
            ) : null}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={questionIndex === 0}
              className="px-2.5 py-1 rounded-md bg-zinc-850 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-750 text-zinc-300 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              &larr; Prev
            </button>
            <span className="text-zinc-500 px-1">
              {questionIndex + 1}/{levelQuestions.length}
            </span>
            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={questionIndex + 1 >= levelQuestions.length}
              className="px-2.5 py-1 rounded-md bg-zinc-850 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-750 text-zinc-300 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>
        </div>

        {/* Question Title & Description */}
        <h2 className="text-base sm:text-lg font-semibold text-white mb-1.5">
          {currentQuestion.title}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
          {currentQuestion.description}
        </p>

        {/* Relevant Tables Badges & Hint Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] text-zinc-500 uppercase">
              Tables:
            </span>
            {currentQuestion.tables.map((tbl) => (
              <button
                key={tbl}
                type="button"
                onClick={() => setActiveTable(tbl)}
                className={`font-mono text-xs px-2 py-0.5 rounded transition cursor-pointer border ${
                  activeTable === tbl
                    ? "bg-zinc-800 text-emerald-400 border-emerald-500/40"
                    : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {tbl}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-amber-400/90 hover:text-amber-300 hover:border-amber-500/40 transition cursor-pointer flex items-center gap-1"
          >
            <span>💡</span>
            <span>{showHint ? "Hide hint" : "Show hint"}</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed">
            <span className="font-bold text-amber-400 mr-1.5">HINT:</span>
            {currentQuestion.hint}
          </div>
        )}
      </section>

      {/* 3. TABLE VIEWER (DB CONSOLE STYLE) */}
      <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Table Viewer Header */}
        <div className="px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-xs font-semibold uppercase text-zinc-300">
              SCHEMA: sql_lab.{activeTable}
            </span>
            {currentTableData && (
              <span className="font-mono text-[11px] text-zinc-500">
                ({currentTableData.rowCount} rows)
              </span>
            )}
          </div>

          {/* Table Switcher Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {["employees", "departments", "projects", "assignments", "orders"].map(
              (tableName) => {
                const isActive = activeTable === tableName;
                const isRelevant = currentQuestion.tables.includes(tableName);
                return (
                  <button
                    key={tableName}
                    type="button"
                    onClick={() => setActiveTable(tableName)}
                    className={`font-mono text-[11px] px-2.5 py-1 rounded transition cursor-pointer ${
                      isActive
                        ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                        : isRelevant
                        ? "text-emerald-400/90 hover:bg-zinc-850 hover:text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    {tableName}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Table Body Area */}
        {loadingTables ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2"></div>
            Loading schema data from Neon...
          </div>
        ) : currentTableData ? (
          <div className="max-h-60 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="sticky top-0 bg-zinc-950 border-b border-zinc-800 text-zinc-500 select-none uppercase tracking-wider">
                <tr>
                  {currentTableData.columns.map((col) => (
                    <th key={col} className="px-3.5 py-2 font-semibold whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {currentTableData.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`transition-colors hover:bg-zinc-800/50 ${
                      rIdx % 2 === 0 ? "bg-zinc-900/40" : "bg-zinc-900/10"
                    }`}
                  >
                    {row.map((val, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3.5 py-1.5 whitespace-nowrap text-zinc-300 ${
                          val === null ? "text-zinc-600 italic" : ""
                        }`}
                      >
                        {val === null ? "null" : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-500 font-mono text-xs">
            Table not found.
          </div>
        )}
      </section>

      {/* 4. TERMINAL INPUT */}
      <section className="bg-[#0d1117] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header Bar */}
        <div className="px-4 py-2.5 bg-[#090d13] border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="font-mono text-xs text-zinc-400 font-semibold tracking-wide ml-2">
              postgres@neon / sql_lab
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">
              Ctrl+Enter to run
            </span>
            <button
              type="button"
              onClick={() => setUserQuery("")}
              disabled={!userQuery}
              className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Terminal Prompt & Textarea */}
        <div className="p-3.5 sm:p-4 flex items-start gap-2.5">
          <span className="font-mono text-xs text-emerald-500 select-none pt-1">
            $
          </span>
          <textarea
            ref={textareaRef}
            rows={3}
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`-- Write SQL query here...\nSELECT * FROM ${currentQuestion.tables[0] || "employees"};`}
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-[#4ade80] placeholder-zinc-600 focus:outline-none resize-y leading-relaxed selection:bg-emerald-950 selection:text-emerald-200"
            spellCheck={false}
          />
        </div>

        {/* Terminal Actions Bar */}
        <div className="px-4 py-2.5 bg-[#090d13] border-t border-zinc-800/80 flex items-center justify-between">
          <span className="font-mono text-[11px] text-zinc-500">
            Read-only transaction &bull; 5000ms limit
          </span>

          <button
            type="button"
            onClick={handleRunQuery}
            disabled={running || !userQuery.trim()}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-mono text-xs font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:pointer-events-none active:scale-95"
          >
            {running ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></div>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <span>▶ Run</span>
                <span className="hidden sm:inline font-normal text-[10px] opacity-75">
                  [Ctrl+↵]
                </span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 5. OUTPUT PANEL */}
      <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold uppercase text-zinc-400">
            QUERY OUTPUT
          </span>
          {output && !output.error && (
            <span className="font-mono text-xs text-emerald-400 font-semibold">
              {output.rowCount} {output.rowCount === 1 ? "row" : "rows"} returned
              {output.isTruncated && " (capped at 100)"}
            </span>
          )}
        </div>

        <div className="p-0">
          {!output ? (
            <div className="p-6 font-mono text-xs text-zinc-600 italic">
              -- run a query to see output
            </div>
          ) : output.error ? (
            <div className="p-4 sm:p-5 bg-rose-950/20 border-b border-rose-900/30 font-mono text-xs text-rose-400 leading-relaxed whitespace-pre-wrap">
              {output.error}
            </div>
          ) : output.rows.length === 0 ? (
            <div className="p-6 font-mono text-xs text-zinc-500">
              Query executed successfully &bull; 0 rows returned
            </div>
          ) : (
            <div className="max-h-64 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead className="sticky top-0 bg-zinc-950 border-b border-zinc-800 text-zinc-500 select-none uppercase tracking-wider">
                  <tr>
                    {output.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-3.5 py-2 font-semibold whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {output.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={`hover:bg-zinc-800/50 transition-colors ${
                        rIdx % 2 === 0 ? "bg-zinc-900/40" : "bg-zinc-900/10"
                      }`}
                    >
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-3.5 py-1.5 whitespace-nowrap text-white ${
                            val === null ? "text-zinc-600 italic" : ""
                          }`}
                        >
                          {val === null ? "null" : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 6. ANSWER REVEAL */}
      <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="font-mono text-xs font-semibold text-zinc-300 block mb-0.5">
              SOLUTION & PEDAGOGY
            </span>
            <span className="text-xs text-zinc-500">
              Compare your approach with the canonical SQL solution.
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleAnswer}
            className={`font-mono text-xs px-4 py-2 rounded-xl transition cursor-pointer border font-semibold ${
              showAnswer
                ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                : "bg-zinc-100 hover:bg-white text-zinc-950 border-zinc-200 shadow-sm"
            }`}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
        </div>

        {showAnswer && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3">
            {/* Answer Code Box */}
            <div className="relative bg-[#0d1117] border border-zinc-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  CANONICAL QUERY
                </span>
                <button
                  type="button"
                  onClick={handleLoadAnswerIntoEditor}
                  className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300 transition cursor-pointer flex items-center gap-1"
                >
                  <span>⚡ Load into terminal</span>
                </button>
              </div>
              <pre className="font-mono text-xs sm:text-sm text-[#4ade80] overflow-x-auto whitespace-pre-wrap select-all">
                {currentQuestion.answer}
              </pre>
            </div>

            {/* Explanation Box */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                EXPLANATION & TAKEAWAY
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
