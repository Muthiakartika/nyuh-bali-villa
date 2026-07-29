import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ReadMore } from "@/components/ui/ReadMore";
import { ImageGallery } from "@/components/property/ImageGallery";

export type PackageItem = {
  name: string;
  images: string[];
  description?: string;
  /** The live pages label this list "Discover Benefits"; the tour pages label
   * the equivalent block "Inclusions". */
  benefitsHeading?: string;
  benefits?: string[];
  /** Structured facts shown above the description — Price / Duration /
   * Itinerary on the Explore Bali tours. */
  meta?: { label: string; value: string }[];
  /** Free paragraphs after the list: the tours' per-stop descriptions and
   * their "Lunch Box" / "Additional person" lines. */
  notes?: string[];
  /** Most items have one action ("BOOK NOW", "EXPLORE MORE"); the dining
   * venues have two (an à la carte and a breakfast menu PDF), which is why
   * this is a list rather than a single CTA. */
  ctas?: PackageCta[];
};

export type PackageCta = {
  label: string;
  href: string;
  /** Booking-engine, menu PDFs and other off-site destinations. */
  external?: boolean;
  /** Internal destinations this project builds. Anything neither external
   * nor in scope renders inert, per the site-wide `inScope` convention. */
  inScope?: boolean;
  variant?: "solid" | "outline";
};

type PackageListProps = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  packages: PackageItem[];
  tone?: "sand" | "sand-deep";
};

/**
 * The offer/package listing, shared by five pages: Ubud's Offers and Romance,
 * Seminyak's Offers, and — through `meta` and `notes` — the Explore Bali tours.
 *
 * One component rather than a `PackageList` plus a near-identical `TourList`:
 * a tour and a package are the same shape of thing on this site (photographs,
 * a pitch, a list of what's included, one booking action). The only real
 * difference is that a tour states its price and itinerary up front, which is
 * what `meta` carries.
 *
 * **Rows alternate sides at `lg`.** Below that everything stacks image-first —
 * the same rule as every other split here (see the note in AboutNarrative:
 * 768px cut in two gives neither column a usable measure). The alternation is
 * what keeps a page of six packages from reading as a form.
 */
export function PackageList({
  eyebrow,
  heading,
  intro,
  packages,
  tone = "sand",
}: PackageListProps) {
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

      <div className="mt-10 flex flex-col gap-14 md:mt-12 md:gap-20">
        {packages.map((item, index) => {
          // Even rows put the photograph on the left, odd rows on the right.
          // `order` only applies from `lg`, so the stacked layout always leads
          // with the image regardless of the row's parity.
          const imageFirst = index % 2 === 0;

          return (
            <Reveal key={item.name}>
              <article className="grid items-start gap-6 lg:grid-cols-2 lg:gap-x-14">
                <div className={imageFirst ? "lg:order-1" : "lg:order-2"}>
                  <ImageGallery
                    images={item.images}
                    alt={item.name}
                    heightClassName="h-60 md:h-[22rem]"
                    sizes="(min-width: 1024px) 600px, 100vw"
                  />
                </div>

                <div
                  className={`flex flex-col ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
                >
                  <h3 className="font-heading text-[26px] leading-tight font-light text-ink md:text-[32px]">
                    {item.name}
                  </h3>
                  <span aria-hidden className="mt-4 block h-px w-12 bg-primary" />

                  {item.meta?.length ? (
                    <dl className="mt-5 flex flex-col gap-2">
                      {item.meta.map((entry) => (
                        <div
                          key={entry.label}
                          className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                        >
                          <dt className="text-eyebrow font-body shrink-0 pt-1 text-primary-deep uppercase sm:w-28">
                            {entry.label}
                          </dt>
                          <dd className="text-[15px] leading-relaxed font-light text-text">
                            {entry.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {item.description ? (
                    <p className="mt-5 text-[17px] leading-[1.7] font-light text-text">
                      {item.description}
                    </p>
                  ) : null}

                  {item.benefits?.length ? (
                    <h4 className="text-eyebrow font-body mt-7 text-primary-deep uppercase">
                      {item.benefitsHeading ?? "Discover Benefits"}
                    </h4>
                  ) : null}

                  {/* The benefits list and the tour notes are what actually
                      overruns the photograph — a nineteen-item list or a
                      four-stop itinerary leaves the text column 370–550px
                      taller than the 352px image beside it. `ReadMore` clamps
                      whichever of the two is present, but only once it has
                      measured a real overflow, so the short dining and retreat
                      rows (which end *above* their photograph) keep no
                      control. The heading stays outside the clamp so the
                      collapsed state still says what it is hiding. */}
                  {item.benefits?.length || item.notes?.length ? (
                    <ReadMore tone={tone} label={item.name}>
                      {item.benefits?.length ? (
                        // Two columns from `sm`: these lists run to nineteen
                        // short items on the Ubud packages, which as one column
                        // is taller than the photograph beside it.
                        // `break-inside-avoid` stops an item splitting across
                        // the column boundary.
                        <ul className="mt-4 sm:columns-2 sm:gap-x-8">
                          {item.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="mb-2 flex break-inside-avoid gap-2.5 text-[14px] leading-relaxed font-light text-text"
                            >
                              <span
                                aria-hidden
                                className="mt-2.5 block h-px w-2.5 shrink-0 bg-primary"
                              />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {item.notes?.length ? (
                        <div className="mt-5 flex flex-col gap-3">
                          {item.notes.map((note) => (
                            <p
                              key={note}
                              className="text-[14px] leading-relaxed font-light text-text"
                            >
                              {note}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </ReadMore>
                  ) : null}

                  {item.ctas?.length ? (
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {item.ctas.map((cta) => {
                        const variant = cta.variant ?? "solid";

                        if (cta.external) {
                          return (
                            <Button
                              key={cta.label}
                              href={cta.href}
                              external
                              size="sm"
                              variant={variant}
                            >
                              {cta.label}
                            </Button>
                          );
                        }

                        if (cta.inScope) {
                          return (
                            <Link
                              key={cta.label}
                              href={cta.href}
                              className={buttonClassName(variant, "sm")}
                            >
                              {cta.label}
                            </Link>
                          );
                        }

                        // Out of scope: same shape, no hover, no destination.
                        return (
                          <span
                            key={cta.label}
                            className="inline-flex items-center justify-center border border-ink/20 px-6 py-3 font-body text-[11px] tracking-[0.2em] text-ink/45 uppercase"
                          >
                            {cta.label}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
