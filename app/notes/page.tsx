"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Notes Page
// ---------------------------------------------------------------------------
export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Debounce timer ref
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContent = useRef({ title: "", content: "" });

  // ── Fetch all notes ──────────────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data: Note[] = await res.json();
      setNotes(data);
      return data;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ── Select a note ────────────────────────────────────────────────────────
  const selectNote = useCallback((note: Note) => {
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSaveStatus("saved");
    lastSavedContent.current = { title: note.title, content: note.content };
    setShowDeleteConfirm(false);
  }, []);

  // ── Auto-save on title/content change (500ms debounce) ──────────────────
  const save = useCallback(
    async (noteId: number, newTitle: string, newContent: string) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });
        if (!res.ok) throw new Error("Save failed");
        const updated: Note = await res.json();
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? updated : n))
        );
        lastSavedContent.current = { title: newTitle, content: newContent };
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    },
    []
  );

  const scheduleSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (activeId === null) return;
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        save(activeId, newTitle, newContent);
      }, 600);
    },
    [activeId, save]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTitle(v);
    scheduleSave(v, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setContent(v);
    scheduleSave(title, v);
  };

  // ── Create note ──────────────────────────────────────────────────────────
  const createNote = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled", content: "" }),
      });
      if (!res.ok) throw new Error("Create failed");
      const newNote: Note = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      selectNote(newNote);
    } finally {
      setCreating(false);
    }
  };

  // ── Delete note ──────────────────────────────────────────────────────────
  const deleteNote = async () => {
    if (activeId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${activeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      const remaining = notes.filter((n) => n.id !== activeId);
      setNotes(remaining);
      if (remaining.length > 0) {
        selectNote(remaining[0]);
      } else {
        setActiveId(null);
        setTitle("");
        setContent("");
        setSaveStatus("saved");
      }
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  // ── Force save on blur ───────────────────────────────────────────────────
  const handleBlur = () => {
    if (
      activeId !== null &&
      (title !== lastSavedContent.current.title ||
        content !== lastSavedContent.current.content)
    ) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      save(activeId, title, content);
    }
  };

  // ── Keyboard shortcut: Cmd/Ctrl+N = new note ─────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        createNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtered notes ───────────────────────────────────────────────────────
  const filteredNotes = searchQuery.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  // ── Save status badge ────────────────────────────────────────────────────
  const statusBadge: Record<SaveStatus, { label: string; cls: string }> = {
    saved: { label: "✓ Saved", cls: "text-emerald-400" },
    saving: { label: "Saving…", cls: "text-zinc-400 animate-pulse" },
    unsaved: { label: "● Unsaved", cls: "text-amber-400" },
    error: { label: "✗ Error", cls: "text-rose-400" },
  };
  const badge = statusBadge[saveStatus];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-dvh bg-[#09090b] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="font-mono text-sm font-bold tracking-tight text-white flex items-center gap-1.5 shrink-0 hover:opacity-80 transition"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              cs-drill
            </Link>
            <span className="text-zinc-600 font-mono text-xs">/</span>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Notes
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeId !== null && (
              <span className={`font-mono text-[11px] ${badge.cls}`}>
                {badge.label}
              </span>
            )}
            <Link
              href="/"
              className="font-mono text-xs text-zinc-400 hover:text-zinc-100 transition px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
            >
              ← Drill
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="font-mono text-xs text-zinc-500 hover:text-rose-400 transition px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-rose-900"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Editor */}
      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="w-64 shrink-0 border-r border-zinc-800/80 flex flex-col bg-zinc-950/40 hidden sm:flex">
          {/* Search + New */}
          <div className="p-3 border-b border-zinc-800/60 flex flex-col gap-2">
            <button
              onClick={createNote}
              disabled={creating}
              className="w-full py-2 rounded-lg bg-zinc-100 text-zinc-900 font-mono text-xs font-bold tracking-wider hover:bg-white active:bg-zinc-200 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {creating ? "Creating…" : "+ New Note"}
              <span className="text-zinc-500 font-normal text-[10px] hidden sm:inline">⌘N</span>
            </button>
            <input
              type="text"
              placeholder="Search notes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600 transition font-mono"
            />
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center font-mono text-xs text-zinc-500 animate-pulse">
                Loading…
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-4 text-center font-mono text-xs text-zinc-600">
                {searchQuery ? "No matches." : "No notes yet.\nCreate one above."}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`w-full text-left px-3 py-3 border-b border-zinc-800/50 transition flex flex-col gap-0.5 hover:bg-zinc-800/40 ${
                    note.id === activeId ? "bg-zinc-800/60 border-l-2 border-l-emerald-500" : ""
                  }`}
                >
                  <span className="font-mono text-xs text-zinc-200 truncate font-medium">
                    {note.title || "Untitled"}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-600 truncate">
                    {note.content.trim().split("\n")[0]?.slice(0, 50) || "Empty note"}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-700 mt-0.5">
                    {formatRelative(note.updated_at)}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Note count */}
          <div className="p-3 border-t border-zinc-800/60">
            <span className="font-mono text-[10px] text-zinc-700">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>
        </aside>

        {/* ── Editor ───────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeId === null ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-5">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-zinc-500 text-sm">
                  Select a note or create a new one
                </p>
                <p className="font-mono text-zinc-700 text-xs">
                  Jot down thoughts, algorithms, concepts to revisit
                </p>
              </div>
              <button
                onClick={createNote}
                disabled={creating}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-mono text-sm font-bold tracking-wide hover:bg-white active:scale-[0.98] transition disabled:opacity-50"
              >
                {creating ? "Creating…" : "+ New Note"}
              </button>

              {/* Mobile note list */}
              {notes.length > 0 && (
                <div className="sm:hidden w-full max-w-sm mt-2 flex flex-col gap-1.5">
                  {notes.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => selectNote(n)}
                      className="text-left px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col gap-0.5 hover:border-zinc-700 transition"
                    >
                      <span className="font-mono text-xs text-zinc-200 font-medium truncate">
                        {n.title || "Untitled"}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">
                        {formatRelative(n.updated_at)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Active editor */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Editor toolbar */}
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800/60 shrink-0 gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleBlur}
                  placeholder="Note title…"
                  maxLength={255}
                  className="flex-1 bg-transparent font-mono text-sm font-semibold text-zinc-100 placeholder-zinc-700 outline-none border-none min-w-0"
                />

                <div className="flex items-center gap-2 shrink-0">
                  {/* Mobile save status */}
                  <span className={`font-mono text-[10px] sm:hidden ${badge.cls}`}>
                    {saveStatus === "saved" ? "✓" : saveStatus === "saving" ? "…" : "●"}
                  </span>

                  {/* Delete */}
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-rose-400">Delete?</span>
                      <button
                        onClick={deleteNote}
                        disabled={deleting}
                        className="font-mono text-[10px] px-2 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-950 transition"
                      >
                        {deleting ? "…" : "Yes"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="font-mono text-[10px] px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 transition"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="font-mono text-[10px] px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-500 hover:border-rose-500/40 hover:text-rose-400 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Text editor */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  onBlur={handleBlur}
                  placeholder={`Write your notes here…

Ideas for algorithms to revisit:
  - Quick sort optimizations
  - Dijkstra with lazy deletion

Concepts to solidify:
  - MVCC in Postgres
  - Belady's Anomaly

Use markdown-style formatting for structure.`}
                  spellCheck
                  className="flex-1 w-full resize-none bg-transparent text-zinc-200 text-sm leading-relaxed font-mono px-5 py-4 outline-none placeholder-zinc-700 overflow-y-auto"
                  style={{ minHeight: 0 }}
                />
              </div>

              {/* Status bar */}
              <div className="shrink-0 px-5 py-2 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-700">
                  {content.length.toLocaleString()} chars ·{" "}
                  {content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                </span>
                <span className={`font-mono text-[10px] ${badge.cls} hidden sm:inline`}>
                  {badge.label}
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
