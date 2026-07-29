import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqEntry } from "@/components/property/FaqAccordion";

export type { FaqEntry };

type FaqListProps = {
  heading?: string;
  eyebrow?: string;
  faqs: FaqEntry[];
  tone?: "sand" | "sand-deep";
};

/**
 * The FAQ block as a full page band — the wellness and retreat detail pages.
 *
 * The rows themselves live in `FaqAccordion`, shared with the article body:
 * nine blog posts publish a FAQ too, and the two must not drift. Everything
 * about the treatment (native `<details>`, gold chevron, brand-brown question)
 * is documented there.
 *
 * Note this band currently renders on exactly one route: of the 18 entries in
 * `data/experiences.ts`, only `wellness/yoga` has a non-empty `faq` array.
 */
export function FaqList({
  heading = "FAQ",
  eyebrow,
  faqs,
  tone = "sand-deep",
}: FaqListProps) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={heading} />

      <div className="mt-8 md:mt-10">
        <FaqAccordion faqs={faqs} />
      </div>
    </Section>
  );
}
