import type { Metadata } from "next";
import { getHomePage } from "./_lib/homePageData";
import type { AdminContentFormValues } from "./(dashboard)/admin/homepage/form/adminContentSchema";
import { adminEmptyContent } from "./(dashboard)/admin/homepage/form/emptyContent";

import Nav from "@/components/portfolio/Nav";
import Hero from "@/components/portfolio/Hero";
import Marquee from "@/components/portfolio/Marquee";
import Gallery from "@/components/portfolio/Gallery";
import BehindTheLens from "@/components/portfolio/BehindTheLens";
import Stories from "@/components/portfolio/Stories";
import Services from "@/components/portfolio/Services";
import About from "@/components/portfolio/About";
import Contact from "@/components/portfolio/Contact";

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

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePage();

  if (!data) {
    return {
      title: "Photography Portfolio",
      description: "Photography portfolio site.",
    };
  }

  const title = data.seo.title || undefined;
  const description = data.seo.description || undefined;
  const keywords = data.seo.keywords.length ? data.seo.keywords : undefined;
  const canonical = data.seo.canonicalPath || "/";

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

function buildJsonLd(data: AdminContentFormValues) {
  const rawType = data.seo.schemaType;
  const type = (ALLOWED_SCHEMA_TYPES as readonly string[]).includes(rawType)
    ? rawType
    : "Person";

  const sameAs = [data.contact.instagramUrl, data.contact.arenaUrl].filter(
    Boolean,
  );
  const image =
    data.seo.openGraph.image ||
    data.hero.rightImage ||
    data.hero.leftImage ||
    undefined;
  const url = data.seo.canonicalPath || "/";
  const siteName = data.seo.openGraph.siteName || data.hero.cardName;

  const author = {
    "@type": "Person",
    name: data.hero.cardName,
    url,
    image,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  const publisher = {
    "@type": "Organization",
    name: siteName,
    url,
    logo: image
      ? { "@type": "ImageObject", url: image }
      : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: siteName,
    description: data.seo.description || undefined,
    url,
    image,
    email: data.contact.email || undefined,
    address:
      data.contact.studioLine1 || data.contact.studioLine2
        ? {
            "@type": "PostalAddress",
            streetAddress: data.contact.studioLine1 || undefined,
            addressLocality: data.contact.studioLine2 || undefined,
          }
        : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    author,
    publisher,
  };
}

export default async function Home() {
  const data = await getHomePage();
  const content = data ?? adminEmptyContent;
  const jsonLd = data ? buildJsonLd(data) : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Nav />
      <Hero hero={content.hero} />
      <Marquee />
      <Gallery gallery={content.gallery} />
      <BehindTheLens lens={content.lens} />
      <Stories stories={content.stories} />
      <Services services={content.services} />
      <About about={content.about} />
      <Contact contact={content.contact} />
    </main>
  );
}
