"use client";

import { useEffect, useState } from "react";
import type { TodoModel as Todo } from "@/lib/generated/prisma/models";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/todos")
      .then((r) => r.json())
      .then((data: Todo[]) => {
        if (active) setTodos(data);
      })
      .catch(() => {
        if (active) setError("failed to load todos");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(e: { preventDefault: () => void }) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    }).catch(() => null);

    if (!res?.ok) {
      setError("failed to create todo");
    } else {
      const created: Todo = await res.json();
      setTodos((prev) => [created, ...prev]);
      setTitle("");
    }
    setSubmitting(false);
  }

  async function handleToggle(todo: Todo) {
    const next = !todo.completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)),
    );
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: next }),
    }).catch(() => null);

    if (!res?.ok) {
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: !next } : t)),
      );
      setError("failed to update todo");
    }
  }

  async function handleDelete(id: string) {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" }).catch(
      () => null,
    );
    if (!res?.ok) {
      setTodos(snapshot);
      setError("failed to delete todo");
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-6 py-16 px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Todos
        </h1>

        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            className="flex-1 h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm text-black outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="h-11 rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : todos.length === 0 ? (
          <p className="text-sm text-zinc-500">No todos yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="h-4 w-4"
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed
                      ? "text-zinc-400 line-through dark:text-zinc-500"
                      : "text-black dark:text-zinc-50"
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(todo.id)}
                  className="text-xs text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}