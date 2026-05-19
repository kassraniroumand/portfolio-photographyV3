import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { portfolioSchema } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";

const PORTFOLIO_ID = "portfolio";

const sectionSchemas = {
  intro: portfolioSchema.shape.intro,
  photoCollections: portfolioSchema.shape.photoCollections,
  videoCollections: portfolioSchema.shape.videoCollections,
  seo: portfolioSchema.shape.seo,
} as const;

type SectionKey = keyof typeof sectionSchemas;

function isSectionKey(value: string): value is SectionKey {
  return value in sectionSchemas;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const { section } = await params;
  if (!isSectionKey(section)) {
    return Response.json({ error: "unknown section" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sectionSchemas[section].safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const existing = await prisma.siteContent.findUnique({
    where: { id: PORTFOLIO_ID },
  });

  const existingData =
    existing?.data && typeof existing.data === "object" && !Array.isArray(existing.data)
      ? (existing.data as Record<string, unknown>)
      : {};

  const nextData = {
    ...existingData,
    [section]: parsed.data,
  } as Prisma.InputJsonValue;

  const record = await prisma.siteContent.upsert({
    where: { id: PORTFOLIO_ID },
    create: { id: PORTFOLIO_ID, data: nextData },
    update: { data: nextData },
  });

  return Response.json(record);
}
