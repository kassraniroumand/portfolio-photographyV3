import Image from "next/image";
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";
import { CollectionHeader } from "./CollectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const info = collection.info ?? [];
  const hasCover = Boolean(collection.coverImage);
  const hasInfo = info.length > 0;

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

      {(hasCover || hasInfo) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {hasCover ? (
            <div className="relative w-full aspect-square overflow-hidden">
              <Image
                src={collection.coverImage}
                alt={`${collection.title} cover`}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          ) : (
            <div />
          )}

          {hasInfo && (
            <dl className="divide-y divide-border border-y border-border">
              {info.map((row, i) => (
                <div
                  key={`${collection.slug}-info-${i}`}
                  className="grid grid-cols-[minmax(8rem,1fr)_2fr] gap-6 py-3"
                >
                  <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {row.k}
                  </dt>
                  <dd className="text-sm text-foreground">{row.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {collection.videos.length === 0 ? (
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          No videos in this collection.
        </p>
      ) : (
        <div className="space-y-4">
          <Carousel opts={{ align: "start" }} className="relative">
            <CarouselContent className="-ml-4">
              {collection.videos.map((video, i) => (
                <CarouselItem
                  key={`${collection.slug}-video-${i}`}
                  className="pl-4 basis-[88%] md:basis-[60%] lg:basis-1/2"
                >
                  <figure className="flex flex-col gap-4">
                    <div
                      className="relative mx-auto w-full overflow-hidden bg-[hsl(0_0%_4%)] shadow-cinematic ring-1 ring-foreground/5"
                      style={{
                        aspectRatio: video.aspectRatio || 16 / 9,
                        maxHeight: "50svh",
                        maxWidth: `calc(50svh * ${video.aspectRatio || 16 / 9})`,
                      }}
                    >
                      <video
                        src={video.src}
                        poster={video.thumbnail || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={video.alt || collection.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="pointer-events-none absolute top-5 left-5 text-[10px] uppercase tracking-[0.35em] text-foreground/80">
                        Reel {String(i + 1).padStart(2, "0")} ·{" "}
                        {String(collection.videos.length).padStart(2, "0")}
                      </span>
                    </div>
                    {video.caption && (
                      <figcaption className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        {video.caption}
                      </figcaption>
                    )}
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            {collection.videos.length > 1 && (
              <>
                <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/85 hover:bg-background border-border shadow-md z-10" />
                <CarouselNext className="right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/85 hover:bg-background border-border shadow-md z-10" />
              </>
            )}
          </Carousel>
        </div>
      )}
    </article>
  );
}
