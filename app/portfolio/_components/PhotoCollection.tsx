import Image from "next/image";
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";
import { CollectionHeader } from "./CollectionHeader";
import { PhotoSwiper } from "./PhotoSwiper";

type PhotoCollectionData = PortfolioFormValues["photoCollections"][number];

export function PhotoCollection({
  anchorId,
  index,
  collection,
}: {
  anchorId: string;
  index: number;
  collection: PhotoCollectionData;
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
        kind="photo"
      />

      {collection.coverImages.some(Boolean) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collection.coverImages.map((src, i) =>
            src ? (
              <div
                key={`${collection.slug}-cover-${i}`}
                className="relative w-full aspect-square overflow-hidden bg-secondary"
              >
                <Image
                  src={src}
                  alt={`${collection.title} cover ${i + 1}`}
                  fill
                  priority={index === 0 && i === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null,
          )}
        </div>
      )}

      {collection.photos.length === 0 ? (
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          No photos in this collection.
        </p>
      ) : (
        <>
          <div className="sm:hidden">
            <PhotoSwiper collection={collection} />
          </div>
          <div className="hidden sm:block sm:columns-2 lg:columns-3 gap-6 lg:gap-8 [column-fill:_balance]">
            {collection.photos.map((photo, i) => (
              <figure
                key={`${collection.slug}-photo-${i}`}
                className="group mb-6 lg:mb-8 block w-full break-inside-avoid"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <Image
                    src={photo.src}
                    alt={photo.alt || collection.title}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[1600ms] ease-smooth group-hover:scale-[1.06]"
                  />
                  <span className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.35em] text-foreground/80">
                    N° {String(i + 1).padStart(3, "0")}
                  </span>
                </div>
                {photo.caption && (
                  <figcaption className="text-xs uppercase tracking-[0.3em] mt-4 text-muted-foreground">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
