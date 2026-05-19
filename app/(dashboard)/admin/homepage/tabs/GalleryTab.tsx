"use client"

import React from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { AdminContentFormValues } from "../form/adminContentSchema"
import { TextField } from "../component/TextField"
import { TextareaField } from "../component/TextareaField"
import { ImageField } from "../component/ImageField"
import { SectionSaveBar } from "../component/SectionSaveBar"
import { Button } from "@/components/ui/button"

type Props = {
    form: UseFormReturn<AdminContentFormValues>
}

const GalleryTab = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "gallery.works",
    })

    return (
        <div className="space-y-6 pt-6">
            <SectionSaveBar form={form} section="gallery" label="Gallery" />
            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="gallery.eyebrow" label="Eyebrow" />
                <TextField form={form} name="gallery.headline" label="Headline" />
                <div className="md:col-span-2">
                    <TextareaField form={form} name="gallery.intro" label="Intro" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Works</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({
                                src: "",
                                title: "",
                                category: "",
                                year: "",
                                location: "",
                                caption: "",
                                ratio: "4 / 5",
                            })
                        }
                    >
                        Add work
                    </Button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No works yet. Click “Add work” to create one.
                    </p>
                )}

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="space-y-4 rounded-md border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Work #{index + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => remove(index)}
                            >
                                Remove
                            </Button>
                        </div>

                        <ImageField
                            form={form}
                            name={`gallery.works.${index}.src`}
                            label="Image"
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <TextField
                                form={form}
                                name={`gallery.works.${index}.title`}
                                label="Title"
                            />
                            <TextField
                                form={form}
                                name={`gallery.works.${index}.category`}
                                label="Category"
                            />
                            <TextField
                                form={form}
                                name={`gallery.works.${index}.year`}
                                label="Year"
                            />
                            <TextField
                                form={form}
                                name={`gallery.works.${index}.location`}
                                label="Location"
                            />
                            <TextField
                                form={form}
                                name={`gallery.works.${index}.ratio`}
                                label="Ratio"
                                placeholder="4 / 5"
                            />
                        </div>

                        <TextareaField
                            form={form}
                            name={`gallery.works.${index}.caption`}
                            label="Caption"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GalleryTab
