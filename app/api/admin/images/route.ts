import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const images = await prisma.images.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(images);
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const gate = await requireAdmin();
        if (!gate.ok) throw new Error("Unauthorized");

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // DB row is created by the client via /api/admin/images/finalize
        // once it has measured the image dimensions.
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
