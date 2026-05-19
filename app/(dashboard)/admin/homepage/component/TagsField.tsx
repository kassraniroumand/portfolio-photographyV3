"use client"

import { useState } from "react"
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

type Props<T extends FieldValues> = {
    form: UseFormReturn<T>
    name: FieldPath<T>
    label: string
    placeholder?: string
}

export function TagsField<T extends FieldValues>({
    form,
    name,
    label,
    placeholder = "Add a tag and press Enter",
}: Props<T>) {
    const [draft, setDraft] = useState("")
    const tags = (form.watch(name) as string[] | undefined) ?? []

    function addTag() {
        const value = draft.trim()
        if (!value) return
        form.setValue(name, [...tags, value] as never, {
            shouldDirty: true,
            shouldValidate: true,
        })
        setDraft("")
    }

    function removeTag(index: number) {
        const next = tags.filter((_, i) => i !== index)
        form.setValue(name, next as never, {
            shouldDirty: true,
            shouldValidate: true,
        })
    }

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            {tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <li
                            key={`${tag}-${i}`}
                            className="flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs"
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={() => removeTag(i)}
                                className="text-muted-foreground hover:text-foreground"
                                aria-label={`Remove ${tag}`}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                        }
                    }}
                    placeholder={placeholder}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                    Add
                </Button>
            </div>
        </Field>
    )
}
