"use client"

import React from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { AdminContentFormValues } from "../form/adminContentSchema"
import { TextField } from "../component/TextField"
import { TextareaField } from "../component/TextareaField"
import { ImageField } from "../component/ImageField"
import { SectionSaveBar } from "../component/SectionSaveBar"
import { TagsField } from "../component/TagsField"
import { Button } from "@/components/ui/button"

type Props = {
    form: UseFormReturn<AdminContentFormValues>
}

const ServicesTab = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "services.items",
    })

    return (
        <div className="space-y-6 pt-6">
            <SectionSaveBar form={form} section="services" label="Services" />
            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="services.eyebrow" label="Eyebrow" />
                <TextField form={form} name="services.headline" label="Headline" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Items</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({
                                index: "",
                                title: "",
                                description: "",
                                tags: [],
                                image: "",
                                alt: "",
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
                            name={`services.items.${index}.image`}
                            label="Image"
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <TextField
                                form={form}
                                name={`services.items.${index}.index`}
                                label="Index"
                            />
                            <TextField
                                form={form}
                                name={`services.items.${index}.title`}
                                label="Title"
                            />
                            <TextField
                                form={form}
                                name={`services.items.${index}.alt`}
                                label="Alt text"
                            />
                        </div>

                        <TextareaField
                            form={form}
                            name={`services.items.${index}.description`}
                            label="Description"
                        />

                        <TagsField
                            form={form}
                            name={`services.items.${index}.tags`}
                            label="Tags"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ServicesTab
