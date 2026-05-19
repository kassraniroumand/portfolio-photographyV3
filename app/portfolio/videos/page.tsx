import type { Metadata } from "next";
import {
  buildPortfolioJsonLd,
  buildPortfolioMetadata,
  getPortfolio,
  getPortfolioVideos,
} from "../_lib/portfolioData";
import { VideoCollection } from "../_components/VideoCollection";
import {
  CollectionsSection,
  EmptyCollectionsSection,
} from "../_components/CollectionsSection";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  return buildPortfolioMetadata(data, "Video", "/portfolio/videos");
}

export default async function PortfolioVideosPage() {
  const [data, videoCollections] = await Promise.all([
    getPortfolio(),
    getPortfolioVideos(),
  ]);

  if (!data || !videoCollections) return null;

  const jsonLd = buildPortfolioJsonLd(data, "/portfolio/videos");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {videoCollections.length > 0 ? (
        <CollectionsSection id="video" label="Video collections">
          {videoCollections.map((collection, i) => (
            <VideoCollection
              key={`video-${collection.slug}`}
              anchorId={collection.slug}
              index={i}
              collection={collection}
            />
          ))}
        </CollectionsSection>
      ) : (
        <EmptyCollectionsSection>
          No video collections yet.
        </EmptyCollectionsSection>
      )}
    </>
  );
}
