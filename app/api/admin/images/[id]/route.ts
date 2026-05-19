import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const { id } = await ctx.params;

  const image = await prisma.images.findUnique({ where: { id } });
  if (!image) {
    return Response.json({ error: "image not found" }, { status: 404 });
  }

  await del(image.url);
  await prisma.images.delete({ where: { id } });

  return Response.json({ ok: true });
}
