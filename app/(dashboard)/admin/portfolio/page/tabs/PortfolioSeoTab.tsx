"use client"

import React, { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema"
import { TextField } from "../../../homepage/component/TextField"
import { TextareaField } from "../../../homepage/component/TextareaField"
import { ImageField } from "../../../homepage/component/ImageField"
import { TagsField } from "../../../homepage/component/TagsField"
import { PortfolioSectionSaveBar } from "@/app/(dashboard)/admin/portfolio/page/component/PortfolioSectionSaveBar"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const OG_TYPES = ["website", "article", "book", "profile"] as const
const TWITTER_CARDS = [
    "summary",
    "summary_large_image",
    "app",
    "player",
] as const
const SCHEMA_TYPES = [
    "Person",
    "Organization",
    "LocalBusiness",
    "ProfessionalService",
    "Photograph",
    "ImageGallery",
    "WebSite",
    "WebPage",
] as const

type Props = {
    form: UseFormReturn<PortfolioFormValues>
}

const PortfolioSeoTab = ({ form }: Props) => {
    const robotsIndex = form.watch("seo.robotsIndex")
    const robotsFollow = form.watch("seo.robotsFollow")
    const ogType = form.watch("seo.openGraph.type")
    const twitterCard = form.watch("seo.twitter.card")
    const schemaType = form.watch("seo.schemaType")

    useEffect(() => {
        if (!ogType) form.setValue("seo.openGraph.type", "website")
        if (!twitterCard) form.setValue("seo.twitter.card", "summary_large_image")
        if (!schemaType) form.setValue("seo.schemaType", "ImageGallery")
    }, [ogType, twitterCard, schemaType, form])

    return (
        <div className="space-y-8 pt-6">
            <PortfolioSectionSaveBar form={form} section="seo" label="SEO" />

            <div className="space-y-4">
                <h3 className="text-base font-medium">General</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        form={form}
                        name="seo.title"
                        label="Title"
                        placeholder="Browser tab + search result title"
                    />
                    <TextField
                        form={form}
                        name="seo.canonicalPath"
                        label="Canonical path"
                        placeholder="/portfolio"
                    />
                    <div className="md:col-span-2">
                        <TextareaField
                            form={form}
                            name="seo.description"
                            label="Description"
                            placeholder="~155 characters, used in search results and link previews"
                        />
                    </div>
                </div>

                <TagsField form={form} name="seo.keywords" label="Keywords" />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Robots</h4>
                    <Field>
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={!!robotsIndex}
                                onCheckedChange={(checked) =>
                                    form.setValue(
                                        "seo.robotsIndex",
                                        !!checked,
                                        { shouldDirty: true },
                                    )
                                }
                            />
                            <span>Allow indexing (index)</span>
                        </label>
                    </Field>
                    <Field>
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={!!robotsFollow}
                                onCheckedChange={(checked) =>
                                    form.setValue(
                                        "seo.robotsFollow",
                                        !!checked,
                                        { shouldDirty: true },
                                    )
                                }
                            />
                            <span>Follow links (follow)</span>
                        </label>
                    </Field>
                </div>
            </div>

            <div className="space-y-4 rounded-md border p-4">
                <header className="flex flex-col gap-1">
                    <h3 className="text-base font-medium">Open Graph</h3>
                    <p className="text-xs text-muted-foreground">
                        Empty fields fall back to the General SEO values.
                    </p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        form={form}
                        name="seo.openGraph.title"
                        label="og:title"
                    />
                    <TextField
                        form={form}
                        name="seo.openGraph.siteName"
                        label="og:site_name"
                    />
                    <Field>
                        <FieldLabel>og:type</FieldLabel>
                        <Select
                            value={ogType || "website"}
                            onValueChange={(v) =>
                                form.setValue(
                                    "seo.openGraph.type",
                                    v ?? "website",
                                    { shouldDirty: true },
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {OG_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <TextField
                        form={form}
                        name="seo.openGraph.locale"
                        label="og:locale"
                    />
                    <div className="md:col-span-2">
                        <TextareaField
                            form={form}
                            name="seo.openGraph.description"
                            label="og:description"
                        />
                    </div>
                </div>
                <ImageField
                    form={form}
                    name="seo.openGraph.image"
                    label="og:image"
                    description="1200×630 recommended."
                />
                <TextField
                    form={form}
                    name="seo.openGraph.imageAlt"
                    label="og:image alt text"
                />
            </div>

            <div className="space-y-4 rounded-md border p-4">
                <header className="flex flex-col gap-1">
                    <h3 className="text-base font-medium">Twitter</h3>
                    <p className="text-xs text-muted-foreground">
                        Empty fields fall back to Open Graph then General SEO.
                    </p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                        <FieldLabel>twitter:card</FieldLabel>
                        <Select
                            value={twitterCard || "summary_large_image"}
                            onValueChange={(v) =>
                                form.setValue(
                                    "seo.twitter.card",
                                    v ?? "summary_large_image",
                                    { shouldDirty: true },
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TWITTER_CARDS.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <TextField
                        form={form}
                        name="seo.twitter.title"
                        label="twitter:title"
                    />
                    <div className="md:col-span-2">
                        <TextareaField
                            form={form}
                            name="seo.twitter.description"
                            label="twitter:description"
                        />
                    </div>
                </div>
                <ImageField
                    form={form}
                    name="seo.twitter.image"
                    label="twitter:image"
                    description="If empty, falls back to og:image."
                />
            </div>

            <div className="space-y-4 rounded-md border p-4">
                <header className="flex flex-col gap-1">
                    <h3 className="text-base font-medium">Schema.org</h3>
                    <p className="text-xs text-muted-foreground">
                        Emits a JSON-LD block with this @type.
                    </p>
                </header>
                <Field>
                    <FieldLabel>itemtype (@type)</FieldLabel>
                    <Select
                        value={schemaType || "ImageGallery"}
                        onValueChange={(v) =>
                            form.setValue(
                                "seo.schemaType",
                                v ?? "ImageGallery",
                                { shouldDirty: true },
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SCHEMA_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>
        </div>
    )
}

export default PortfolioSeoTab
