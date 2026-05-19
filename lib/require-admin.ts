import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false as const, status: 401 };
  if (session.user.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const, session };
}
