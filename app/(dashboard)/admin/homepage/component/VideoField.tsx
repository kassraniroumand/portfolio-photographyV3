"use client";

import { useCallback, useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { upload } from "@vercel/blob/client";

import { getNestedError } from "../component/PropsُType";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useDeleteVideoMutation,
  useInvalidateVideosMutation,
  useListVideosQuery,
} from "@/lib/store/api";
import type { TextInputFieldProps } from "../component/PropsُType";

export type VideoMetadata = {
  url: string;
  aspectRatio: number;
};

type VideoFieldProps<T extends FieldValues> = TextInputFieldProps<T> & {
  onMetadata?: (meta: VideoMetadata) => void;
};

async function readAspectRatio(src: string): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement("video");
    el.preload = "metadata";
    el.muted = true;
    el.crossOrigin = "anonymous";
    el.src = src;
    el.onloadedmetadata = () => {
      const ratio = el.videoWidth / el.videoHeight;
      resolve(
        Number.isFinite(ratio) && ratio > 0
          ? Math.round(ratio * 10000) / 10000
          : 16 / 9,
      );
    };
    el.onerror = () => resolve(16 / 9);
  });
}

export function VideoField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  onMetadata,
}: VideoFieldProps<T>) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const fieldError = getNestedError(errors, name);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  const value = watch(name) as string | undefined;

  const commit = async (url: string) => {
    setValue(name, url as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (onMetadata) {
      const aspectRatio = await readAspectRatio(url);
      onMetadata({ url, aspectRatio });
    }
  };

  const detect = async () => {
    if (!value || !onMetadata) return;
    setDetecting(true);
    setDetectError(null);
    try {
      const aspectRatio = await readAspectRatio(value);
      onMetadata({ url: value, aspectRatio });
    } catch (e) {
      setDetectError(e instanceof Error ? e.message : "could not detect ratio");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <Field data-invalid={!!fieldError}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <div className="flex gap-2">
        <Input
          id={name}
          type="text"
          placeholder={placeholder ?? "https://… (mp4, webm, mov)"}
          aria-invalid={!!fieldError}
          {...register(name)}
        />
        {onMetadata && (
          <Button
            type="button"
            variant="outline"
            onClick={detect}
            disabled={!value || detecting}
          >
            {detecting ? "Detecting…" : "Detect ratio"}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(true)}
        >
          Browse
        </Button>
      </div>

      {detectError && (
        <p className="text-xs text-red-600 dark:text-red-400">{detectError}</p>
      )}

      {value ? (
        <video
          src={value}
          controls
          preload="metadata"
          className="mt-2 max-h-60 w-full rounded-md border bg-muted"
        />
      ) : null}

      {description && <FieldDescription>{description}</FieldDescription>}

      {fieldError?.message && (
        <FieldError>{String(fieldError.message)}</FieldError>
      )}

      {pickerOpen && (
        <VideoPickerModal
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            void commit(url);
            setPickerOpen(false);
          }}
        />
      )}
    </Field>
  );
}

type VideoPickerModalProps = {
  onClose: () => void;
  onSelect: (url: string) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function VideoPickerModal({ onClose, onSelect }: VideoPickerModalProps) {
  const { data: videos = [], isLoading } = useListVideosQuery();
  const [invalidateVideos] = useInvalidateVideosMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;
      setError(null);
      setUploading(true);
      try {
        for (const file of accepted) {
          await upload(`videos/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/videos",
            onUploadProgress: (e) => setProgress(e.percentage),
          });
        }
        await invalidateVideos().unwrap();
      } catch (e) {
        setError(e instanceof Error ? e.message : "upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [invalidateVideos],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    disabled: uploading,
    multiple: false,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 p-4 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-6xl flex-col overflow-hidden rounded-lg border bg-background shadow-2xl"
      >
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Select video
            </h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading…" : `${videos.length} videos`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
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
              <p className="text-muted-foreground">
                Uploading… {progress > 0 ? `${progress.toFixed(0)}%` : ""}
              </p>
            ) : isDragActive ? (
              <p className="text-foreground">Drop the video here</p>
            ) : (
              <>
                <p className="text-foreground">
                  Drag a video here, or click to select
                </p>
                <p className="text-muted-foreground">MP4, WEBM, MOV, OGG</p>
              </>
            )}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos yet.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <li
                  key={video.pathname}
                  className="overflow-hidden rounded-md border bg-background"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(video.url)}
                    className="block w-full text-left"
                  >
                    <video
                      src={video.url}
                      preload="metadata"
                      muted
                      playsInline
                      className="aspect-video w-full bg-black object-cover"
                    />
                  </button>
                  <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                    <span
                      className="truncate text-muted-foreground"
                      title={video.pathname}
                    >
                      {video.pathname.replace(/^videos\//, "")}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-muted-foreground">
                        {formatSize(video.size)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this video?")) {
                            deleteVideo(video.url);
                          }
                        }}
                        className="rounded border px-2 py-0.5 text-xs hover:bg-muted"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
