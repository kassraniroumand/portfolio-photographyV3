"use client"

import React from "react"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema"
import { TextField } from "../../../homepage/component/TextField"
import { TextareaField } from "../../../homepage/component/TextareaField"
import { ImageField } from "../../../homepage/component/ImageField"
import { PortfolioSectionSaveBar } from "@/app/(dashboard)/admin/portfolio/page/component/PortfolioSectionSaveBar"
import { Button } from "@/components/ui/button"

type Props = {
    form: UseFormReturn<PortfolioFormValues>
}

const PhotosTab = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "photoCollections",
    })

    return (
        <div className="space-y-6 pt-6">
            <PortfolioSectionSaveBar
                form={form}
                section="photoCollections"
                label="Photo collections"
            />

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Photo collections</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        append({
                            slug: "",
                            title: "",
                            coverImages: ["", ""],
                            year: "",
                            location: "",
                            description: "",
                            photos: [],
                        })
                    }
                >
                    Add collection
                </Button>
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No photo collections yet. Click “Add collection” to create one.
                </p>
            )}

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <PhotoCollectionRow
                        key={field.id}
                        index={index}
                        form={form}
                        onRemove={() => remove(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default PhotosTab

function PhotoCollectionRow({
    index,
    form,
    onRemove,
}: {
    index: number
    form: UseFormReturn<PortfolioFormValues>
    onRemove: () => void
}) {
    const {
        fields: photoFields,
        append: appendPhoto,
        remove: removePhoto,
    } = useFieldArray({
        control: form.control,
        name: `photoCollections.${index}.photos`,
    })

    const base = `photoCollections.${index}` as const

    return (
        <div className="space-y-4 rounded-md border p-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                    Collection #{index + 1}
                </span>
                <Button type="button" variant="ghost" onClick={onRemove}>
                    Remove
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ImageField
                    form={form}
                    name={`${base}.coverImages.0`}
                    label="Cover image 1"
                />
                <ImageField
                    form={form}
                    name={`${base}.coverImages.1`}
                    label="Cover image 2"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name={`${base}.title`} label="Title" />
                <TextField
                    form={form}
                    name={`${base}.slug`}
                    label="Slug"
                    placeholder="lowercase-with-dashes"
                    description="Used for the in-page anchor: /portfolio#[slug]"
                />
                <TextField form={form} name={`${base}.year`} label="Year" />
                <TextField
                    form={form}
                    name={`${base}.location`}
                    label="Location"
                />
            </div>

            <TextareaField
                form={form}
                name={`${base}.description`}
                label="Description"
            />

            <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Photos</h4>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            appendPhoto({ src: "", alt: "", caption: "" })
                        }
                    >
                        Add photo
                    </Button>
                </div>

                {photoFields.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                        No photos yet.
                    </p>
                )}

                {photoFields.map((photo, k) => (
                    <div
                        key={photo.id}
                        className="space-y-3 rounded-md border bg-muted/30 p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">
                                Photo #{k + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhoto(k)}
                            >
                                Remove
                            </Button>
                        </div>
                        <ImageField
                            form={form}
                            name={`${base}.photos.${k}.src`}
                            label="Image"
                        />
                        <div className="grid gap-3 md:grid-cols-2">
                            <TextField
                                form={form}
                                name={`${base}.photos.${k}.alt`}
                                label="Alt text"
                            />
                            <TextField
                                form={form}
                                name={`${base}.photos.${k}.caption`}
                                label="Caption"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
