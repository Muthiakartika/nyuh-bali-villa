import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ImageGallery } from "@/components/property/ImageGallery";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { ProgramList } from "@/components/property/ProgramList";
import { FaqList } from "@/components/property/FaqList";
import { InquiryForm, type InquiryField } from "@/components/property/InquiryForm";
import { otherPersonalisedRetreats, type Experience } from "@/data/experiences";
import type { PropertySite } from "@/data/properties";

/** The live retreat pages all close with the same six-field WPForms enquiry
 * form, reached by the INQUIRY button that sits beside BOOK NOW at the top.
 * Field labels are the live form's own. */
const RETREAT_INQUIRY_FIELDS: InquiryField[] = [
  { kind: "text", name: "name", label: "Name", required: true },
  { kind: "email", name: "email", label: "Email", required: true },
  { kind: "number", name: "pax", label: "No of Pax" },
  { kind: "date", name: "checkIn", label: "Check-in" },
  { kind: "date", name: "checkOut", label: "Check-out" },
  { kind: "textarea", name: "message", label: "Message" },
];

const INQUIRY_ANCHOR = "retreat-inquiry";

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
 *
 * **The block order is the live pages' own**: intro → photographs → titled
 * prose → "Why Choose Ubud Nyuh Bali Resort?" → stand-alone lists →
 * "Available Programs" → FAQ → "Meet our … Team" → the other personalised
 * retreats. Most of these existed on the live site and had been lost in the
 * original scrape, which flattened a structured page into two arrays of
 * strings — a stack of headingless paragraphs and one 30-item bullet list.
 */
