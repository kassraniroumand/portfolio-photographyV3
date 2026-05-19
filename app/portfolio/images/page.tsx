import type { Metadata } from "next";
import {
  buildPortfolioJsonLd,
  buildPortfolioMetadata,
  getPortfolio,
  getPortfolioImages,
} from "../_lib/portfolioData";
import { PhotoCollection } from "../_components/PhotoCollection";
import {
  CollectionsSection,
  EmptyCollectionsSection,
} from "../_components/CollectionsSection";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  return buildPortfolioMetadata(data, "Photos", "/portfolio/images");
}

export default async function PortfolioImagesPage() {
  const [data, photoCollections] = await Promise.all([
    getPortfolio(),
    getPortfolioImages(),
  ]);

  if (!data || !photoCollections) return null;

  const jsonLd = buildPortfolioJsonLd(data, "/portfolio/images");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {photoCollections.length > 0 ? (
        <CollectionsSection id="photo" label="Photo collections">
          {photoCollections.map((collection, i) => (
            <PhotoCollection
              key={`photo-${collection.slug}`}
              anchorId={collection.slug}
              index={i}
              collection={collection}
            />
          ))}
        </CollectionsSection>
      ) : (
        <EmptyCollectionsSection>
          No photo collections yet.
        </EmptyCollectionsSection>
      )}
    </>
  );
}
