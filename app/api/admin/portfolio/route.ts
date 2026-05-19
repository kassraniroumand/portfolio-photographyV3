import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { portfolioSchema } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";

const PORTFOLIO_ID = "portfolio";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const record = await prisma.siteContent.findUnique({
    where: { id: PORTFOLIO_ID },
  });

  return Response.json(record ?? { id: PORTFOLIO_ID, data: null });
}

export async function PUT(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const body = await request.json().catch(() => null);
  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const record = await prisma.siteContent.upsert({
    where: { id: PORTFOLIO_ID },
    create: { id: PORTFOLIO_ID, data: parsed.data },
    update: { data: parsed.data },
  });

  return Response.json(record);
}
