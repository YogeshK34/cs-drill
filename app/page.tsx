"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Question, Topic } from "@/lib/types";
import InterviewQA from "@/components/InterviewQA";

const TOPICS: Topic[] = ["Mixed", "OS", "Networks", "DBMS", "OOP", "DSA Theory"];
const QUIZ_STORAGE_KEY = "cs_drill_active_quiz_v1";

export default function Home() {
  const [mode, setMode] = useState<"mcq" | "interview">("mcq");
  const [topic, setTopic] = useState<Topic>("Mixed");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Performance and statistics
  const [score, setScore] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Per-question results track: 'correct' | 'wrong' | 'skipped'
  const [history, setHistory] = useState<Array<"correct" | "wrong" | "skipped">>([]);

  const hasInitialized = useRef(false);

  // Fetch a fresh batch of questions
  const loadQuestions = useCallback(async (targetTopic: Topic) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/questions?topic=${encodeURIComponent(targetTopic)}`);
      if (!res.ok) {
        throw new Error(`Failed to load questions (Status: ${res.status})`);
      }
      const data: Question[] = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No questions returned");
      }

      setTopic(targetTopic);
      setQuestions(data);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsSkipped(false);
      setScore(0);
      setWrongCount(0);
      setSkippedCount(0);
      setCurrentStreak(0);
      setMaxStreak(0);
      setIsComplete(false);
      setHistory([]);
    } catch (err: unknown) {
      console.error("Fetch questions error:", err);
      setError(err instanceof Error ? err.message : "Error loading questions");
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore quiz on mount from localStorage (prevents reset on refresh or returning from /notes)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          setTopic(parsed.topic || "Mixed");
          setQuestions(parsed.questions);
          setCurrentIndex(parsed.currentIndex ?? 0);
          setSelectedOption(parsed.selectedOption ?? null);
          setIsAnswered(parsed.isAnswered ?? false);
          setIsSkipped(parsed.isSkipped ?? false);
          setScore(parsed.score ?? 0);
          setWrongCount(parsed.wrongCount ?? 0);
          setSkippedCount(parsed.skippedCount ?? 0);
          setCurrentStreak(parsed.currentStreak ?? 0);
          setMaxStreak(parsed.maxStreak ?? 0);
          setIsComplete(parsed.isComplete ?? false);
          setHistory(parsed.history ?? []);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to restore quiz from localStorage:", e);
    }

    // If no saved quiz exists, load initial questions
    loadQuestions(topic);
  }, [topic, loadQuestions]);

  // Persist quiz state to localStorage whenever it changes
  useEffect(() => {
    if (!hasInitialized.current || questions.length === 0) return;

    try {
      const stateToSave = {
        topic,
        questions,
        currentIndex,
        selectedOption,
        isAnswered,
        isSkipped,
        score,
        wrongCount,
        skippedCount,
        currentStreak,
        maxStreak,
        isComplete,
        history,
      };
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed to save quiz to localStorage:", e);
    }
  }, [
    topic,
    questions,
    currentIndex,
    selectedOption,
    isAnswered,
    isSkipped,
    score,
    wrongCount,
    skippedCount,
    currentStreak,
    maxStreak,
    isComplete,
    history,
  ]);

  // Explicit restart / refresh of quiz
  const handleRefreshQuiz = useCallback(() => {
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {}
    loadQuestions(topic);
  }, [topic, loadQuestions]);

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {}
    loadQuestions(topic);
  }, [topic, loadQuestions]);

  // Switch topic
  const handleSelectTopic = useCallback(
    (newTopic: Topic) => {
      if (newTopic === topic && questions.length > 0 && !isComplete) return;
      try {
        localStorage.removeItem(QUIZ_STORAGE_KEY);
      } catch {}
      loadQuestions(newTopic);
    },
    [topic, questions.length, isComplete, loadQuestions]
  );

  const currentQuestion = questions[currentIndex];

  // Handle selecting an option (0, 1, 2, 3)
  const handleSelectOption = useCallback(
    (index: number) => {
      if (isAnswered || loading || !currentQuestion) return;

      setSelectedOption(index);
      setIsAnswered(true);
      setIsSkipped(false);

      if (index === currentQuestion.correct) {
        setScore((prev) => prev + 1);
        setCurrentStreak((prev) => {
          const next = prev + 1;
          setMaxStreak((m) => Math.max(m, next));
          return next;
        });
        setHistory((prev) => [...prev, "correct"]);
      } else {
        setWrongCount((prev) => prev + 1);
        setCurrentStreak(0);
        setHistory((prev) => [...prev, "wrong"]);
      }
    },
    [isAnswered, loading, currentQuestion]
  );

  // Handle skipping a question
  const handleSkip = useCallback(() => {
    if (isAnswered || loading || !currentQuestion) return;

    setSelectedOption(null);
    setIsAnswered(true);
    setIsSkipped(true);
    setSkippedCount((prev) => prev + 1);
    setCurrentStreak(0);
    setHistory((prev) => [...prev, "skipped"]);
  }, [isAnswered, loading, currentQuestion]);

  // Handle advancing to the next question or completing the drill
  const handleNext = useCallback(() => {
    if (!isAnswered || loading) return;

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsSkipped(false);
    } else {
      setIsComplete(true);
    }
  }, [isAnswered, loading, currentIndex, questions.length]);

  // Keyboard shortcut listener (for desktop / hardware keyboard users)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (mode !== "mcq") return;

      const key = e.key.toLowerCase();

      // If drill is complete
      if (isComplete) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleRestart();
        }
        return;
      }

      if (loading) return;

      if (!isAnswered) {
        if (key === "a") {
          e.preventDefault();
          handleSelectOption(0);
        } else if (key === "b") {
          e.preventDefault();
          handleSelectOption(1);
        } else if (key === "c") {
          e.preventDefault();
          handleSelectOption(2);
        } else if (key === "d") {
          e.preventDefault();
          handleSelectOption(3);
        } else if (e.key === " " || key === "space") {
          e.preventDefault();
          handleSkip();
        }
      } else {
        if (e.key === "Enter" || e.key === " " || key === "space") {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, isComplete, loading, isAnswered, handleSelectOption, handleSkip, handleNext, handleRestart]);

  // Progress percentage
  const totalQuestions = questions.length || 20;
  const progressPercent = Math.min(
    100,
    Math.round(((currentIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100)
  );

  return (
    <div className="min-h-dvh flex flex-col bg-[#09090b] text-zinc-100 selection:bg-zinc-800 touch-manipulation">
      {/* Top Header - Mobile and Android optimized */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Logo & Current Mode / Topic */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 shrink-0">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              cs-drill
            </span>
            <span className="text-zinc-600 font-mono text-xs">/</span>
            <span className="font-mono text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider truncate max-w-[90px] sm:max-w-none">
              {mode === "mcq" ? topic : "Q&A"}
            </span>
          </div>

          {/* Mode Switcher - Desktop */}
          <div className="hidden sm:inline-flex p-0.5 sm:p-1 bg-zinc-900/90 border border-zinc-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setMode("mcq")}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                mode === "mcq"
                  ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              MCQ Drill
            </button>
            <button
              type="button"
              onClick={() => setMode("interview")}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                mode === "interview"
                  ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Interview Q&A
            </button>
          </div>

          {/* Header Action Controls & Stats */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs shrink-0">
            {mode === "mcq" && (
              <>
                {/* Streak counter: Shows only when streak >= 2 */}
                {currentStreak >= 2 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-400 font-semibold animate-pulse text-[11px] sm:text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <span>🔥</span>
                    <span>{currentStreak}</span>
                    <span className="hidden xs:inline">STREAK</span>
                  </div>
                )}

                {!isComplete && questions.length > 0 && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-md text-[11px] sm:text-xs">
                    <span className="hidden xs:inline">SCORE:</span>
                    <span className="text-emerald-400 font-bold">{score}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-300">{totalQuestions}</span>
                  </div>
                )}

                {/* Explicit Refresh Quiz button */}
                <button
                  type="button"
                  onClick={handleRefreshQuiz}
                  disabled={loading}
                  title="Refresh / restart quiz with new questions"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 active:scale-95 transition text-[11px] sm:text-xs font-mono disabled:opacity-50 cursor-pointer"
                >
                  <span className={loading ? "animate-spin" : ""}>🔄</span>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </>
            )}

            {/* Notes nav link */}
            <Link
              href="/notes"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition text-[11px] sm:text-xs"
            >
              <span>📝</span>
              <span className="hidden sm:inline">Notes</span>
            </Link>

            {/* Sign Out */}
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="px-2 py-1 rounded-md border border-zinc-800/80 text-zinc-500 hover:text-rose-400 hover:border-rose-900/60 transition text-[11px] sm:text-xs font-mono cursor-pointer"
              title="Sign Out"
            >
              <span className="sm:hidden">⎋</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Mode Switcher Banner */}
        <div className="sm:hidden px-3.5 pb-2 pt-0.5 border-t border-zinc-800/40">
          <div className="grid grid-cols-2 p-0.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-center font-mono">
            <button
              type="button"
              onClick={() => setMode("mcq")}
              className={`py-1 rounded-md text-xs transition-all cursor-pointer ${
                mode === "mcq"
                  ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              MCQ Drill
            </button>
            <button
              type="button"
              onClick={() => setMode("interview")}
              className={`py-1 rounded-md text-xs transition-all cursor-pointer ${
                mode === "interview"
                  ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Interview Q&A
            </button>
          </div>
        </div>

        {/* Global Progress Bar (only in MCQ mode) */}
        {mode === "mcq" && !isComplete && questions.length > 0 && (
          <div className="w-full bg-zinc-900 h-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-4 py-4 sm:py-6 flex flex-col justify-between safe-pb">
        {mode === "interview" ? (
          <InterviewQA />
        ) : (
          <>
            {/* Topic Selector - Horizontal swipe chips on Android & mobile */}
            <section className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest">
              SELECT TOPIC
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-zinc-600">
              {questions.length > 0 ? `${questions.length} QUESTIONS` : "20 QUESTIONS"}
            </span>
          </div>

          {/* Swipeable chips on touch screens, wrap on desktop */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {TOPICS.map((t) => {
              const active = topic === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSelectTopic(t)}
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
        </section>

        {/* Body Area: Loading / Error / Question Card / End Screen */}
        <div className="flex-1 flex flex-col">
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-9 h-9 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <div className="font-mono text-sm text-zinc-300 tracking-wide">
                LOADING DRILL QUESTIONS...
              </div>
              <div className="font-mono text-xs text-zinc-500 mt-1">
                TOPIC: {topic.toUpperCase()}
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="my-auto p-5 sm:p-6 rounded-xl bg-rose-950/20 border border-rose-900/50 text-center">
              <div className="font-mono text-xs text-rose-400 mb-2 font-semibold">[ERROR LOADING DRILL]</div>
              <div className="text-zinc-200 text-sm mb-4 leading-relaxed">{error}</div>
              <button
                onClick={handleRefreshQuiz}
                className="w-full sm:w-auto font-mono text-xs px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 transition-colors active:scale-95 touch-manipulation"
              >
                RETRY
              </button>
            </div>
          )}

          {/* End Screen */}
          {isComplete && !loading && (
            <div className="my-auto py-4 sm:py-8">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-8 max-w-2xl mx-auto backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
                  <div>
                    <span className="font-mono text-[11px] sm:text-xs text-emerald-400 font-semibold tracking-widest block mb-1">
                      [DRILL COMPLETED]
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Summary: {topic}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
                      {Math.round((score / totalQuestions) * 100)}%
                    </span>
                    <span className="block font-mono text-[10px] sm:text-xs text-zinc-400">ACCURACY</span>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-5 sm:my-6">
                  <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 sm:p-3.5 text-center">
                    <div className="font-mono text-2xl font-bold text-emerald-400">{score}</div>
                    <div className="font-mono text-[11px] sm:text-xs text-zinc-400 mt-1">CORRECT</div>
                  </div>
                  <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 sm:p-3.5 text-center">
                    <div className="font-mono text-2xl font-bold text-rose-400">{wrongCount}</div>
                    <div className="font-mono text-[11px] sm:text-xs text-zinc-400 mt-1">WRONG</div>
                  </div>
                  <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 sm:p-3.5 text-center">
                    <div className="font-mono text-2xl font-bold text-zinc-400">{skippedCount}</div>
                    <div className="font-mono text-[11px] sm:text-xs text-zinc-400 mt-1">SKIPPED</div>
                  </div>
                  <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 sm:p-3.5 text-center">
                    <div className="font-mono text-2xl font-bold text-amber-400">
                      {maxStreak}
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs text-zinc-400 mt-1">BEST STREAK</div>
                  </div>
                </div>

                {/* Question dots summary */}
                <div className="mb-5 sm:mb-6">
                  <div className="font-mono text-[11px] sm:text-xs text-zinc-500 uppercase tracking-wider mb-2.5">
                    QUESTION BREAKDOWN
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {history.map((status, i) => {
                      let bg = "bg-zinc-700 text-zinc-400";
                      if (status === "correct") bg = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
                      else if (status === "wrong") bg = "bg-rose-500/20 text-rose-400 border border-rose-500/40";
                      else if (status === "skipped") bg = "bg-zinc-800 text-zinc-400 border border-zinc-700";

                      return (
                        <div
                          key={i}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold select-none ${bg}`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-zinc-800">
                  <button
                    onClick={handleRestart}
                    className="w-full sm:flex-1 py-3.5 sm:py-3 px-5 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-mono text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98] touch-manipulation select-none"
                  >
                    RESTART DRILL
                    <span className="text-zinc-500 font-normal hidden sm:inline">[ENTER ↵]</span>
                  </button>

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-500">SWITCH TOPIC:</span>
                    <div className="flex flex-wrap gap-1.5 w-full justify-center">
                      {TOPICS.filter((t) => t !== topic)
                        .slice(0, 3)
                        .map((nextTopic) => (
                          <button
                            key={nextTopic}
                            onClick={() => handleSelectTopic(nextTopic)}
                            className="font-mono text-xs px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 transition-colors cursor-pointer active:scale-95 touch-manipulation select-none"
                          >
                            {nextTopic}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Question View */}
          {!loading && !error && !isComplete && currentQuestion && (
            <div className="flex-1 flex flex-col justify-between py-1 sm:py-2">
              <div>
                {/* Meta Header for question */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 uppercase">
                      {currentQuestion.topic}
                    </span>
                    <span className="font-mono text-[11px] sm:text-xs text-zinc-500">
                      Q {currentIndex + 1} OF {totalQuestions}
                    </span>
                  </div>

                  {/* Tiny step pill indicators */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalQuestions }).map((_, idx) => {
                      let color = "bg-zinc-800";
                      if (idx < history.length) {
                        const h = history[idx];
                        if (h === "correct") color = "bg-emerald-500";
                        else if (h === "wrong") color = "bg-rose-500";
                        else if (h === "skipped") color = "bg-zinc-500";
                      } else if (idx === currentIndex) {
                        color = "bg-zinc-200 ring-2 ring-zinc-400/50";
                      }

                      return (
                        <div
                          key={idx}
                          className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full transition-all ${color}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Question Text */}
                <h1 className="text-base sm:text-xl font-medium leading-relaxed text-zinc-100 mb-4 sm:mb-6">
                  {currentQuestion.question}
                </h1>

                {/* Options List - Thumb-friendly, responsive Android layout */}
                <div className="space-y-2.5 sm:space-y-3">
                  {currentQuestion.options.map((opt, index) => {
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                    const isCorrectOption = index === currentQuestion.correct;
                    const isSelected = selectedOption === index;

                    // Compute dynamic option styling based on answered state
                    let optionStyle =
                      "border-zinc-800/90 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-white active:bg-zinc-800 active:scale-[0.99]";
                    let badgeStyle = "bg-zinc-800 text-zinc-400 border-zinc-700";

                    if (isAnswered) {
                      if (isCorrectOption) {
                        optionStyle =
                          "border-emerald-500/80 bg-emerald-950/35 text-emerald-200 shadow-sm";
                        badgeStyle = "bg-emerald-500 text-zinc-950 border-emerald-400 font-bold";
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle =
                          "border-rose-500/80 bg-rose-950/35 text-rose-200";
                        badgeStyle = "bg-rose-500 text-zinc-950 border-rose-400 font-bold";
                      } else {
                        optionStyle =
                          "border-zinc-850/60 bg-zinc-900/20 text-zinc-500 opacity-50";
                        badgeStyle = "bg-zinc-800 text-zinc-500 border-zinc-800";
                      }
                    }

                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(index)}
                        className={`w-full min-h-[52px] text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 sm:gap-3.5 cursor-pointer touch-manipulation select-none ${optionStyle} ${
                          isAnswered ? "cursor-default active:scale-100" : ""
                        }`}
                      >
                        <span
                          className={`font-mono text-xs w-6 h-6 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${badgeStyle}`}
                        >
                          {optionLetter}
                        </span>

                        <span className="flex-1 text-sm sm:text-base leading-snug pt-0.5">
                          {opt}
                        </span>

                        {/* Status tag */}
                        {isAnswered && (
                          <span className="font-mono text-[11px] sm:text-xs shrink-0 self-center">
                            {isCorrectOption && (
                              <span className="text-emerald-400 font-semibold">✓ CORRECT</span>
                            )}
                            {isSelected && !isCorrectOption && (
                              <span className="text-rose-400 font-semibold">✗ SELECTED</span>
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box (Revealed after answering or skipping) */}
                {isAnswered && (
                  <div
                    className={`mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
                      isSkipped
                        ? "bg-zinc-900/90 border-zinc-700/80 text-zinc-300"
                        : selectedOption === currentQuestion.correct
                        ? "bg-emerald-950/25 border-emerald-500/35 text-emerald-200"
                        : "bg-rose-950/25 border-rose-500/35 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">
                        {isSkipped
                          ? "[QUESTION SKIPPED]"
                          : selectedOption === currentQuestion.correct
                          ? "[CORRECT ANSWER]"
                          : "[INCORRECT ANSWER]"}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400">
                        CORRECT:{" "}
                        <strong className="text-emerald-400 font-bold">
                          {String.fromCharCode(65 + currentQuestion.correct)}
                        </strong>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-normal">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Controls & Responsive Touch / Shortcut Bar */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-zinc-800/80 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                {/* Shortcut & Touch legend */}
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs text-zinc-400 flex-wrap text-center">
                  {!isAnswered ? (
                    <>
                      <span className="text-zinc-400">Tap an option</span>
                      <span className="text-zinc-600 hidden sm:inline">or press</span>
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px]">
                          A-D
                        </kbd>
                      </span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-zinc-500 hidden sm:inline">
                        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] mr-1">
                          Space
                        </kbd>
                        to skip
                      </span>
                      <span className="text-zinc-500 sm:hidden">or tap Skip below</span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center gap-1 text-emerald-400 font-medium">
                      <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[10px] hidden sm:inline">
                        Enter ↵
                      </kbd>
                      <span>Tap Next Question to continue</span>
                    </span>
                  )}
                </div>

                {/* Primary Action Buttons - Thumb accessible on Android */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {!isAnswered ? (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="w-full sm:w-auto min-h-[46px] sm:min-h-0 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-750 border border-zinc-800 font-mono text-xs text-zinc-300 font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation select-none"
                    >
                      SKIP QUESTION
                      <span className="text-zinc-500 text-[10px] hidden sm:inline">[SPACE]</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto min-h-[46px] sm:min-h-0 px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-mono text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-95 touch-manipulation select-none"
                    >
                      {currentIndex + 1 < totalQuestions ? "NEXT QUESTION" : "FINISH DRILL"}
                      <span className="text-zinc-500 font-mono text-xs hidden sm:inline">[ENTER ↵]</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-2.5 sm:py-3 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-zinc-600 font-mono text-[10px] sm:text-[11px] gap-1">
          <span>cs-drill &bull; CS Fundamentals Prep</span>
          <span>OS &bull; Networks &bull; DBMS &bull; OOP &bull; DSA</span>
        </div>
      </footer>
    </div>
  );
}
