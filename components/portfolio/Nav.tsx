import Link from "next/link";

const Nav = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-tight">Halcyon</span>
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden sm:inline">
            Studio
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm">
          <Link
            href="/portfolio"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent hover:after:w-full after:transition-all after:duration-500"
          >
            Portfolio
          </Link>
          {[
            ["Work", "/#work"],
            ["About", "/#about"],
            ["Journal", "/#journal"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent hover:after:w-full after:transition-all after:duration-500"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="text-xs uppercase tracking-[0.15em] border border-border hover:border-accent hover:text-accent px-4 py-2 transition-all duration-300"
        >
          Inquire
        </a>
      </div>
    </header>
  );
};

export default Nav;
