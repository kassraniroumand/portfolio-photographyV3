"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxWork = {
  src: string;
  title: string;
  category: string;
  year: string;
  location: string;
  caption?: string;
};

interface LightboxProps {
  works: LightboxWork[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

const Lightbox = ({ works, index, onClose, onIndexChange }: LightboxProps) => {
  const isOpen = index !== null;

  const next = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % works.length);
  }, [index, works.length, onIndexChange]);

  const prev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + works.length) % works.length);
  }, [index, works.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, next, prev, onClose]);

  if (!isOpen) return null;
  const w = works[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${w.title} — enlarged view`}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
      style={{ animation: "fade-in-slow 280ms ease-out both" }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 lg:px-12 py-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>
          <span className="text-foreground/60">N°</span> {String(index + 1).padStart(3, "0")} /{" "}
          {String(works.length).padStart(3, "0")}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close lightbox"
          className="group flex items-center gap-2 hover:text-accent transition-colors duration-300"
        >
          <span className="hidden sm:inline">Close</span>
          <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous image"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 text-muted-foreground hover:text-accent transition-colors duration-300"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next image"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 text-muted-foreground hover:text-accent transition-colors duration-300"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Edge swipe zones — sit above buttons, capture touch swipes near screen edges */}
      <EdgeSwipe side="left" onSwipeLeft={next} onSwipeRight={prev} />
      <EdgeSwipe side="right" onSwipeLeft={next} onSwipeRight={prev} />

      {/* Image + caption — swipeable on touch */}
      <SwipeArea onSwipeLeft={next} onSwipeRight={prev}>
        <figure
          key={w.src}
          className="flex flex-col items-center gap-6 max-h-full"
          style={{
            animation: "scale-in 480ms cubic-bezier(0.22,1,0.36,1) both",
            willChange: "transform, opacity",
          }}
        >
          <Image
            src={w.src}
            alt={`${w.title} — ${w.category} photography in ${w.location}`}
            width={1920}
            height={1280}
            sizes="(min-width: 1024px) 80vw, 100vw"
            draggable={false}
            className="max-h-[75vh] max-w-full h-auto w-auto object-contain shadow-cinematic select-none"
          />
          <figcaption className="text-center max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-2">
              {w.category} · {w.location} · {w.year}
            </p>
            <h3 className="font-display text-3xl lg:text-4xl font-light">{w.title}</h3>
            {w.caption && (
              <p className="text-muted-foreground text-sm mt-3 leading-relaxed italic">
                {w.caption}
              </p>
            )}
          </figcaption>
        </figure>
      </SwipeArea>
    </div>
  );
};

interface SwipeAreaProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 60;
const MAX_VERTICAL = 80;

const SwipeArea = ({ onSwipeLeft, onSwipeRight, children }: SwipeAreaProps) => {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const deltaX = e.clientX - start.current.x;
    const deltaY = e.clientY - start.current.y;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    setDx(deltaX);
  };

  const finish = (e: React.PointerEvent) => {
    if (!start.current) return;
    const deltaX = e.clientX - start.current.x;
    const deltaY = e.clientY - start.current.y;
    if (Math.abs(deltaY) < MAX_VERTICAL && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) onSwipeLeft();
      else onSwipeRight();
    }
    start.current = null;
    setDx(0);
    setDragging(false);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-20 py-20 touch-pan-y"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      style={{
        transform: `translateX(${dx * 0.4}px)`,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
};

interface EdgeSwipeProps {
  side: "left" | "right";
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const EdgeSwipe = ({ side, onSwipeLeft, onSwipeRight }: EdgeSwipeProps) => {
  const start = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    if (Math.abs(e.clientX - start.current.x) > 10) moved.current = true;
  };

  const finish = (e: React.PointerEvent) => {
    if (!start.current) return;
    const deltaX = e.clientX - start.current.x;
    const deltaY = e.clientY - start.current.y;
    if (Math.abs(deltaY) < MAX_VERTICAL && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) onSwipeLeft();
      else onSwipeRight();
    }
    start.current = null;
  };

  const onClick = (e: React.MouseEvent) => {
    // Prevent closing the lightbox when the user actually swiped within the edge zone
    if (moved.current) e.stopPropagation();
  };

  return (
    <div
      aria-hidden="true"
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      className={`absolute top-20 bottom-20 z-10 w-20 sm:w-24 touch-pan-y ${
        side === "left" ? "left-0" : "right-0"
      }`}
    />
  );
};

export default Lightbox;
