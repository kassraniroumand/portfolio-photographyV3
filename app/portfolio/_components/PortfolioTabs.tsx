"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/portfolio/images", label: "Photos" },
  { href: "/portfolio/videos", label: "Ai" },
] as const;

export function PortfolioTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Portfolio sections"
    >
      <ul
        role="tablist"
        className="flex items-center gap-8 border-b border-foreground/10"
      >
        {TABS.map(({ href, label }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                role="tab"
                aria-selected={isActive}
                className={[
                  "inline-block py-4 text-xs uppercase tracking-[0.4em] transition-colors",
                  isActive
                    ? "text-foreground border-b border-accent -mb-px"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
