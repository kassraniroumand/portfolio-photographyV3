"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useSaveSiteContentSectionMutation } from "@/lib/store/api"
import type { AdminContentFormValues } from "../form/adminContentSchema"

type Section = keyof AdminContentFormValues

type Props = {
    form: UseFormReturn<AdminContentFormValues>
    section: Section
    label: string
}

export function SectionSaveBar({ form, section, label }: Props) {
    const [saveSection, { isLoading: isSaving }] =
        useSaveSiteContentSectionMutation()
    const [error, setError] = useState<string | null>(null)
    const [savedAt, setSavedAt] = useState<Date | null>(null)

    const dirtyFields = form.formState.dirtyFields as Record<string, unknown>
    const isDirty = Boolean(dirtyFields?.[section])

    async function handleSave() {
        setError(null)
        const valid = await form.trigger(section)
        if (!valid) {
            setError("Fix the errors below before saving.")
            return
        }
        const sectionData = form.getValues(section)
        try {
            await saveSection({
                section,
                data: sectionData as unknown as Record<string, unknown>,
            }).unwrap()
            setSavedAt(new Date())
            form.resetField(section, { defaultValue: sectionData })
        } catch (e) {
            setError(e instanceof Error ? e.message : "save failed")
        }
    }

    return (
        <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/40 px-4 py-2">
            <div className="text-sm">
                <span className="font-medium">{label}</span>{" "}
                <span className="text-muted-foreground">
                    {error ? (
                        <span className="text-red-600 dark:text-red-400">
                            {error}
                        </span>
                    ) : isDirty ? (
                        "Unsaved changes"
                    ) : savedAt ? (
                        `Saved ${savedAt.toLocaleTimeString()}`
                    ) : (
                        "All changes saved"
                    )}
                </span>
            </div>
            <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isDirty}
            >
                {isSaving ? "Saving…" : "Save section"}
            </Button>
        </div>
    )
}
