import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(users);
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name || !email) {
    return Response.json(
      { error: "name and email are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.create({
    data: { name, email },
  });

  return Response.json(user, { status: 201 });
}
