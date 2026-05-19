import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  portfolioSchema,
  type PortfolioFormValues,
} from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";
import { emptyPortfolio } from "@/app/(dashboard)/admin/portfolio/page/form/emptyPortfolio";

const PORTFOLIO_ID = "portfolio";

const getPortfolioRecord = cache(async (): Promise<Record<string, unknown> | null> => {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { id: PORTFOLIO_ID },
    });
    const data = record?.data;
    if (!data || typeof data !== "object") return null;
    return data as Record<string, unknown>;
  } catch (err) {
    console.error("getPortfolioRecord failed", err);
    return null;
  }
});

const ALLOWED_OG_TYPES = ["website", "article", "book", "profile"] as const;
type OgType = (typeof ALLOWED_OG_TYPES)[number];

const ALLOWED_TWITTER_CARDS = [
  "summary",
  "summary_large_image",
  "app",
  "player",
] as const;
type TwitterCard = (typeof ALLOWED_TWITTER_CARDS)[number];

const ALLOWED_SCHEMA_TYPES = [
  "Person",
  "Organization",
  "LocalBusiness",
  "ProfessionalService",
  "Photograph",
  "ImageGallery",
  "WebSite",
  "WebPage",
] as const;

const photoCollectionsSchema = portfolioSchema.shape.photoCollections;
const videoCollectionsSchema = portfolioSchema.shape.videoCollections;

export type PortfolioPhotoCollections = PortfolioFormValues["photoCollections"];
export type PortfolioVideoCollections = PortfolioFormValues["videoCollections"];

function migratePhotoCollections(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((c) => {
    if (!c || typeof c !== "object") return c;
    const obj = c as Record<string, unknown>;
    if (!Array.isArray(obj.coverImages) && typeof obj.coverImage === "string") {
      const { coverImage, ...rest } = obj;
      return {
        ...rest,
        coverImages: coverImage ? [coverImage] : [],
      };
    }
    return obj;
  });
}

export const getPortfolio = cache(
  async (): Promise<PortfolioFormValues | null> => {
    const data = await getPortfolioRecord();
    if (!data) return null;

    const raw = { ...emptyPortfolio, ...data } as Record<string, unknown>;
    const merged = {
      ...raw,
      photoCollections: migratePhotoCollections(raw.photoCollections),
    };
    const parsed = portfolioSchema.safeParse(merged);
    if (!parsed.success) {
      console.warn("portfolio payload failed validation", parsed.error.issues);
      return null;
    }
    return parsed.data;
  },
);

export const getPortfolioImages = cache(
  async (): Promise<PortfolioPhotoCollections | null> => {
    const data = await getPortfolioRecord();
    if (!data) return null;

    const parsed = photoCollectionsSchema.safeParse(
      migratePhotoCollections(data.photoCollections),
    );
    if (!parsed.success) {
      console.warn(
        "portfolio images payload failed validation",
        parsed.error.issues,
      );
      return null;
    }
    return parsed.data;
  },
);

export const getPortfolioVideos = cache(
  async (): Promise<PortfolioVideoCollections | null> => {
    const data = await getPortfolioRecord();
    if (!data) return null;

    const parsed = videoCollectionsSchema.safeParse(data.videoCollections);
    if (!parsed.success) {
      console.warn(
        "portfolio videos payload failed validation",
        parsed.error.issues,
      );
      return null;
    }
    return parsed.data;
  },
);

export function buildPortfolioMetadata(
  data: PortfolioFormValues | null,
  fallbackTitle: string,
  canonicalPath: string,
): Metadata {
  if (!data) {
    return {
      title: fallbackTitle,
      description: "Photography portfolio.",
    };
  }

  const title = data.seo.title || `${data.intro.headline} — ${fallbackTitle}`;
  const description = data.seo.description || data.intro.description;
  const keywords = data.seo.keywords.length ? data.seo.keywords : undefined;
  const canonical = data.seo.canonicalPath || canonicalPath;

  const ogTitle = data.seo.openGraph.title || title;
  const ogDescription = data.seo.openGraph.description || description;
  const ogImage = data.seo.openGraph.image || undefined;
  const ogImageAlt = data.seo.openGraph.imageAlt || undefined;
  const ogSiteName = data.seo.openGraph.siteName || undefined;
  const ogLocale = data.seo.openGraph.locale || "en_US";
  const ogType: OgType = (ALLOWED_OG_TYPES as readonly string[]).includes(
    data.seo.openGraph.type,
  )
    ? (data.seo.openGraph.type as OgType)
    : "website";

  const twitterCard: TwitterCard = (
    ALLOWED_TWITTER_CARDS as readonly string[]
  ).includes(data.seo.twitter.card)
    ? (data.seo.twitter.card as TwitterCard)
    : "summary_large_image";
  const twitterTitle = data.seo.twitter.title || ogTitle;
  const twitterDescription = data.seo.twitter.description || ogDescription;
  const twitterImage = data.seo.twitter.image || ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: ogType,
      title: ogTitle,
      description: ogDescription,
      siteName: ogSiteName,
      locale: ogLocale,
      images: ogImage ? [{ url: ogImage, alt: ogImageAlt }] : undefined,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: {
      index: data.seo.robotsIndex,
      follow: data.seo.robotsFollow,
    },
  };
}

export function buildPortfolioJsonLd(
  data: PortfolioFormValues,
  canonicalPath: string,
) {
  const rawType = data.seo.schemaType;
  const type = (ALLOWED_SCHEMA_TYPES as readonly string[]).includes(rawType)
    ? rawType
    : "ImageGallery";
  const image = data.seo.openGraph.image || undefined;

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: data.seo.openGraph.siteName || data.intro.headline,
    description: data.seo.description || data.intro.description,
    url: data.seo.canonicalPath || canonicalPath,
    image,
  };
}
