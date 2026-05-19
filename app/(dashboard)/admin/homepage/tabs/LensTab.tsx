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

const LensTab = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lens.frames",
    })

    return (
        <div className="space-y-6 pt-6">
            <SectionSaveBar form={form} section="lens" label="Lens" />
            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="lens.eyebrow" label="Eyebrow" />
                <TextField form={form} name="lens.headline" label="Headline" />
                <div className="md:col-span-2">
                    <TextareaField form={form} name="lens.intro" label="Intro" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Frames</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({
                                src: "",
                                alt: "",
                                caption: "",
                                location: "",
                            })
                        }
                    >
                        Add frame
                    </Button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No frames yet. Click “Add frame” to create one.
                    </p>
                )}

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="space-y-4 rounded-md border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Frame #{index + 1}
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
                            name={`lens.frames.${index}.src`}
                            label="Image"
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <TextField
                                form={form}
                                name={`lens.frames.${index}.alt`}
                                label="Alt text"
                            />
                            <TextField
                                form={form}
                                name={`lens.frames.${index}.location`}
                                label="Location"
                            />
                        </div>

                        <TextareaField
                            form={form}
                            name={`lens.frames.${index}.caption`}
                            label="Caption"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LensTab
