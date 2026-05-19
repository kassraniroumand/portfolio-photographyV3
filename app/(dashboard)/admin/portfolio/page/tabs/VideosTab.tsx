"use client"

import React from "react"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema"
import { TextField } from "../../../homepage/component/TextField"
import { TextareaField } from "../../../homepage/component/TextareaField"
import { VideoField } from "../../../homepage/component/VideoField"
import { PortfolioSectionSaveBar } from "@/app/(dashboard)/admin/portfolio/page/component/PortfolioSectionSaveBar"
import { Button } from "@/components/ui/button"

type Props = {
    form: UseFormReturn<PortfolioFormValues>
}

const VideosTab = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "videoCollections",
    })

    return (
        <div className="space-y-6 pt-6">
            <PortfolioSectionSaveBar
                form={form}
                section="videoCollections"
                label="Video collections"
            />

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Video collections</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        append({
                            slug: "",
                            title: "",
                            year: "",
                            location: "",
                            description: "",
                            videos: [],
                        })
                    }
                >
                    Add collection
                </Button>
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No video collections yet. Click “Add collection” to create one.
                </p>
            )}

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <VideoCollectionRow
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

export default VideosTab

function VideoCollectionRow({
    index,
    form,
    onRemove,
}: {
    index: number
    form: UseFormReturn<PortfolioFormValues>
    onRemove: () => void
}) {
    const {
        fields: videoFields,
        append: appendVideo,
        remove: removeVideo,
    } = useFieldArray({
        control: form.control,
        name: `videoCollections.${index}.videos`,
    })

    const base = `videoCollections.${index}` as const

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
                    <h4 className="text-sm font-medium">Videos</h4>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            appendVideo({
                                src: "",
                                aspectRatio: 16 / 9,
                                alt: "",
                                caption: "",
                            })
                        }
                    >
                        Add video
                    </Button>
                </div>

                {videoFields.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                        No videos yet.
                    </p>
                )}

                {videoFields.map((video, k) => (
                    <div
                        key={video.id}
                        className="space-y-3 rounded-md border bg-muted/30 p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">
                                Video #{k + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVideo(k)}
                            >
                                Remove
                            </Button>
                        </div>
                        <VideoField
                            form={form}
                            name={`${base}.videos.${k}.src`}
                            label="Video"
                            description="Upload an MP4/WEBM/MOV or paste a hosted URL."
                            onMetadata={(meta) =>
                                form.setValue(
                                    `${base}.videos.${k}.aspectRatio`,
                                    meta.aspectRatio,
                                    { shouldDirty: true, shouldValidate: true },
                                )
                            }
                        />
                        <div className="grid gap-3 md:grid-cols-2">
                            <TextField
                                form={form}
                                name={`${base}.videos.${k}.alt`}
                                label="Alt text"
                            />
                            <TextField
                                form={form}
                                name={`${base}.videos.${k}.caption`}
                                label="Caption"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
