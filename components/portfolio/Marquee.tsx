const items = [
  "Editorial",
  "Portrait",
  "Landscape",
  "Architecture",
  "Documentary",
  "Fashion",
  "Fine Art",
  "Film",
];

const Marquee = () => {
  return (
    <div className="border-y border-border py-6 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-10 font-display text-3xl lg:text-4xl text-muted-foreground/70 italic font-light flex items-center gap-10"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
