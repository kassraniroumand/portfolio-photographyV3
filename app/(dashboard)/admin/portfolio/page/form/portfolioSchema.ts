import type { UseFormReturn } from "react-hook-form"
import { z } from "zod"

const photoItemSchema = z.object({
    src: z.string().min(1, "Image is required"),
    alt: z.string(),
    caption: z.string(),
})

const videoItemSchema = z.object({
    src: z.string().min(1, "Video URL is required"),
    aspectRatio: z.number().positive().default(16 / 9),
    alt: z.string(),
    caption: z.string(),
})

const photoCollectionSchema = z.object({
    slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    title: z.string().min(1),
    coverImages: z.array(z.string()).max(2),
    year: z.string(),
    location: z.string(),
    description: z.string(),
    photos: z.array(photoItemSchema),
})

const videoCollectionSchema = z.object({
    slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    title: z.string().min(1),
    year: z.string(),
    location: z.string(),
    description: z.string(),
    videos: z.array(videoItemSchema),
})

const seoSchema = z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    canonicalPath: z.string(),
    robotsIndex: z.boolean(),
    robotsFollow: z.boolean(),
    openGraph: z.object({
        title: z.string(),
        description: z.string(),
        siteName: z.string(),
        locale: z.string(),
        type: z.string(),
        image: z.string(),
        imageAlt: z.string(),
    }),
    twitter: z.object({
        card: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
    }),
    schemaType: z.string(),
})

export const portfolioSchema = z.object({
    intro: z.object({
        eyebrow: z.string().min(1),
        headline: z.string().min(1),
        description: z.string().min(1),
    }),
    photoCollections: z.array(photoCollectionSchema),
    videoCollections: z.array(videoCollectionSchema),
    seo: seoSchema,
})

export type PortfolioFormInput = z.input<typeof portfolioSchema>
export type PortfolioFormValues = z.output<typeof portfolioSchema>
export type PortfolioFormReturn = UseFormReturn<
    PortfolioFormInput,
    unknown,
    PortfolioFormValues
>
