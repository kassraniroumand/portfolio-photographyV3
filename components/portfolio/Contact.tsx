"use client";

import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";

const Contact = ({ contact }: { contact: AdminContentFormValues["contact"] }) => {
  return (
    <section id="contact" className="py-24 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl">
          <p className="text-sm uppercase tracking-[0.4em] text-accent mb-8">{contact.eyebrow}</p>
          <h2 className="font-display text-7xl sm:text-8xl lg:text-[10rem] leading-[0.9] font-light text-balance">
            {contact.headlineLine1}<br />
            <em className="not-italic text-accent">{contact.headlineLine2}</em>
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-10 max-w-3xl text-base">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Email</p>
              <a href={`mailto:${contact.email}`} className="hover:text-accent transition-colors duration-300">
                {contact.email}
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Elsewhere</p>
              <div className="flex flex-col gap-1">
                <a href={contact.instagramUrl} className="hover:text-accent transition-colors duration-300">Instagram</a>
              </div>
            </div>
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="mt-16 inline-flex items-center gap-4 group"
          >
            <span className="font-display text-3xl italic text-accent">{contact.cta}</span>
            <span className="h-px w-16 bg-accent group-hover:w-32 transition-all duration-500 ease-smooth" />
          </a>
        </div>
      </div>


    </section>
  );
};

export default Contact;
