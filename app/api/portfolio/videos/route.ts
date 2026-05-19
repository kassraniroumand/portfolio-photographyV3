import { prisma } from "@/lib/prisma";

const PORTFOLIO_ID = "portfolio";

export async function GET() {
  const record = await prisma.siteContent.findUnique({
    where: { id: PORTFOLIO_ID },
  });

  const payload = record?.data as Record<string, unknown> | null | undefined;
  return Response.json({ data: payload?.videoCollections ?? null });
}
