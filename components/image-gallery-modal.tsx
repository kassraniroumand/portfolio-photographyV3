"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  useListImagesQuery,
  useUploadImageMutation,
} from "@/lib/store/api";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { closeGallery } from "@/lib/store/slices/image-gallery-slice";
import { openImage } from "@/lib/store/slices/image-modal-slice";

export function ImageGalleryModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.imageGallery.open);

  const { data: images = [], isLoading } = useListImagesQuery(undefined, {
    skip: !open,
  });
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dispatch(closeGallery());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dispatch]);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;
      setError(null);
      try {
        for (const file of accepted) {
          const fd = new FormData();
          fd.append("file", file);
          await uploadImage(fd).unwrap();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "upload failed");
      }
    },
    [uploadImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: uploading,
  });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => dispatch(closeGallery())}
      className="fixed inset-0 z-40 flex items-stretch justify-center bg-black/60 p-4 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-6xl flex-col overflow-hidden rounded-lg border bg-background shadow-2xl"
      >
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Images
            </h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading…" : `${images.length} images`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeGallery())}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div
            {...getRootProps()}
            className={`mb-6 flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-6 py-10 text-sm transition-colors ${
              isDragActive
                ? "border-foreground bg-muted"
                : "border-muted-foreground/30 bg-background"
            } ${uploading ? "opacity-60" : "cursor-pointer"}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <p className="text-muted-foreground">Uploading…</p>
            ) : isDragActive ? (
              <p className="text-foreground">Drop the images here</p>
            ) : (
              <>
                <p className="text-foreground">
                  Drag images here, or click to select
                </p>
                <p className="text-muted-foreground">PNG, JPG, WEBP, GIF</p>
              </>
            )}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground">No images yet.</p>
          ) : (
            <ul className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>li]:mb-3">
              {images.map((image) => (
                <li
                  key={image.id}
                  className="break-inside-avoid overflow-hidden rounded-md border bg-background"
                >
                  <button
                    type="button"
                    onClick={() => dispatch(openImage(image))}
                    className="block w-full"
                  >
                    <Image
                      src={image.url}
                      alt=""
                      width={image.width || 1200}
                      height={image.height || 900}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      quality={85}
                      placeholder={image.blurDataURL ? "blur" : "empty"}
                      blurDataURL={image.blurDataURL ?? undefined}
                      className="h-auto w-full"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
