"use client"

import React from "react"
import type { UseFormReturn } from "react-hook-form"
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema"
import { TextField } from "../../../homepage/component/TextField"
import { TextareaField } from "../../../homepage/component/TextareaField"
import { PortfolioSectionSaveBar } from "@/app/(dashboard)/admin/portfolio/page/component/PortfolioSectionSaveBar"

type Props = {
    form: UseFormReturn<PortfolioFormValues>
}

const IntroTab = ({ form }: Props) => {
    return (
        <div className="space-y-6 pt-6">
            <PortfolioSectionSaveBar form={form} section="intro" label="Intro" />

            <div className="grid gap-4 md:grid-cols-2">
                <TextField form={form} name="intro.eyebrow" label="Eyebrow" />
                <TextField
                    form={form}
                    name="intro.headline"
                    label="Headline"
                />
                <div className="md:col-span-2">
                    <TextareaField
                        form={form}
                        name="intro.description"
                        label="Description"
                    />
                </div>
            </div>
        </div>
    )
}

export default IntroTab
