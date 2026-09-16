import Image from "next/image";
import { Section, type BandTone } from "@/components/ui/Section";
import { SectionHeading, type HeadingLevel } from "@/components/ui/SectionHeading";
import { RichProse, type ProseValue } from "@/components/sanity/RichProse";
import { ContactForm } from "@/components/property/ContactForm";
import type { PropertySlug } from "@/data/properties";

type ContactPanelProps = {
  /** Which resort's inbox this page's form emails. Passed through to
   * `ContactForm`; the server maps the slug to an address it already knows. */
  property: PropertySlug;
  /** The property name, which is what both contact pages put above the
   * heading. */
  eyebrow?: string;
  heading: string;
  /** Which tag this band's heading is written as. The size never changes —
   * see HeadingLevel. Editors set it per section in the CMS. */
  headingAs?: HeadingLevel;
  imageSrc: string;
  imageAlt: string;
  /** Ubud's page opens the form column with a line of copy; Seminyak's does
   * not. Omitting it renders the form on its own, exactly as before. */
  intro?: ProseValue;
  /** The band's background. Defaults to what this component hardcoded. */
  tone?: BandTone | "white";
  anchor?: string;
};

/**
 * The whole contact page body: heading, the property photograph, and the form.
 *
 * It exists as a component because the markup was written twice — once in each
 * contact route — and a CMS-authored contact page has to produce the *same*
 * markup, not a second version of it. That is the rule every page-builder
 * section here follows: the block renders the site's own component.
 *
 * The two layout notes that were in those routes belong to this file now:
 * the split happens at `lg`, never `md` (at 768 the columns came out 288px and
 * 353px, turning the photograph into a 288×540 sliver next to a form barely
 * wider than a phone's), and the photograph holds position while the form
 * scrolls beside it — the same sticky treatment `AboutNarrative` gives its
 * heading, so the two pages read as one design.
 */
export function ContactPanel({
  property,
  eyebrow,
  heading,
  tone = "sand",
  headingAs = "h1",
  imageSrc,
  imageAlt,
  intro,
  anchor,
}: ContactPanelProps) {
  return (
    <Section tone={tone} space="loose" id={anchor}>
      <SectionHeading eyebrow={eyebrow} title={heading} as={headingAs} size="display" />

      <div className="mt-10 grid gap-9 md:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="relative min-h-[380px] w-full overflow-hidden lg:sticky lg:top-24 lg:h-[540px] lg:self-start">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {intro ? (
          <div>
            <RichProse
              value={intro}
              paragraphClassName="text-[17px] leading-relaxed font-light text-text"
              firstClassName="mb-6"
              restClassName="mb-6"
            />
            <ContactForm property={property} />
          </div>
        ) : (
          <ContactForm property={property} />
        )}
      </div>
    </Section>
  );
}
