"use client"

import React from "react"
import { UseFormReturn } from "react-hook-form"
import { AdminContentFormValues } from "../form/adminContentSchema"
import { TextField } from "../component/TextField"
import { TextareaField } from "../component/TextareaField"
import { SectionSaveBar } from "../component/SectionSaveBar"

type Props = {
    form: UseFormReturn<AdminContentFormValues>
}

const AboutTab = ({ form }: Props) => {
    return (
        <div className="space-y-6 pt-6">
            <SectionSaveBar form={form} section="about" label="About" />
            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="about.eyebrow" label="Eyebrow" />
                <TextField
                    form={form}
                    name="about.headlineLine1"
                    label="Headline line 1"
                />
                <TextField
                    form={form}
                    name="about.headlineLine2"
                    label="Headline line 2"
                />
            </div>

            <TextareaField form={form} name="about.lead" label="Lead" />
            <TextareaField form={form} name="about.body1" label="Body paragraph 1" />
            <TextareaField form={form} name="about.body2" label="Body paragraph 2" />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Stats</h3>
                <p className="text-sm text-muted-foreground">
                    Exactly 3 stats are required.
                </p>

                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="grid gap-4 rounded-md border p-4 md:grid-cols-2"
                    >
                        <TextField
                            form={form}
                            name={`about.stats.${i}.k`}
                            label={`Stat #${i + 1} key`}
                        />
                        <TextField
                            form={form}
                            name={`about.stats.${i}.v`}
                            label={`Stat #${i + 1} value`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutTab
