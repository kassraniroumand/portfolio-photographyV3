export function CollectionHeader({
  anchorId,
  index,
  title,
  year,
  location,
  description,
  kind,
}: {
  anchorId: string;
  index: number;
  title: string;
  year: string;
  location: string;
  description: string;
  kind: "photo" | "video";
}) {
  const meta = [year, location].filter(Boolean).join(" · ");
  return (
    <header
      id={anchorId}
      className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 lg:gap-8 scroll-mt-32"
    >
      <div className="min-w-0">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-light max-w-3xl text-balance leading-[1.05] sm:leading-[0.98] break-words">
          {title}
        </h2>
        {meta && (
          <p className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-muted-foreground">
            {meta}
          </p>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-relaxed font-light">
          {description}
        </p>
      )}
    </header>
  );
}
