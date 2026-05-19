import type { ReactNode } from "react";

const SECTION_PADDING = "px-6 lg:px-12 py-4 lg:py-12";

export function CollectionsSection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-label={label} className={SECTION_PADDING}>
      <div className="flex flex-col gap-24 lg:gap-32">{children}</div>
    </section>
  );
}

export function EmptyCollectionsSection({ children }: { children: ReactNode }) {
  return (
    <section className={SECTION_PADDING}>
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
        {children}
      </p>
    </section>
  );
}
