"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, Sparkles } from "lucide-react";

const TABS = [
  { href: "/portfolio/images", label: "Photos", Icon: ImageIcon },
  { href: "/portfolio/videos", label: "Ai", Icon: Sparkles },
] as const;

export function PortfolioBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Portfolio sections"
      className="fixed bottom-0 inset-x-0 z-40 bg-background/85 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <ul role="tablist" className="grid grid-cols-2">
        {TABS.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                role="tab"
                aria-selected={isActive}
                className={[
                  "flex flex-col items-center justify-center gap-1 py-3 text-[10px] uppercase tracking-[0.3em] transition-colors",
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