export function ExperienceDetailBody({
  experience,
  site,
}: ExperienceDetailBodyProps) {
  // Same rule as `RoomDetail`: the page opens on `hero`, so the gallery below
  // shows everything except that one photograph rather than repeating it.
  const gallery = experience.gallery.filter((src) => src !== experience.hero);
  // Two or more photographs get the "Gallery" band and its slider. A single
  // one is set straight into the intro instead — which is where the live
  // pages put it, and a "Gallery" heading over one picture reads as a section
  // that failed to load.
  const hasGalleryBand = gallery.length > 1;
  const introImage = gallery.length === 1 ? gallery[0] : null;
  const related = otherPersonalisedRetreats(experience.slug);
  // Only the retreat programmes publish an enquiry form; the wellness
  // classes and cultural activities book through the resort directly.
  const hasInquiry = experience.group === "retreat";

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

        {experience.recommendedFor?.length ? (
          <Reveal delay={120}>
            <div className="mt-8">
              {/* "Recommended for" is the live page's own label, kept
                  verbatim; it is set as an eyebrow rather than a heading
                  because it introduces three words, not a section. */}
              <p className="text-eyebrow font-body text-primary-deep uppercase">
                Recommended for
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {experience.recommendedFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[16px] leading-relaxed font-light text-text"
                  >
                    <span
                      aria-hidden
                      className="mt-3 block h-px w-2.5 shrink-0 bg-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}

        {experience.note ? (
          <Reveal delay={160}>
            <p className="mt-8 max-w-[62rem] text-[17px] leading-[1.7] font-light text-text">
              {experience.note}
            </p>
          </Reveal>
        ) : null}

        {experience.price ? (
          <Reveal delay={180}>
            <p className="text-eyebrow font-body mt-6 text-primary-deep uppercase">
              {experience.price}
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={site.bookingHref} external>
              Book Now
            </Button>
            {/* The live pages pair BOOK NOW with an INQUIRY button; on the
                personalised retreats that button's href is literally
                "http://" and goes nowhere. Here it jumps to the form the page
                actually carries. */}
            {hasInquiry ? (
              <Button href={`#${INQUIRY_ANCHOR}`} variant="outline">
                Inquiry
              </Button>
            ) : null}
          </div>
        </Reveal>

        {introImage ? (
          <Reveal delay={240}>
            <div className="relative mt-10 h-64 w-full overflow-hidden sm:h-80 md:mt-12 md:h-[26rem]">
              <Image
                src={introImage}
                alt={experience.title}
                fill
                sizes="(min-width: 1240px) 1240px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ) : null}
      </Section>

      {hasGalleryBand ? (
        <Section tone={nextTone()}>
          <SectionHeading title="Gallery" />
          <Reveal delay={80} className="mt-8 md:mt-10">
            <ImageGallery
              images={gallery}
              alt={experience.title}
              heightClassName="h-64 sm:h-80 md:h-[30rem]"
              sizes="(min-width: 1240px) 1240px, 100vw"
            />
          </Reveal>
        </Section>
      ) : null}

      {experience.sections?.length ? (
        <Section tone={nextTone()}>
          {/* Two columns at `lg` when there are several blocks, one when a
              block carries a photograph — the slimming page's single
              "Contour Master Slim" section is text beside the device shot. */}
          <div className="flex flex-col gap-12 md:gap-14">
            {experience.sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 80}>
                <div
                  className={
                    section.image
                      ? "grid items-center gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
                      : ""
                  }
                >
                  <div>
                    <h2 className="font-heading text-[26px] leading-[1.2] font-light text-balance text-ink md:text-[32px]">
                      {section.heading}
                    </h2>
                    <span
                      aria-hidden
                      className="mt-5 block h-px w-12 bg-primary"
                    />
                    <div className="mt-6 flex max-w-[62rem] flex-col gap-4">
                      {section.body.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-[17px] leading-[1.7] font-light text-text"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {section.image ? (
                    // `object-contain`: this is the one photograph on the
                    // retreat pages that is a product shot on white, and
                    // cropping a machine to fill a frame cuts the machine.
                    <div className="relative h-56 w-full sm:h-72 lg:h-80">
                      <Image
                        src={section.image}
                        alt={section.heading}
                        fill
                        sizes="(min-width: 1024px) 420px, 100vw"
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {experience.highlights ? (
        <Section tone={nextTone()}>
          <SectionHeading title={experience.highlights.heading} />
          {/* Three across at `lg`, two at `sm`. Each card is an icon, a short
              title and one line — no plate, no border: the gold icon and the
              hairline under the title are the structure, which keeps this from
              becoming a third card surface. */}
          <div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
            {experience.highlights.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div>
                  {/* The live icons are transparent gold line art, so they sit
                      on the sand band unplated. Decorative — the title says
                      the same thing — so the alt is empty. */}
                  <Image
                    src={item.icon}
                    alt=""
                    width={56}
                    height={56}
                    sizes="56px"
                    className="h-14 w-14 object-contain"
                  />
                  <h3 className="font-heading mt-5 text-[20px] leading-tight font-light text-ink md:text-[22px]">
                    {item.title}
                  </h3>
                  <span aria-hidden className="mt-4 block h-px w-10 bg-primary" />
                  <p className="mt-4 text-[15px] leading-relaxed font-light text-text">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {experience.blocks?.map((block) => (
        <Section key={block.heading} tone={nextTone()}>
          <SectionHeading title={block.heading} />
          {block.intro ? (
            <Reveal delay={80}>
              <p className="mt-8 max-w-[62rem] text-[17px] leading-[1.7] font-light text-text">
                {block.intro}
              </p>
            </Reveal>
          ) : null}
          <div className="mt-8 flex flex-col gap-8 md:mt-10">
            {block.groups.map((group, index) => (
              <Reveal key={group.heading ?? index} delay={80 + index * 60}>
                <div>
                  {group.heading ? (
                    <h3 className="text-eyebrow font-body mb-4 text-primary-deep uppercase">
                      {group.heading}
                    </h3>
                  ) : null}
                  <ul className="sm:columns-2 sm:gap-x-10">
                    {group.items.map((item) => (
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
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {experience.programs ? (
        <ProgramList
          heading={experience.programs.heading}
          tiers={experience.programs.tiers}
          tone={nextTone()}
        />
      ) : null}

      {experience.inclusions.length > 0 ? (
        <Section tone={nextTone()}>
          <SectionHeading title="Inclusions" />
          {/* Two columns from `sm`: several wellness pages list 40+
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

      {experience.faq.length > 0 ? (
        <FaqList
          heading={experience.faqHeading}
          faqs={experience.faq}
          tone={nextTone()}
        />
      ) : null}

      {experience.closingCta ? (
        <Section tone={nextTone()}>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading title={experience.closingCta} />
            <Reveal delay={120} className="shrink-0">
              <Button href={site.bookingHref} external>
                Book Now
              </Button>
            </Reveal>
          </div>
        </Section>
      ) : null}

      {experience.team ? (
        <Section tone={nextTone()}>
          <SectionHeading title={experience.team.heading} />
          <div className="mt-8 grid gap-x-10 gap-y-12 md:mt-10 lg:grid-cols-2">
            {experience.team.members.map((member, index) => (
              <Reveal key={member.name} delay={index * 80}>
                <article className="flex flex-col gap-6 sm:flex-row">
                  {/* Round, like the live site — the one place on this site
                      where a photograph isn't square-cornered. The square crop
                      this replaced read as rigid against four portraits, and a
                      circle is the conventional shape for a face; the rest of
                      the site's photography keeps its hard edges. */}
                  <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-[20px] leading-tight font-light text-ink md:text-[22px]">
                      {member.name}
                    </h3>
                    <span
                      aria-hidden
                      className="mt-3 block h-px w-10 bg-primary"
                    />
                    {/* `whitespace-pre-line`: the yoga teachers' bios run two
                        paragraphs on the live site, kept as one string with a
                        blank line between them. Single-paragraph bios are
                        unaffected. */}
                    <p className="mt-4 text-[15px] leading-relaxed font-light whitespace-pre-line text-text">
                      {member.bio}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <LinkCardGrid
          heading="Other Personalized Luxury Retreat"
          columns={3}
          tone={nextTone()}
          items={related.map((item) => ({
            label: item.label,
            href: `/ubud/${item.slug}`,
            inScope: true,
            imgSrc: item.image,
          }))}
        />
      ) : null}

      {hasInquiry ? (
        <Section tone={nextTone()} id={INQUIRY_ANCHOR}>
          <InquiryForm heading="Inquiry" fields={RETREAT_INQUIRY_FIELDS} />
        </Section>
      ) : null}
    </>
  );
}
