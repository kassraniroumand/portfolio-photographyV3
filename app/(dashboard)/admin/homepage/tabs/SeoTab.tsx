"use client"

import React from "react"
import type { UseFormReturn } from "react-hook-form"
import type { AdminContentFormValues } from "../form/adminContentSchema"
import { TextField } from "../component/TextField"
import { TextareaField } from "../component/TextareaField"
import { ImageField } from "../component/ImageField"
import { TagsField } from "../component/TagsField"
import { SectionSaveBar } from "../component/SectionSaveBar"
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
    form: UseFormReturn<AdminContentFormValues>
}

const SeoTab = ({ form }: Props) => {
    const robotsIndex = form.watch("seo.robotsIndex")
    const robotsFollow = form.watch("seo.robotsFollow")
            const ogType = form.watch("seo.openGraph.type")
    const twitterCard = form.watch("seo.twitter.card")
    const schemaType = form.watch("seo.schemaType")

    return (
        <div className="space-y-8 pt-6">
            <SectionSaveBar form={form} section="seo" label="SEO" />

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
                        placeholder="/"
                        description="Path on this site, e.g. / or /about"
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
                    <FieldLabel className="text-xs text-muted-foreground">
                        Disabling either sends noindex/nofollow to crawlers.
                    </FieldLabel>
                </div>
            </div>

            <div className="space-y-4 rounded-md border p-4">
                <header className="flex flex-col gap-1">
                    <h3 className="text-base font-medium">Open Graph</h3>
                    <p className="text-xs text-muted-foreground">
                        Controls how the page looks when shared on Facebook,
                        LinkedIn, iMessage, Slack, etc. Empty fields fall back
                        to the General SEO values.
                    </p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        form={form}
                        name="seo.openGraph.title"
                        label="og:title"
                        placeholder="Falls back to SEO title"
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
                        placeholder="en_US"
                    />
                    <div className="md:col-span-2">
                        <TextareaField
                            form={form}
                            name="seo.openGraph.description"
                            label="og:description"
                            placeholder="Falls back to SEO description"
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
                        Controls how the page looks when shared on Twitter / X.
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
                        Emits a JSON-LD block with this @type. Other fields are
                        derived from existing site content (name, image, URL,
                        social links).
                    </p>
                </header>
                <Field>
                    <FieldLabel>itemtype (@type)</FieldLabel>
                    <Select
                        value={schemaType || "Person"}
                        onValueChange={(v) =>
                            form.setValue(
                                "seo.schemaType",
                                v ?? "Person",
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

export default SeoTab
