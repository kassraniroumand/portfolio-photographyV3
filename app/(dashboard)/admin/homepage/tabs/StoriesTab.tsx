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

const StoriesTab = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "stories.items",
    })

    return (
        <div className="space-y-6 pt-6">
            <SectionSaveBar form={form} section="stories" label="Stories" />
            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="stories.eyebrow" label="Eyebrow" />
                <TextField form={form} name="stories.headline" label="Headline" />
                <div className="md:col-span-2">
                    <TextareaField form={form} name="stories.intro" label="Intro" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Items</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({
                                src: "",
                                alt: "",
                                title: "",
                                subject: "",
                                description: "",
                                frames: "",
                                since: "",
                            })
                        }
                    >
                        Add item
                    </Button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No items yet. Click “Add item” to create one.
                    </p>
                )}

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="space-y-4 rounded-md border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Item #{index + 1}
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
                            name={`stories.items.${index}.src`}
                            label="Image"
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <TextField
                                form={form}
                                name={`stories.items.${index}.alt`}
                                label="Alt text"
                            />
                            <TextField
                                form={form}
                                name={`stories.items.${index}.title`}
                                label="Title"
                            />
                            <TextField
                                form={form}
                                name={`stories.items.${index}.subject`}
                                label="Subject"
                            />
                            <TextField
                                form={form}
                                name={`stories.items.${index}.frames`}
                                label="Frames"
                            />
                            <TextField
                                form={form}
                                name={`stories.items.${index}.since`}
                                label="Since"
                            />
                        </div>

                        <TextareaField
                            form={form}
                            name={`stories.items.${index}.description`}
                            label="Description"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StoriesTab
