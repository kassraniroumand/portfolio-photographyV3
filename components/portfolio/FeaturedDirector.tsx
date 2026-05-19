import { Play, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import still from "@/assets/feature-still.jpg";

const FeaturedDirector = () => {
  return (
    <section
      id="featured"
      className="relative bg-[hsl(0_0%_4%)] text-background overflow-hidden py-20 lg:py-32"
      aria-label="Featured director"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[35rem] w-[35rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.3), transparent 60%)" }}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
        {/* Section eyebrow */}
        <div className="flex items-end justify-between mb-12 lg:mb-16 gap-8 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-accent mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              Featured Director · 2025
            </p>
            <h2 className="font-display text-6xl lg:text-8xl font-light leading-[0.95] text-balance max-w-3xl">
              Mira Castellanos
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-background/60 hover:text-accent transition-colors"
          >
            View full reel
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Magazine grid — asymmetric tiles */}
        <div className="grid grid-cols-12 auto-rows-[8rem] lg:auto-rows-[10rem] gap-3 lg:gap-4">
          {/* Hero still — large left tile */}
          <figure className="col-span-12 lg:col-span-8 row-span-3 lg:row-span-4 relative overflow-hidden bg-background/5 group">
            <Image
              src={still}
              alt="Film still — Lily Chan & The Doom Girls"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 66vw, 100vw"
              placeholder="blur"
              className="object-cover transition-transform duration-[2000ms] ease-smooth group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0_0%_4%)] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-accent mb-2">Music Video</p>
                <p className="font-display text-3xl lg:text-4xl font-light leading-tight">
                  Lily Chan &amp; The Doom Girls
                </p>
              </div>
              <button
                type="button"
                aria-label="Play featured film"
                className="group/play shrink-0 flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full ring-1 ring-background/40 bg-background/10 backdrop-blur-md transition-all duration-500 hover:bg-background hover:ring-background"
              >
                <Play
                  className="h-5 w-5 lg:h-6 lg:w-6 translate-x-[2px] transition-colors duration-500 group-hover/play:text-foreground"
                  strokeWidth={0.8}
                  fill="currentColor"
                />
              </button>
            </div>
            <span className="absolute top-5 left-5 text-[9px] uppercase tracking-[0.4em] text-background/70">
              Reel 04 / 12
            </span>
          </figure>

          {/* Bio card — top right */}
          <div className="col-span-12 lg:col-span-4 row-span-2 relative bg-background/[0.03] border border-background/10 p-6 lg:p-7 flex flex-col justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-background/40">Bio · 01</p>
            <p className="text-base lg:text-lg text-background/85 leading-relaxed font-light">
              A music video director and visual artist known for her
              collaborations with globally recognized avant-garde musicians.
            </p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-accent">
              Mexico City — Berlin
            </p>
          </div>

          {/* Stats card */}
          <div className="col-span-6 lg:col-span-2 row-span-2 relative bg-background/[0.03] border border-background/10 p-5 flex flex-col justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-background/40">Run-time</p>
            <p className="font-display text-4xl lg:text-5xl font-light">04:12</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-background/50">Minutes</p>
          </div>

          {/* Format card */}
          <div className="col-span-6 lg:col-span-2 row-span-2 relative bg-accent text-background p-5 flex flex-col justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-background/70">Shot on</p>
            <p className="font-display text-4xl lg:text-5xl font-light">35<span className="text-2xl">mm</span></p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-background/70">Kodak Vision3</p>
          </div>

          {/* Quote / pull-text card */}
          <div className="col-span-12 lg:col-span-5 row-span-2 relative bg-background/[0.03] border border-background/10 p-6 lg:p-8 flex flex-col justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-background/40">Director's note</p>
            <p className="font-display text-2xl lg:text-3xl font-light leading-snug text-balance">
              "I wanted to film silence — the kind that hums between two people who already know each other."
            </p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-background/50">— M.C.</p>
          </div>

          {/* Year tile */}
          <div className="col-span-6 lg:col-span-3 row-span-2 relative bg-background text-foreground p-6 flex flex-col justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/50">Year</p>
            <p className="font-display text-5xl lg:text-6xl font-light leading-none">2025</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-foreground/60">Premiere · SXSW</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDirector;
