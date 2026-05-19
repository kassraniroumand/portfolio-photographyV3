"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const DEFAULT_RATIO = "4 / 5";

const Gallery = ({ gallery }: { gallery: AdminContentFormValues["gallery"] }) => {
  const works = gallery.works;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [headLine1, headLine2 = ""] = gallery.headline.split("\n");

  return (
    <section id="work" className="relative py-24 lg:py-40">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-accent mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              {gallery.eyebrow}
            </p>
            <h2 className="font-display text-6xl lg:text-8xl font-light max-w-3xl text-balance leading-[0.95]">
              {headLine1}{headLine2 && (<><br />{headLine2}</>)}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed font-light">
            {gallery.intro}
          </p>
        </div>

        {/* Masonry */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8 [column-fill:_balance]">
          {works.map((w, i) => (
            <button
              key={`${w.title}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open ${w.title}`}
              className="group mb-6 lg:mb-8 block w-full break-inside-avoid text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <figure
                className="relative overflow-hidden bg-secondary"
                style={{ aspectRatio: w.ratio ?? DEFAULT_RATIO }}
              >
                <Image
                  src={w.src}
                  alt={`${w.title} — ${w.category} photography in ${w.location}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-smooth group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/15 transition-colors duration-700" />
                <span className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.35em] text-foreground/80">
                  N° {String(i + 1).padStart(3, "0")}
                </span>
                <span className="absolute top-5 right-5 text-[10px] uppercase tracking-[0.35em] text-foreground/80">
                  {w.year}
                </span>
              </figure>
              <h3 className="font-display text-3xl lg:text-4xl font-light mt-6 leading-snug group-hover:text-accent transition-colors duration-500">
                {w.title}
              </h3>
              <p className="text-xs uppercase tracking-[0.3em] mt-3 text-muted-foreground">
                {w.category} · {w.location}
              </p>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        works={works}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </section>
  );
};

export default Gallery;
