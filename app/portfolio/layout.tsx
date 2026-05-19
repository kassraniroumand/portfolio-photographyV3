import React from "react";
import Link from "next/link";
import Nav from "@/components/portfolio/Nav";
import About from "@/components/portfolio/About";
import Contact from "@/components/portfolio/Contact";
import { getPortfolio } from "./_lib/portfolioData";
import { getHomePage } from "../_lib/homePageData";
import { PortfolioTabs } from "./_components/PortfolioTabs";

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, home] = await Promise.all([getPortfolio(), getHomePage()]);

  return (
    <main className="relative min-h-screen bg-background text-foreground grain overflow-hidden">
      <Nav />
      {data ? (
          <>
          </>
        // <div className="px-6 lg:px-12 py-16 lg:py-24">
        //   <section className="pb-6 sm:pb-24">
        //     <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        //       <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-light max-w-3xl text-balance leading-[0.95]">
        //         {data.intro.headline}
        //       </h1>
        //       <p className="text-muted-foreground max-w-md text-base leading-relaxed font-light">
        //         {data.intro.description}
        //       </p>
        //     </div>
        //   </section>
        //   <PortfolioTabs />
        // </div>
      ) : (
        <section className="px-6 lg:px-12 py-16 lg:py-24">
          <p className="text-sm uppercase tracking-[0.4em] text-accent mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            Portfolio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light leading-[0.95] max-w-3xl text-balance">
            Nothing published yet.
          </h1>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed font-light mt-6">
            Sign in to the admin to create your portfolio.
          </p>
          <p className="mt-10">
            <Link
              href="/"
              className="inline-block text-xs uppercase tracking-[0.3em] border-b border-foreground/50 pb-1"
            >
              ← Home
            </Link>
          </p>
        </section>
      )}

      {children}

      <About about={home.about} />
      <Contact contact={home.contact} />
    </main>
  );
}
