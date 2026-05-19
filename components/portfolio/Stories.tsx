"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const Stories = ({ stories: storiesContent }: { stories: AdminContentFormValues["stories"] }) => {
  const stories = storiesContent.items;
  const [active, setActive] = useState(0);
  const story = stories[active] ?? stories[0];
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeHandled = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    swipeHandled.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || swipeHandled.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) setActive((p) => (p + 1) % stories.length);
      else setActive((p) => (p - 1 + stories.length) % stories.length);
      swipeHandled.current = true;
    }
  };

  const onTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Scroll-driven active switching (shared desktop + mobile)
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const el = isDesktop ? scrollRef.current : mobileScrollRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const idx = Math.min(
        stories.length - 1,
        Math.floor(progress * stories.length)
      );
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="stories"
      className="relative"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
      aria-label="Ongoing photography series"
    >
      {/* ============== MOBILE LAYOUT ============== */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="px-6 pt-16 pb-10">
          <p
            className="text-xs uppercase tracking-[0.45em] mb-4 flex items-center gap-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            <span className="h-px w-8" style={{ backgroundColor: "hsl(var(--accent))" }} />
            {storiesContent.eyebrow}
          </p>
          <h2 className="font-display text-2xl font-light leading-[1.05] text-balance">
            {storiesContent.headline}
          </h2>
        </div>


        {/* Featured plate — scroll-driven sticky track */}
        <div
          ref={mobileScrollRef}
          className="relative w-full"
          style={{ height: `${stories.length * 100}vh` }}
        >
          <div
            className="sticky top-0 w-full overflow-hidden touch-pan-y select-none"
            style={{ height: "100vh" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-label="Scroll or swipe to change series"
          >
          <div className="absolute inset-0">
            {stories.map((s, i) => (
              <Image
                key={s.title}
                src={s.src}
                alt={s.alt}
                fill
                loading="lazy"
                sizes="100vw"
                className="object-cover"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "scale(1.06)" : "scale(1)",
                  transition: "opacity 1000ms ease, transform 9000ms ease-out",
                }}
              />
            ))}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--background) / 0.25) 0%, hsl(var(--background) / 0.5) 50%, hsl(var(--background) / 0.97) 100%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              }}
            />
          </div>

          {/* Plate counter */}
          <div
            className="absolute top-5 left-6 right-6 flex justify-between text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "hsl(var(--foreground) / 0.8)" }}
          >
            <span>N° {String(active + 1).padStart(2, "0")}</span>
            <span>
              {String(active + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
            </span>
          </div>

          {/* Bottom copy */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <div
              className="text-[10px] uppercase tracking-[0.45em] mb-4"
              style={{ color: "hsl(var(--accent))" }}
            >
              {story.subject}
            </div>
            <h3
              key={story.title}
              className="font-display text-5xl font-light leading-[0.95] tracking-tight mb-5"
            >
              {story.title}
            </h3>
            <p
              className="text-sm leading-relaxed font-light mb-6"
              style={{ color: "hsl(var(--foreground) / 0.9)" }}
            >
              {story.description}
            </p>
            <div
              className="flex items-center gap-8 pt-4"
              style={{ borderTop: "1px solid hsl(var(--foreground) / 0.2)" }}
            >
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.35em] mb-1"
                  style={{ color: "hsl(var(--accent) / 0.7)" }}
                >
                  Frames
                </p>
                <p className="font-display text-xl font-light tabular-nums">{story.frames}</p>
              </div>
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.35em] mb-1"
                  style={{ color: "hsl(var(--accent) / 0.7)" }}
                >
                  Since
                </p>
                <p className="font-display text-xl font-light tabular-nums">{story.since}</p>
              </div>
              <div className="ml-auto flex gap-1.5 items-center">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to series ${i + 1}`}
                    className="h-px transition-all duration-500"
                    style={{
                      width: active === i ? "1.5rem" : "0.5rem",
                      backgroundColor:
                        active === i ? "hsl(var(--accent))" : "hsl(var(--foreground) / 0.3)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Archive list */}
        <div className="hidden md:block px-6 py-12">
          <p
            className="text-[10px] uppercase tracking-[0.45em] mb-6"
            style={{ color: "hsl(var(--accent) / 0.7)" }}
          >
            Archive Index
          </p>
          <ul>
            {stories.map((s, i) => {
              const isActive = active === i;
              return (
                <li key={s.title}>
                  <button
                    onClick={() => {
                      setActive(i);
                      document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full flex items-baseline gap-4 py-5 text-left"
                    style={{
                      borderTop: "1px solid hsl(var(--border))",
                      borderBottom:
                        i === stories.length - 1 ? "1px solid hsl(var(--border))" : "none",
                    }}
                  >
                    <span
                      className="text-xs tabular-nums tracking-[0.2em]"
                      style={{
                        color: isActive ? "hsl(var(--accent))" : "hsl(var(--accent) / 0.45)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span
                        className="font-display text-xl font-light block leading-tight"
                        style={{
                          color: isActive ? "hsl(var(--foreground))" : "hsl(36 35% 96% / 0.6)",
                        }}
                      >
                        {s.title}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-[0.35em] mt-1.5 block"
                        style={{
                          color: isActive
                            ? "hsl(var(--muted-foreground))"
                            : "hsl(var(--muted-foreground) / 0.55)",
                        }}
                      >
                        {s.subject}
                      </span>
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: "hsl(var(--accent))",
                        opacity: isActive ? 1 : 0.3,
                      }}
                      aria-hidden
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ============== DESKTOP LAYOUT (scroll-driven) ============== */}
      <div
        ref={scrollRef}
        className="hidden lg:block relative"
        style={{ height: `${stories.length * 100}vh` }}
      >
      <div className="sticky top-0 h-screen flex flex-row items-stretch">
        {/* ============== LEFT — Archive index ============== */}
        <aside
          className="w-full lg:w-1/3 flex flex-col justify-between py-16 lg:py-20 px-8 lg:px-14"
          style={{ borderRight: "1px solid hsl(var(--border))" }}
        >
          <div className="space-y-12">
            {/* Section eyebrow */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.45em] mb-5 flex items-center gap-3"
                style={{ color: "hsl(var(--accent))" }}
              >
                <span className="h-px w-8" style={{ backgroundColor: "hsl(var(--accent))" }} />
                {storiesContent.eyebrow}
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-light leading-tight text-balance">
                {storiesContent.headline}
              </h2>
              <p
                className="mt-6 text-base leading-relaxed font-light max-w-md"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {storiesContent.intro}
              </p>
            </div>

            {/* Archive index */}
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.45em] mb-6"
                style={{ color: "hsl(var(--accent) / 0.7)" }}
              >
                Archive Index
              </p>
              <ul className="space-y-1">
                {stories.map((s, i) => {
                  const isActive = active === i;
                  return (
                    <li key={s.title}>
                      <button
                        onClick={() => setActive(i)}
                        className="group w-full flex items-baseline gap-5 py-4 text-left transition-colors duration-300"
                        style={{
                          borderTop: "1px solid hsl(var(--border))",
                          borderBottom:
                            i === stories.length - 1
                              ? "1px solid hsl(var(--border))"
                              : "none",
                        }}
                      >
                        <span
                          className="text-xs tabular-nums tracking-[0.2em] transition-colors duration-300"
                          style={{
                            color: isActive
                              ? "hsl(var(--accent))"
                              : "hsl(var(--accent) / 0.45)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span
                            className="font-display text-xl lg:text-2xl font-light block leading-tight transition-colors duration-300"
                            style={{
                              color: isActive
                                ? "hsl(var(--foreground))"
                                : "hsl(var(--foreground) / 0.55)",
                            }}
                          >
                            {s.title}
                          </span>
                          <span
                            className="text-[10px] uppercase tracking-[0.35em] mt-2 block transition-colors duration-300"
                            style={{
                              color: isActive
                                ? "hsl(var(--muted-foreground))"
                                : "hsl(var(--muted-foreground) / 0.55)",
                            }}
                          >
                            {s.subject}
                          </span>
                        </span>
                        <span
                          className="text-xs transition-all duration-300"
                          style={{
                            color: "hsl(var(--accent))",
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? "translateX(0)" : "translateX(-6px)",
                          }}
                          aria-hidden
                        >
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            className="mt-16 text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "hsl(var(--muted-foreground) / 0.55)" }}
          >
            The Archive · 2026
          </div>
        </aside>

        {/* ============== RIGHT — Featured plate (parallax) ============== */}
        <div className="w-full lg:w-2/3 relative overflow-hidden min-h-[80vh] lg:min-h-screen">
          {/* Parallax cross-fade images */}
          <div className="absolute inset-0">
            {stories.map((s, i) => (
              <Image
                key={s.title}
                src={s.src}
                alt={s.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover ease-smooth"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "scale(1.06)" : "scale(1)",
                  transition:
                    "opacity 1200ms ease, transform 9000ms ease-out",
                }}
              />
            ))}
            {/* Cinematic gradient */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--background) / 0.35) 0%, hsl(var(--background) / 0.55) 60%, hsl(var(--background) / 0.92) 100%)",
              }}
            />
            {/* Side shadow blending into ledger */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-32 hidden lg:block"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--background) / 0.85), transparent)",
              }}
            />
            {/* Grain */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              }}
            />
          </div>

          {/* Top-right plate counter */}
          <div className="absolute top-8 right-8 lg:top-10 lg:right-12 z-10 text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--foreground) / 0.7)" }}>
            Plate {String(active + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
          </div>

          {/* Bottom — story copy */}
          <div className="relative z-10 h-full flex items-end">
            <div className="w-full px-8 lg:px-16 pb-14 lg:pb-20 pt-24">
              <div
                className="text-[10px] uppercase tracking-[0.45em] mb-6"
                style={{ color: "hsl(var(--accent))" }}
              >
                N° {String(active + 1).padStart(2, "0")} · {story.subject}
              </div>
              <h3
                key={story.title}
                className="font-display text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight mb-8 max-w-3xl"
              >
                {story.title}
              </h3>
              <p
                className="text-base lg:text-lg leading-relaxed font-light max-w-xl mb-10"
                style={{ color: "hsl(var(--foreground) / 0.9)" }}
              >
                {story.description}
              </p>
              <div
                className="flex items-end gap-12 pt-6 max-w-md"
                style={{ borderTop: "1px solid hsl(var(--foreground) / 0.2)" }}
              >
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.35em] mb-2"
                    style={{ color: "hsl(var(--accent) / 0.7)" }}
                  >
                    Frames
                  </p>
                  <p className="font-display text-2xl lg:text-3xl font-light tabular-nums">
                    {story.frames}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.35em] mb-2"
                    style={{ color: "hsl(var(--accent) / 0.7)" }}
                  >
                    Since
                  </p>
                  <p className="font-display text-2xl lg:text-3xl font-light tabular-nums">
                    {story.since}
                  </p>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                  {stories.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Go to series ${i + 1}`}
                      className="h-px transition-all duration-500"
                      style={{
                        width: active === i ? "2rem" : "0.75rem",
                        backgroundColor:
                          active === i
                            ? "hsl(var(--accent))"
                            : "hsl(var(--foreground) / 0.3)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Stories;
