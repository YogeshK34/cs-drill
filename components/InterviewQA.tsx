"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { InterviewQuestion, InterviewTopic } from "@/lib/types";

const INTERVIEW_TOPICS: Array<InterviewTopic | "All"> = [
  "All",
  "OS",
  "Networks",
  "DBMS",
  "OOP",
  "DSA Theory",
];

const PAGE_SIZE_OPTIONS = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "All", value: 0 },
];

export default function InterviewQA() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("neon-postgres");

  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const listTopRef = useRef<HTMLDivElement>(null);

  // Fetch interview questions from Neon DB via API
  const fetchQuestions = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/interview-questions");
      if (!res.ok) {
        throw new Error(`Failed to load interview questions (Status: ${res.status})`);
      }
      const data: InterviewQuestion[] = await res.json();
      setQuestions(data);
      const src = res.headers.get("X-Data-Source") || "neon-postgres";
      setDataSource(src);
    } catch (err: unknown) {
      console.error("Fetch interview questions error:", err);
      setError(err instanceof Error ? err.message : "Error loading interview questions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/interview-questions");
        if (!res.ok) {
          throw new Error(`Failed to load interview questions (Status: ${res.status})`);
        }
        const data: InterviewQuestion[] = await res.json();
        if (!ignore) {
          setQuestions(data);
          const src = res.headers.get("X-Data-Source") || "neon-postgres";
          setDataSource(src);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading interview questions");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter questions by topic and search keyword
  const filteredQuestions = useMemo(() => {
    let result = questions;

    if (selectedTopic !== "All") {
      result = result.filter(
        (q) => q.topic.toLowerCase() === selectedTopic.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [questions, selectedTopic, searchQuery]);

  // Pagination calculations
  const totalItems = filteredQuestions.length;
  const isAll = pageSize === 0;
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedQuestions = useMemo(() => {
    if (isAll) return filteredQuestions;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, isAll, safeCurrentPage, pageSize]);

  const startRange = totalItems === 0 ? 0 : (safeCurrentPage - 1) * (isAll ? totalItems : pageSize) + 1;
  const endRange = isAll ? totalItems : Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (safeCurrentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages);
    }
    return pages;
  }, [safeCurrentPage, totalPages]);

  // Navigate to page with smooth scroll
  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Unique key per question for card expansion
  const getQuestionKey = (q: InterviewQuestion, fallbackIndex: number) =>
    q.id ? `id-${q.id}` : `${q.topic}-${q.company}-${fallbackIndex}`;

  // Toggle card expansion
  const toggleCard = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedKeys(
      new Set(paginatedQuestions.map((q, i) => getQuestionKey(q, i)))
    );
  };

  const handleCollapseAll = () => {
    setExpandedKeys(new Set());
  };

  const handleTopicChange = (topic: InterviewTopic | "All") => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery(tag);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Filter & Search Section */}
      <section className="mb-4 sm:mb-6" ref={listTopRef}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest">
            FILTER BY TOPIC
          </span>
          <div className="flex items-center gap-2">
            {dataSource === "neon-postgres" && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hidden xs:inline">
                NEON DB
              </span>
            )}
            <span className="font-mono text-[11px] sm:text-xs text-zinc-400">
              {totalItems > 0
                ? `${startRange}–${endRange} OF ${totalItems} QUESTIONS`
                : "0 QUESTIONS"}
            </span>
          </div>
        </div>

        {/* Topic filter chips - matching MCQ style */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {INTERVIEW_TOPICS.map((t) => {
            const active = selectedTopic === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTopicChange(t)}
                className={`shrink-0 font-mono text-xs px-3.5 py-2 sm:py-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation select-none ${
                  active
                    ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm ring-1 ring-zinc-300"
                    : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800/80 active:bg-zinc-800"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Search bar & Controls */}
        <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500 font-mono text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search question, company, or keyword (e.g. deadlock, vtable, java)..."
              className="w-full pl-9 pr-8 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 active:scale-95 transition cursor-pointer select-none"
            >
              Expand Page
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 active:scale-95 transition cursor-pointer select-none"
            >
              Collapse All
            </button>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-9 h-9 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <div className="font-mono text-sm text-zinc-300 tracking-wide">
            FETCHING QUESTIONS FROM NEON DB...
          </div>
          <div className="font-mono text-xs text-zinc-500 mt-1">
            SERVERLESS POSTGRES
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="my-auto p-5 sm:p-6 rounded-xl bg-rose-950/20 border border-rose-900/50 text-center">
          <div className="font-mono text-xs text-rose-400 mb-2 font-semibold">[ERROR LOADING INTERVIEW QUESTIONS]</div>
          <div className="text-zinc-200 text-sm mb-4 leading-relaxed">{error}</div>
          <button
            onClick={fetchQuestions}
            className="w-full sm:w-auto font-mono text-xs px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 transition-colors active:scale-95 touch-manipulation cursor-pointer"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Flashcards List */}
      {!loading && !error && (
        <div className="space-y-3 sm:space-y-4 pb-8">
          {paginatedQuestions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center my-6">
              <div className="font-mono text-sm text-zinc-400 mb-2">No interview questions match your filter</div>
              <p className="text-xs text-zinc-500 max-w-md mx-auto mb-4">
                Try adjusting your search terms or selecting a different topic.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleTopicChange("All");
                  handleSearchChange("");
                }}
                className="font-mono text-xs px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {paginatedQuestions.map((q, idx) => {
                const cardKey = getQuestionKey(q, idx);
                const isExpanded = expandedKeys.has(cardKey);

                return (
                  <div
                    key={cardKey}
                    onClick={() => toggleCard(cardKey)}
                    className={`group rounded-2xl border transition-all duration-200 cursor-pointer touch-manipulation select-none ${
                      isExpanded
                        ? "bg-zinc-900/80 border-zinc-700/80 shadow-lg shadow-black/40"
                        : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/70 hover:bg-zinc-900/75"
                    } p-4 sm:p-5`}
                  >
                    {/* Header row: Company badge, Topic badge, Reveal status */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Company Badge */}
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-800/90 border border-zinc-700 text-zinc-200 font-medium tracking-tight">
                          <span>🏢</span>
                          <span>{q.company}</span>
                        </span>

                        {/* Topic Badge */}
                        <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 font-semibold uppercase tracking-wider">
                          {q.topic}
                        </span>
                      </div>

                      {/* Toggle hint */}
                      <span className="font-mono text-[11px] text-zinc-400 group-hover:text-zinc-200 flex items-center gap-1 shrink-0 transition-colors">
                        <span>{isExpanded ? "Hide Answer" : "Reveal Answer"}</span>
                        <span className="text-xs transition-transform duration-200">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </span>
                    </div>

                    {/* Question */}
                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug">
                      {q.question}
                    </h3>

                    {/* Answer Section (revealed when expanded) */}
                    {isExpanded && (
                      <div className="mt-3.5 pt-3.5 border-t border-zinc-800/80 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="font-mono text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
                            [INTERVIEW ANSWER]
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                          {q.answer}
                        </p>

                        {/* Tags at bottom of the answer */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-3.5 pt-2.5 border-t border-zinc-800/50">
                          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mr-1">
                            Tags:
                          </span>
                          {q.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => handleTagClick(tag, e)}
                              title={`Filter by tag "${tag}"`}
                              className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition cursor-pointer active:scale-95"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Pagination Bar */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                {/* Page range & Page size selector */}
                <div className="flex items-center gap-3 text-zinc-400 flex-wrap justify-center sm:justify-start">
                  <span>
                    Showing <strong className="text-zinc-200">{startRange}–{endRange}</strong> of <strong className="text-zinc-200">{totalItems}</strong>
                  </span>

                  <div className="flex items-center gap-1 border border-zinc-800 rounded-lg p-0.5 bg-zinc-900/90 text-[11px]">
                    <span className="text-zinc-500 px-1.5 text-[10px] uppercase">Per page:</span>
                    {PAGE_SIZE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handlePageSizeChange(opt.value)}
                        className={`px-2 py-0.5 rounded transition cursor-pointer ${
                          pageSize === opt.value
                            ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pagination Controls (only shown when totalPages > 1) */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => goToPage(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition active:scale-95 cursor-pointer select-none"
                    >
                      ← Prev
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                      {pageNumbers.map((p, i) =>
                        p === "..." ? (
                          <span key={`dots-${i}`} className="px-1 text-zinc-600 select-none">
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${p}`}
                            type="button"
                            onClick={() => goToPage(p as number)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer select-none ${
                              safeCurrentPage === p
                                ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                                : "bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => goToPage(safeCurrentPage + 1)}
                      disabled={safeCurrentPage >= totalPages}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition active:scale-95 cursor-pointer select-none"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
