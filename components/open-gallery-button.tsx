"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { openGallery } from "@/lib/store/slices/image-gallery-slice";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function OpenGalleryButton({ className, children }: Props) {
  const dispatch = useAppDispatch();
  return (
    <button
      type="button"
      onClick={() => dispatch(openGallery())}
      className={
        className ??
        "rounded-md px-2 py-1.5 text-left text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
      }
    >
      {children ?? "Images"}
    </button>
  );
}
