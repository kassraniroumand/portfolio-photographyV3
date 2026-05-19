import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { adminContentSchema } from "../../../(dashboard)/admin/homepage/form/adminContentSchema";

const SINGLETON_ID = "singleton";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const record = await prisma.siteContent.findUnique({
    where: { id: SINGLETON_ID },
  });

  return Response.json(record ?? { id: SINGLETON_ID, data: null });
}

export async function PUT(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const body = await request.json().catch(() => null);
  const parsed = adminContentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const record = await prisma.siteContent.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, data: parsed.data },
    update: { data: parsed.data },
  });

  return Response.json(record);
}
