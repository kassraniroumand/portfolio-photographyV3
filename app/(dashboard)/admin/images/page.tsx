"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  useDeleteImageMutation,
  useListImagesQuery,
  useUploadImageMutation,
} from "@/lib/store/api";
import { useAppDispatch } from "@/lib/store/hooks";
import { openImage } from "@/lib/store/slices/image-modal-slice";

export default function ImagesPage() {
  const { data: images = [], isLoading } = useListImagesQuery();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    setError(null);
    setDeletingId(id);
    try {
      await deleteImage(id).unwrap();
    } catch (e) {
      setError(e instanceof Error ? e.message : "delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Images
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${images.length} images`}
        </p>
      </header>

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-6 py-12 text-sm transition-colors ${
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
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {images.length > 0 && (
        <ul className="columns-2 gap-3 md:columns-3 [&>li]:mb-3">
          {images.map((image) => (
            <li
              key={image.id}
              className="group relative break-inside-avoid overflow-hidden rounded-md border bg-background"
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
                  sizes="(min-width: 768px) 33vw, 50vw"
                  quality={85}
                  placeholder={image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={image.blurDataURL ?? undefined}
                  className="h-auto w-full"
                />
              </button>
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => copyUrl(image.url)}
                  className="rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="rounded-md bg-red-600/80 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {deletingId === image.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
