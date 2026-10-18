"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Login failed.");
          return;
        }
        router.push("/");
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
          cs-drill ⚡
        </h1>
        <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Sign in to continue
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-mono uppercase tracking-wider text-zinc-400"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={50}
              className="rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50 transition"
              placeholder="your_username"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-wider text-zinc-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              className="rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-mono text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-mono font-semibold text-zinc-900 uppercase tracking-wider active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-4 text-center text-xs text-zinc-500">
          No account?{" "}
          <a
            href="/register"
            className="font-mono text-zinc-300 underline underline-offset-2 hover:text-zinc-100 transition"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
