import { prisma } from "@/lib/prisma";

const PORTFOLIO_ID = "portfolio";

export async function GET() {
  const record = await prisma.siteContent.findUnique({
    where: { id: PORTFOLIO_ID },
  });

  return Response.json(record ?? { id: PORTFOLIO_ID, data: null });
}
