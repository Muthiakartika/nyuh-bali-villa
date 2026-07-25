import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ImageGallery } from "@/components/property/ImageGallery";
import { FaqList } from "@/components/property/FaqList";
import type { Experience } from "@/data/experiences";
import type { PropertySite } from "@/data/properties";

type ExperienceDetailBodyProps = {
  experience: Experience;
  site: PropertySite;
};

/**
 * The body of a retreat-programme / wellness-class / cultural-activity detail
 * page. Eighteen live pages sit one level below the navigation and all carry
 * the same handful of blocks, so they share this component and differ only by
 * the data in `data/experiences.ts`.
 *
 * Every block is conditional: a page with no inclusions list, no price, no FAQ
 * or a single photograph simply renders fewer bands rather than empty ones.
 * Band tones alternate from a single counter so that whichever blocks a given
 * page happens to have still come out sand / sand-deep / sand.
 */
export function ExperienceDetailBody({
  experience,
  site,
}: ExperienceDetailBodyProps) {
  const hasGallery = experience.gallery.length > 1;
  const hasInclusions = experience.inclusions.length > 0;
  const hasFaq = experience.faq.length > 0;

  // Alternating surface, counted across only the blocks actually rendered.
  let band = 0;
  const nextTone = (): "sand" | "sand-deep" =>
    band++ % 2 === 0 ? "sand" : "sand-deep";

  return (
    <>
      <Section tone={nextTone()}>
        <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />

        <Reveal delay={80} className="mt-8 flex max-w-[62rem] flex-col gap-4">
          {experience.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[17px] leading-[1.7] font-light text-text"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        {experience.price ? (
          <Reveal delay={140}>
            <p className="text-eyebrow font-body mt-6 text-primary-deep uppercase">
              {experience.price}
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={200}>
          <div className="mt-8">
            <Button href={site.bookingHref} external>
              Book Now
            </Button>
          </div>
        </Reveal>
      </Section>

      {hasGallery ? (
        <Section tone={nextTone()}>
          <SectionHeading title="Gallery" />
          <Reveal delay={80} className="mt-8 md:mt-10">
            <ImageGallery
              images={experience.gallery}
              alt={experience.title}
              heightClassName="h-64 sm:h-80 md:h-[30rem]"
              sizes="(min-width: 1240px) 1240px, 100vw"
            />
          </Reveal>
        </Section>
      ) : null}

      {hasInclusions ? (
        <Section tone={nextTone()}>
          <SectionHeading title="Inclusions" />
          {/* Two columns from `sm`: several retreat programmes list 40+
              inclusions, which as one column runs far past the fold.
              `break-inside-avoid` keeps an item from splitting across the
              column boundary — same treatment as PackageList's benefits. */}
          <Reveal delay={80}>
            <ul className="mt-8 sm:columns-2 sm:gap-x-10 md:mt-10">
              {experience.inclusions.map((item) => (
                <li
                  key={item}
                  className="mb-2 flex break-inside-avoid gap-2.5 text-[15px] leading-relaxed font-light text-text"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 block h-px w-2.5 shrink-0 bg-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      ) : null}

      {hasFaq ? (
        <FaqList faqs={experience.faq} tone={nextTone()} />
      ) : null}
    </>
  );
}
