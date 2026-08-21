import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ChevronIcon } from "@/components/ui/icons";

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
 * **Categories are an accordion, collapsed by default.** The live page splits
 * its ~40 treatments behind menu tabs — Massage, Body Treatment, Hair Therapy,
 * and so on — so a visitor sees seven short labels, not every price and
 * description at once. Rendering every category fully expanded (the previous
 * approach) put the whole menu — every duration, price, and paragraph — on the
 * page at once, which made the section read as far longer than the rest of the
 * site's pages. A native `<details>/<summary>` per category (the same
 * mechanism `FaqAccordion` uses, for the same reasons: no JS required to open,
 * keyboard- and screen-reader-accessible for free, and the content still ships
 * in the server HTML so it stays indexable whether or not a visitor ever clicks)
 * gets back to "seven labels, click one to see its treatments" without losing
 * any content.
 *
 * Individual treatments inside an unopened category are not wrapped in
 * `Reveal`: closed `<details>` content has no layout box until it's opened, and
 * `Reveal`'s fold check reads a zero-size box as "already past the fold" —
 * untested territory that `FaqAccordion` sidesteps by only ever animating the
 * row, not what's inside it. This does the same: the category row animates in
 * on scroll, and what's inside it appears instantly once a visitor opens it.
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

      <div className="mt-10 flex flex-col border-t border-ink/10 md:mt-12">
        {categories.map((category, categoryIndex) => (
          <Reveal key={category.name} delay={categoryIndex * 60}>
            <details className="group/cat border-b border-ink/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-4 md:gap-5">
                  {category.image ? (
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden md:h-24 md:w-24">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <div>
                    <h3 className="font-heading text-[19px] leading-tight font-light text-ink md:text-[26px]">
                      {category.name}
                    </h3>
                    <span className="text-eyebrow font-body mt-1.5 block text-primary-deep uppercase">
                      {category.treatments.length} treatments
                    </span>
                  </div>
                </div>

                <ChevronIcon
                  aria-hidden
                  className="h-3 w-3 shrink-0 rotate-90 text-primary transition-transform duration-300 group-open/cat:-rotate-90"
                />
              </summary>

              <div className="grid gap-x-12 gap-y-9 pb-9 lg:grid-cols-2">
                {category.treatments.map((treatment) => (
                  <article key={treatment.name}>
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
                ))}
              </div>
            </details>
          </Reveal>
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
