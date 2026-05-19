import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema"

export const emptyPortfolio: PortfolioFormValues = {
    intro: {
        eyebrow: "",
        headline: "",
        description: "",
    },
    photoCollections: [],
    videoCollections: [],
    seo: {
        title: "",
        description: "",
        keywords: [],
        canonicalPath: "/portfolio",
        robotsIndex: true,
        robotsFollow: true,
        openGraph: {
            title: "",
            description: "",
            siteName: "",
            locale: "en_US",
            type: "website",
            image: "",
            imageAlt: "",
        },
        twitter: {
            card: "summary_large_image",
            title: "",
            description: "",
            image: "",
        },
        schemaType: "ImageGallery",
    },
}
