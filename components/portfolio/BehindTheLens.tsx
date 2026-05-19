"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const BehindTheLens = ({ lens }: { lens: AdminContentFormValues["lens"] }) => {
  const baseFrames = lens.frames;
  // Coverflow loop needs a healthy buffer of slides; duplicate small sets.
  const frames =
    baseFrames.length === 0
      ? baseFrames
      : baseFrames.length >= 8
        ? baseFrames
        : Array.from({ length: Math.ceil(8 / baseFrames.length) }, () => baseFrames).flat();
  const [headLine1, headLine2 = ""] = lens.headline.split("\n");
  const canLoop = frames.length >= 4;

  return (
    <section
      id="behind-the-lens"
      className="relative bg-background"
      aria-label="Behind the lens — circular gallery"
    >
      <div className="container mx-auto px-6 lg:px-12 pt-24 lg:pt-40 pb-12 lg:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-accent mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              {lens.eyebrow}
            </p>
            <h2 className="font-display text-6xl lg:text-8xl font-light max-w-3xl text-balance leading-[0.95]">
              {headLine1}{headLine2 && (<><br />{headLine2}</>)}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed font-light">
            {lens.intro}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="relative">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination, Keyboard, Navigation]}
            loop={canLoop}
            grabCursor
            centeredSlides
            slidesPerView="auto"
            spaceBetween={24}
            keyboard={{ enabled: true }}
            autoplay={canLoop ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: ".lens-prev",
              nextEl: ".lens-next",
            }}
            effect="coverflow"
            coverflowEffect={{ rotate: 12, stretch: 0, depth: 180, modifier: 1, slideShadows: false }}
            speed={700}
            className="behind-lens-swiper w-full mx-auto"
          >
            {frames.map((frame, i) => (
              <SwiperSlide
                key={`${frame.caption}-${i}`}
                className="!w-[200px] sm:!w-[260px] lg:!w-[340px]"
              >
                <figure className="relative w-full aspect-[4/5] shadow-2xl shadow-background/80 ring-1 ring-foreground/5 overflow-hidden bg-secondary">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 260px, 200px"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/90">
                        {frame.caption}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mt-1">
                        {frame.location}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/70">
                      {String(i + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <button
            type="button"
            aria-label="Previous slide"
            className="lens-prev absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/70 hover:bg-background border border-border backdrop-blur flex items-center justify-center text-foreground hover:text-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="lens-next absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/70 hover:bg-background border border-border backdrop-blur flex items-center justify-center text-foreground hover:text-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BehindTheLens;
