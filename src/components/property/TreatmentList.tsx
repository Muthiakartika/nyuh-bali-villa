import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ImageGallery } from "@/components/property/ImageGallery";

export type Treatment = {
  name: string;
  /** Most treatments are offered at one duration; several have two or three,
   * each with its own price and its own booking link. */
  options: { label: string; href: string }[];
  description: string;
  /** What a multi-step package contains ("Balinese Massage", "Coconut Body
   * Scrub", …). Only the Ubud spa's package tiers carry these. */
  includes?: string[];
};

export type TreatmentCategory = {
  /** "MASSAGE", "SELF INDULGENCE", "COUPLE" — the live page's own tab labels. */
  name: string;
  image?: string;
  treatments: Treatment[];
};

type TreatmentListProps = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  /** Short facts under the intro — opening hours, the early-booking discount. */
  notes?: string[];
  categories: TreatmentCategory[];
  /** The page's closing "Reserve Now" action. */
  cta?: { label: string; href: string };
  tone?: "sand" | "sand-deep";
};

/**
 * The spa treatment menu — a price list, which is a different shape from the
 * package/room listings and so gets its own component rather than being forced
 * through `PackageList`.
 *
 * **Prices are rows, not buttons.** Each treatment offers one or two
 * duration/price options and the live page puts a "Book Now" beside every one
 * of them. Rendering ten CTA buttons down a page would break the site's rule
 * that there is one button treatment and it means "the main action here", so
 * the per-option links are set as gold text on hairline-divided rows — the same
 * treatment as the perk list on the offer plate — and the section's single
 * solid Button is the closing "Reserve Now".
 */
export function TreatmentList({
  eyebrow,
  heading,
  intro,
  notes,
  categories,
  cta,
  tone = "sand",
}: TreatmentListProps) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={heading} />

      {intro ? (
        <Reveal delay={80}>
          <p className="mt-8 max-w-[62rem] text-[17px] leading-[1.7] font-light text-text">
            {intro}
          </p>
        </Reveal>
      ) : null}

      {notes?.length ? (
        <Reveal delay={120}>
          <ul className="mt-5 flex flex-col gap-1.5">
            {notes.map((note) => (
              <li
                key={note}
                className="text-eyebrow font-body text-primary-deep uppercase"
              >
                {note}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <div className="mt-10 flex flex-col gap-12 md:mt-12 md:gap-16">
        {categories.map((category) => (
          <div key={category.name}>
            {category.image ? (
              <Reveal>
                <ImageGallery
                  images={[category.image]}
                  alt={category.name}
                  heightClassName="h-40 md:h-56"
                  sizes="(min-width: 1240px) 1240px, 100vw"
                />
              </Reveal>
            ) : null}

            <Reveal delay={60}>
              <h3 className="font-heading mt-6 text-[24px] leading-tight font-light text-ink md:text-[28px]">
                {category.name}
              </h3>
              <span aria-hidden className="mt-4 block h-px w-12 bg-primary" />
            </Reveal>

            <div className="mt-7 grid gap-x-12 gap-y-9 lg:grid-cols-2">
              {category.treatments.map((treatment, index) => (
                <Reveal key={treatment.name} delay={index * 80}>
                  <article>
                    <h4 className="font-heading text-[20px] leading-tight font-light text-ink">
                      {treatment.name}
                    </h4>

                    <ul className="mt-3 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                      {treatment.options.map((option) => (
                        <li
                          key={option.label}
                          className="flex flex-wrap items-center justify-between gap-3 py-2.5"
                        >
                          <span className="text-[15px] font-light text-text">
                            {option.label}
                          </span>
                          <a
                            href={option.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-eyebrow font-body text-primary-deep uppercase underline decoration-primary/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-primary"
                          >
                            Book Now
                          </a>
                        </li>
                      ))}
                    </ul>

                    {treatment.includes?.length ? (
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                        {treatment.includes.map((step) => (
                          <li
                            key={step}
                            className="flex items-center gap-2 text-[13px] font-light text-text"
                          >
                            <span
                              aria-hidden
                              className="block h-px w-2 shrink-0 bg-primary"
                            />
                            {step}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <p className="mt-3 text-[15px] leading-relaxed font-light text-text">
                      {treatment.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>

      {cta ? (
        <Reveal delay={120}>
          <div className="mt-10">
            <Button href={cta.href} external>
              {cta.label}
            </Button>
          </div>
        </Reveal>
      ) : null}
    </Section>
  );
}
