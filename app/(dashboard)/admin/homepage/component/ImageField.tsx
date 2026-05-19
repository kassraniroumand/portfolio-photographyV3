"use client"

import { useCallback, useEffect, useState } from "react"
import type { FieldValues } from "react-hook-form"
import NextImage from "next/image"
import { useDropzone } from "react-dropzone"

import { getNestedError } from "../component/PropsُType"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    useListImagesQuery,
    useUploadImageMutation,
} from "@/lib/store/api"
import type { TextInputFieldProps } from "../component/PropsُType"

export function ImageField<T extends FieldValues>({
    form,
    name,
    label,
    description,
    placeholder,
}: TextInputFieldProps<T>) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = form
    const fieldError = getNestedError(errors, name)
    const [pickerOpen, setPickerOpen] = useState(false)

    const value = watch(name) as string | undefined

    return (
        <Field data-invalid={!!fieldError}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <div className="flex gap-2">
                <Input
                    id={name}
                    type="text"
                    placeholder={placeholder ?? "https://…"}
                    aria-invalid={!!fieldError}
                    {...register(name)}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPickerOpen(true)}
                >
                    Browse
                </Button>
            </div>

            {value ? (
                <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border bg-muted">
                    <NextImage
                        src={value}
                        alt={`${label} preview`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-contain"
                    />
                </div>
            ) : null}

            {description && <FieldDescription>{description}</FieldDescription>}

            {fieldError?.message && (
                <FieldError>{String(fieldError.message)}</FieldError>
            )}

            {pickerOpen && (
                <ImagePickerModal
                    onClose={() => setPickerOpen(false)}
                    onSelect={(url) => {
                        setValue(name, url as never, {
                            shouldDirty: true,
                            shouldValidate: true,
                        })
                        setPickerOpen(false)
                    }}
                />
            )}
        </Field>
    )
}

type ImagePickerModalProps = {
    onClose: () => void
    onSelect: (url: string) => void
}

function ImagePickerModal({ onClose, onSelect }: ImagePickerModalProps) {
    const { data: images = [], isLoading } = useListImagesQuery()
    const [uploadImage, { isLoading: uploading }] = useUploadImageMutation()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    const onDrop = useCallback(
        async (accepted: File[]) => {
            if (accepted.length === 0) return
            setError(null)
            try {
                for (const file of accepted) {
                    const fd = new FormData()
                    fd.append("file", file)
                    await uploadImage(fd).unwrap()
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "upload failed")
            }
        },
        [uploadImage],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        disabled: uploading,
    })

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
                            Select image
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "Loading…" : `${images.length} images`}
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
                            <p className="text-muted-foreground">Uploading…</p>
                        ) : isDragActive ? (
                            <p className="text-foreground">Drop the images here</p>
                        ) : (
                            <>
                                <p className="text-foreground">
                                    Drag images here, or click to select
                                </p>
                                <p className="text-muted-foreground">
                                    PNG, JPG, WEBP, GIF
                                </p>
                            </>
                        )}
                    </div>

                    {error && (
                        <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}

                    {images.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No images yet.
                        </p>
                    ) : (
                        <ul className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>li]:mb-3">
                            {images.map((image) => (
                                <li
                                    key={image.id}
                                    className="break-inside-avoid overflow-hidden rounded-md border bg-background"
                                >
                                    <button
                                        type="button"
                                        onClick={() => onSelect(image.url)}
                                        className="block w-full"
                                    >
                                        <NextImage
                                            src={image.url}
                                            alt=""
                                            width={image.width || 1200}
                                            height={image.height || 900}
                                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                            quality={85}
                                            placeholder={
                                                image.blurDataURL ? "blur" : "empty"
                                            }
                                            blurDataURL={
                                                image.blurDataURL ?? undefined
                                            }
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
    )
}
