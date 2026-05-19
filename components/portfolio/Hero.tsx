"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
};

const Hero = ({ hero }: { hero: AdminContentFormValues["hero"] }) => {
  const portrait = hero.leftImage;
  const landscape = hero.rightImage;
  const photographer = hero.insetImage;
  const left = useReveal<HTMLDivElement>();
  const right = useReveal<HTMLDivElement>();

  const reveal = (visible: boolean, delay = 0) => ({
    transition:
      "opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)",
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
  });

  return (
    <section className="relative w-full min-h-[100svh] bg-background grain overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100svh]">
        {/* LEFT — dark portrait + floating white card */}
        <div
          ref={left.ref}
          className="relative bg-[hsl(0_0%_4%)] overflow-hidden flex items-center justify-center pt-32 pb-40 lg:py-0"
        >
          <Image
            src={portrait}
            alt="Silhouette portrait — Halcyon Studio"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-90 select-none transition-transform duration-[2200ms] ease-smooth"
            draggable={false}
            style={{
              ...reveal(left.visible),
              transform: left.visible
                ? "translateY(0) scale(1)"
                : "translateY(28px) scale(1.06)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/60" />

          {/* top meta — hidden on mobile to avoid colliding with nav */}
          <div
            className="absolute top-24 left-6 lg:left-12 right-6 lg:right-12 hidden lg:flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground z-10"
            style={reveal(left.visible, 100)}
          >
            <span className="font-display text-foreground text-2xl normal-case tracking-tight">
              h<span className="text-accent">.</span>
            </span>
            <span>{hero.leftMetaName}</span>
          </div>

          {/* white editorial card */}
          <article
            className="relative z-10 bg-foreground text-background flex flex-col justify-between shadow-cinematic"
            style={{
              width: "min(82%, 460px)",
              aspectRatio: "3 / 4",
              padding: "clamp(1.25rem, 3.2vw, 2.5rem)",
              ...reveal(left.visible, 250),
            }}
          >
            <header
              className="flex items-center justify-between tracking-wide text-background/60"
              style={{ fontSize: "clamp(0.625rem, 1vw, 0.75rem)" }}
            >
              <span>{hero.cardName}</span>
              <span>{hero.cardLocation}</span>
            </header>

            <div className="flex-1" />

            <div style={{ rowGap: "clamp(0.5rem, 1.2vw, 1rem)" }} className="flex flex-col">
              <p
                className="uppercase tracking-[0.25em] text-background/60"
                style={{ fontSize: "clamp(0.625rem, 1vw, 0.75rem)" }}
              >
                {hero.cardEyebrow}
              </p>
              <h1
                className="font-sans-tight font-semibold text-balance relative"
                style={{
                  fontSize: "clamp(1.5rem, 3.4vw, 2.75rem)",
                  lineHeight: 1.05,
                }}
              >
                {hero.cardHeadlineLine1}
                <br />
                {hero.cardHeadlineLine2}
                <sup className="absolute -top-1 ml-2 text-[10px] font-normal tracking-widest text-background/50">
                  {"{ 1* }"}
                </sup>
              </h1>
            </div>
          </article>

          {/* bottom caption */}
          <p
            className="absolute bottom-6 lg:bottom-10 left-6 lg:left-12 right-6 lg:right-12 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground z-10"
            style={reveal(left.visible, 450)}
          >
            <span className="block mb-2 text-foreground/50">{"{ 1* }"}</span>
            {hero.bottomCaptionLine1}{" "}
            <br className="hidden sm:block" />
            {hero.bottomCaptionLine2}
          </p>
        </div>

        {/* RIGHT — landscape with serif overlay */}
        <div
          ref={right.ref}
          className="relative overflow-hidden min-h-[100svh] lg:min-h-0 pt-28 pb-32 lg:py-0"
        >
          <div className="absolute inset-0">
            <Image
              src={landscape}
              alt="Bali, Jatiluwih Rice Fields"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[2400ms] ease-smooth"
              style={{
                ...reveal(right.visible),
                transform: right.visible
                  ? "translateY(0) scale(1)"
                  : "translateY(28px) scale(1.08)",
              }}
            />
          </div>
          <div className="absolute inset-0 bg-background/30" />

          {/* top right caption */}
          <div
            className="absolute top-24 right-6 lg:right-12 z-10 text-right hidden sm:block"
            style={reveal(right.visible, 150)}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/70">{hero.rightImageLabel}</p>
            <p className="font-display italic text-sm text-foreground/90 mt-1">
              {hero.rightImageCaption}
            </p>
          </div>

          {/* center serif headline with inset photo */}
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10">
            <div className="relative w-full max-w-[42rem]" style={reveal(right.visible, 300)}>
              <span className="absolute -top-6 right-2 text-[10px] tracking-widest text-foreground/70">
                {"{ 2* }"}
              </span>
              <h2
                className="font-display font-light text-foreground tracking-tight text-center"
                style={{
                  fontSize: "clamp(2.75rem, 9vw, 7rem)",
                  lineHeight: 0.95,
                }}
              >
                <span
                  className="block"
                  style={reveal(right.visible, 400)}
                >
                  {hero.rightHeadlineTop}
                </span>
                <span
                  className="flex items-center justify-center"
                  style={{ gap: "clamp(0.5rem, 1.5vw, 1.25rem)", ...reveal(right.visible, 550) }}
                >
                  <span>{hero.rightHeadlineMid1}</span>
                  <span
                    className="relative inline-block align-middle shadow-cinematic overflow-hidden"
                    style={{
                      width: "clamp(2.75rem, 8vw, 7rem)",
                      height: "clamp(2.75rem, 8vw, 7rem)",
                    }}
                  >
                    <Image
                      src={photographer}
                      alt="Photographer at work in the field"
                      fill
                      sizes="(min-width: 1024px) 8vw, 12vw"
                      className="object-cover"
                    />
                  </span>
                  <span>{hero.rightHeadlineMid2}</span>
                </span>
              </h2>
            </div>
          </div>

          {/* bottom right block */}
          <div
            className="absolute bottom-10 left-6 lg:left-12 right-6 lg:right-12 text-center z-10 space-y-3"
            style={reveal(right.visible, 700)}
          >
            <p className="text-[10px] tracking-widest text-foreground/60">{"{ 2* }"}</p>
            <p className="font-display italic text-base sm:text-lg text-foreground/90 leading-snug">
              {hero.rightItalic1}<br />
              {hero.rightItalic2}
            </p>
            <a
              href="#work"
              className="inline-block text-xs uppercase tracking-[0.3em] border-b border-foreground/50 pb-1"
            >
              {hero.exploreLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
