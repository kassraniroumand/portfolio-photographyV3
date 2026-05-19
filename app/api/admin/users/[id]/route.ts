import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const role = body?.role;

  if (role !== "admin" && role !== "user") {
    return Response.json(
      { error: "role must be 'admin' or 'user'" },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return Response.json(user);
}
