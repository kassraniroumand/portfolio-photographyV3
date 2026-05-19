"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const Services = ({ services: svc }: { services: AdminContentFormValues["services"] }) => {
  const services = svc.items;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const count = services.length;

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="Services"
      className="relative bg-background text-foreground"
      style={{ height: `${(count + 1) * 100}vh` }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl pt-20 lg:pt-24">
          <div className="flex items-end justify-between mb-8 lg:mb-12 gap-6 flex-wrap">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-accent mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                {svc.eyebrow}
              </p>
              <h2 className="font-display text-5xl lg:text-7xl font-light leading-[0.95] text-balance max-w-3xl">
                {svc.headline}
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {String(Math.min(count, Math.floor(progress * count) + 1)).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="relative h-[60vh] lg:h-[62vh]">
          {services.map((srv, i) => {
            // cardProgress: -i .. (count - i). 0 = card fully in place.
            const cardProgress = progress * count - i;

            // Incoming: cardProgress in [-1, 0] → slides up from below (translateY 100% → 0).
            // Active:   cardProgress in [0, 1] → starts being covered by next card; subtle scale-down + lift.
            // Past:     cardProgress > 1 → stays parked under the stack.
            // Hidden until it's this card's turn (cardProgress >= -1).
            // Incoming window is tight (last 35% of its slot) so prior card fully settles first.
            const INCOMING_WINDOW = 0.35;
            // Translate using viewport height so parked cards are fully below the fold,
            // not just below their own box.
            let translateYVh = 0;
            if (cardProgress < -INCOMING_WINDOW) {
              translateYVh = 110; // fully off-screen below
            } else if (cardProgress < 0) {
              const t = (cardProgress + INCOMING_WINDOW) / INCOMING_WINDOW; // 0..1
              translateYVh = (1 - t) * 110;
            }

            // First card has no incoming animation — already in place.
            if (i === 0) translateYVh = 0;

            return (
              <article
                key={srv.index}
                className="absolute inset-x-0 mx-auto w-[92%] lg:w-[88%] max-w-6xl"
                style={{
                  top: 0,
                  zIndex: 10 + i,
                  transform: `translate3d(0, ${translateYVh}vh, 0)`,
                  transition: "transform 120ms linear",
                  transformOrigin: "top center",
                  willChange: "transform",
                }}
              >
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border bg-card overflow-hidden shadow-cinematic"
                  style={{ height: "min(60vh, 540px)" }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-muted order-2 lg:order-1">
                    <Image
                      src={srv.image}
                      alt={srv.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 44vw, 92vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative p-8 lg:p-12 flex flex-col justify-between order-1 lg:order-2">
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <span className="inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-full border border-border text-xs tracking-[0.3em] text-muted-foreground">
                        {srv.index}
                      </span>
                      <span className="text-xs uppercase tracking-[0.4em] text-accent">
                        Service
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-4xl lg:text-6xl font-light leading-[1.05] mb-5 text-balance">
                        {srv.title}
                      </h3>
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-light max-w-md">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-8">
                      {srv.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-3 py-1.5 rounded-full border border-border text-sm tracking-wide text-foreground/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
