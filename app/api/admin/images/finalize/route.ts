import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

async function generateBlurDataURL(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const lqip = await sharp(buffer)
      .resize(12, 12, { fit: "inside" })
      .jpeg({ quality: 40 })
      .toBuffer();
    return `data:image/jpeg;base64,${lqip.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const body = (await request.json().catch(() => null)) as
    | { url?: string; width?: number; height?: number }
    | null;

  const url = body?.url?.trim();
  const width = body?.width;
  const height = body?.height;

  if (!url || typeof width !== "number" || typeof height !== "number") {
    return Response.json(
      { error: "url, width, and height are required" },
      { status: 400 },
    );
  }

  const blurDataURL = await generateBlurDataURL(url);

  const image = await prisma.images.create({
    data: { url, width, height, blurDataURL },
  });

  return Response.json(image, { status: 201 });
}
