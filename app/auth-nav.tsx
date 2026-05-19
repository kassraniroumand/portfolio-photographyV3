"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export function AuthNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-12 w-full max-w-2xl items-center justify-between px-8 text-sm">
        <Link href="/" className="font-medium text-black dark:text-zinc-50">
          Home
        </Link>

        {isPending ? (
          <span className="text-zinc-400">…</span>
        ) : session ? (
          <div className="flex items-center gap-3">
            <span className="text-zinc-600 dark:text-zinc-400">
              {session.user.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-zinc-600 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
