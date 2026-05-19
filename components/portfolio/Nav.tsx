"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/portfolio/images", label: "Images Portfolio" },
  { href: "/portfolio/videos", label: "Ai Portfolio" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-tight">Ati Nasr</span>
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden sm:inline">
            Studio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent hover:after:w-full after:transition-all after:duration-500"
            >
              {label}
            </Link>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-block text-xs uppercase tracking-[0.15em] border border-border hover:border-accent hover:text-accent px-4 py-2 transition-all duration-300"
        >
          Inquire
        </a>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center p-2 -mr-2 text-foreground"
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm bg-background">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-12 flex flex-col gap-6 text-base">
              {links.map(({ href, label }) => (
                <SheetClose asChild key={href}>
                  <Link
                    href={href}
                    className="text-foreground/90 hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href="#contact"
                  className="mt-4 inline-block text-xs uppercase tracking-[0.15em] border border-border hover:border-accent hover:text-accent px-4 py-2 transition-all duration-300 w-fit"
                >
                  Inquire
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Nav;
