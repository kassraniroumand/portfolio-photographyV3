"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error } = await signIn.email({ email, password });

    if (error) {
      setError(error.message ?? "Failed to sign in");
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-6 py-16 px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm text-black outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              disabled={submitting}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm text-black outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              disabled={submitting}
            />
          </label>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-zinc-500">
          No account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
