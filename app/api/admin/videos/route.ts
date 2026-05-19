import { del, list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/require-admin";

const VIDEO_PREFIX = "videos/";
const ALLOWED_CONTENT_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
];

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const { blobs } = await list({ prefix: VIDEO_PREFIX });
  const videos = blobs
    .filter((b) => !b.pathname.endsWith("/"))
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
    .map((b) => ({
      url: b.url,
      pathname: b.pathname,
      size: b.size,
      uploadedAt: b.uploadedAt,
    }));

  return Response.json(videos);
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
        // No-op — we list directly from blob storage.
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return new Response(null, { status: gate.status });

  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return Response.json({ error: "url required" }, { status: 400 });
  }

  await del(url);
  return new Response(null, { status: 204 });
}
