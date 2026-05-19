"use client";

import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const About = ({ about }: { about: AdminContentFormValues["about"] }) => {
  return (
    <section id="about" className="py-24 lg:py-40 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <p className="text-sm uppercase tracking-[0.4em] text-accent mb-6">{about.eyebrow}</p>
          <h2 className="font-display text-6xl lg:text-7xl font-light leading-tight text-balance">
            {about.headlineLine1}<br />
            <em className="text-accent">{about.headlineLine2}</em>
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 space-y-6 text-muted-foreground leading-relaxed text-lg">
          <p className="text-xl text-foreground/90 font-light">{about.lead}</p>
          <p>{about.body1}</p>
          <p>{about.body2}</p>

          <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-border">
            {about.stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-5xl lg:text-6xl text-accent font-light">{s.k}</div>
                <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground mt-2 leading-snug">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
