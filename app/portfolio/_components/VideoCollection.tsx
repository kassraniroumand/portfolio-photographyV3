import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";
import { CollectionHeader } from "./CollectionHeader";

type VideoCollectionData = PortfolioFormValues["videoCollections"][number];

export function VideoCollection({
  anchorId,
  index,
  collection,
}: {
  anchorId: string;
  index: number;
  collection: VideoCollectionData;
}) {
  return (
    <article className="flex flex-col gap-12 lg:gap-16">
      <CollectionHeader
        anchorId={anchorId}
        index={index}
        title={collection.title}
        year={collection.year}
        location={collection.location}
        description={collection.description}
        kind="video"
      />

      {collection.videos.length === 0 ? (
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          No videos in this collection.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-8 lg:gap-12 md:grid-cols-2">
          {collection.videos.map((video, i) => (
            <li
              key={`${collection.slug}-video-${i}`}
              className="flex flex-col gap-4"
            >
              <figure
                className="relative mx-auto w-auto max-h-svh overflow-hidden bg-[hsl(0_0%_4%)] shadow-cinematic ring-1 ring-foreground/5"
                style={{ aspectRatio: video.aspectRatio || 16 / 9 }}
              >
                <video
                  src={video.src}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={video.alt || collection.title}
                  className="h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute top-5 left-5 text-[10px] uppercase tracking-[0.35em] text-foreground/80">
                  Reel {String(i + 1).padStart(2, "0")}
                </span>
              </figure>
              {video.caption && (
                <figcaption className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {video.caption}
                </figcaption>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
