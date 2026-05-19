import { put } from "@vercel/blob";
import { imageSize } from "image-size";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

async function generateBlurDataURL(buffer: Buffer): Promise<string | null> {
  try {
    const lqip = await sharp(buffer)
      .resize(12, 12, { fit: "inside" })
      .jpeg({ quality: 40 })
      .toBuffer();
    return `data:image/jpeg;base64,${lqip.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const images = await prisma.images.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(images);
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "file is required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "file must be an image" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dims = imageSize(buffer);
  if (!dims.width || !dims.height) {
    return Response.json(
      { error: "could not read image dimensions" },
      { status: 400 },
    );
  }

  const [blob, blurDataURL] = await Promise.all([
    put(file.name, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    }),
    generateBlurDataURL(buffer),
  ]);

  const image = await prisma.images.create({
    data: {
      url: blob.url,
      width: dims.width,
      height: dims.height,
      blurDataURL,
    },
  });

  return Response.json(image, { status: 201 });
}
