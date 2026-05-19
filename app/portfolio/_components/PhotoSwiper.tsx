"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";

type PhotoCollectionData = PortfolioFormValues["photoCollections"][number];

export function PhotoSwiper({
  collection,
}: {
  collection: PhotoCollectionData;
}) {
  const total = collection.photos.length;
  return (
    <div className="space-y-4">
      <Swiper
        modules={[FreeMode, Pagination]}
        slidesPerView={1.2}
        spaceBetween={16}
        freeMode
        pagination={{ clickable: true }}
        className="w-full !pb-10"
      >
        {collection.photos.map((photo, i) => (
          <SwiperSlide key={`${collection.slug}-photo-${i}`}>
            <figure className="flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <Image
                  src={photo.src}
                  alt={photo.alt || collection.title}
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="object-cover"
                />
                <span className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.35em] text-foreground/80">
                  N° {String(i + 1).padStart(3, "0")} ·{" "}
                  {String(total).padStart(3, "0")}
                </span>
              </div>
              {photo.caption && (
                <figcaption className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
      {total > 1 && (
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          Swipe · {total} photos
        </p>
      )}
    </div>
  );
}
