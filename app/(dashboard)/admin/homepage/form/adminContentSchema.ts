import {z} from "zod"

const imageString = z.string().min(1, "Image is required")

const galleryWorkSchema = z.object({
    src: imageString,
    title: z.string().min(1),
    category: z.string().min(1),
    year: z.string().min(1),
    location: z.string().min(1),
    caption: z.string().min(1),
    ratio: z
        .string()
        .regex(/^\d+\s*\/\s*\d+$/, "Use format like 4 / 5"),
})

const lensFrameSchema = z.object({
    src: imageString,
    alt: z.string().min(1),
    caption: z.string().min(1),
    location: z.string().min(1),
})

const storyItemSchema = z.object({

    src: imageString,

    alt: z.string().min(1),

    title: z.string().min(1),

    subject: z.string().min(1),

    description: z.string().min(1),

    frames: z.string().min(1),

    since: z.string().min(1),

})



const serviceItemSchema = z.object({

    index: z.string().min(1),

    title: z.string().min(1),

    description: z.string().min(1),

    tags: z.array(z.string()),

    image: imageString,

    alt: z.string().min(1),

})

const statSchema = z.object({

    k: z.string().min(1),

    v: z.string().min(1),

})

export const adminContentSchema = z.object({

    hero: z.object({

        leftImage: imageString,

        rightImage: imageString,

        insetImage: imageString,

        leftMetaName: z.string().min(1),

        cardName: z.string().min(1),

        cardLocation: z.string().min(1),

        cardEyebrow: z.string().min(1),

        cardHeadlineLine1: z.string().min(1),

        cardHeadlineLine2: z.string().min(1),

        bottomCaptionLine1: z.string().min(1),

        bottomCaptionLine2: z.string().min(1),

        rightImageLabel: z.string().min(1),

        rightImageCaption: z.string().min(1),

        rightHeadlineTop: z.string().min(1),

        rightHeadlineMid1: z.string().min(1),

        rightHeadlineMid2: z.string().min(1),

        rightItalic1: z.string().min(1),

        rightItalic2: z.string().min(1),

        exploreLabel: z.string().min(1),

    }),

    gallery: z.object({

        eyebrow: z.string().min(1),

        headline: z.string().min(1),

        intro: z.string().min(1),

        works: z.array(galleryWorkSchema),

    }),

    lens: z.object({

        eyebrow: z.string().min(1),

        headline: z.string().min(1),

        intro: z.string().min(1),

        frames: z.array(lensFrameSchema),

    }),

    stories: z.object({

        eyebrow: z.string().min(1),

        headline: z.string().min(1),

        intro: z.string().min(1),

        items: z.array(storyItemSchema),

    }),

    services: z.object({

        eyebrow: z.string().min(1),

        headline: z.string().min(1),

        items: z.array(serviceItemSchema),

    }),

    about: z.object({

        eyebrow: z.string().min(1),

        headlineLine1: z.string().min(1),

        headlineLine2: z.string().min(1),

        lead: z.string().min(1),

        body1: z.string().min(1),

        body2: z.string().min(1),

        stats: z.array(statSchema).min(3).max(3),

    }),

    contact: z.object({

        eyebrow: z.string().min(1),

        headlineLine1: z.string().min(1),

        headlineLine2: z.string().min(1),

        email: z.string().email(),

        studioLine1: z.string().min(1),

        studioLine2: z.string().min(1),

        instagramUrl: z.string().min(1),

        arenaUrl: z.string().min(1),

        cta: z.string().min(1),

        footerLeft: z.string().min(1),

        footerRight: z.string().min(1),

    }),

    seo: z.object({

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

    }),

})

export type AdminContentFormInput = z.input<typeof adminContentSchema>
export type AdminContentFormValues = z.output<typeof adminContentSchema>










