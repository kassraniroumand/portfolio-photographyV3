"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { closeImage } from "@/lib/store/slices/image-modal-slice";

export function ImageModal() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.imageModal.selected);

  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dispatch(closeImage());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, dispatch]);

  if (!selected) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => dispatch(closeImage())}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(closeImage());
        }}
        className="absolute right-4 top-4 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
      >
        Close
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-full max-w-full"
      >
        <Image
          src={selected.url}
          alt=""
          width={selected.width || 1600}
          height={selected.height || 1200}
          sizes="100vw"
          quality={85}
          priority
          placeholder={selected.blurDataURL ? "blur" : "empty"}
          blurDataURL={selected.blurDataURL ?? undefined}
          className="max-h-[90vh] w-auto max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
}
