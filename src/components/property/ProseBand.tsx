import { Section } from "@/components/ui/Section";
import { SectionHeading, type HeadingLevel } from "@/components/ui/SectionHeading";
import { RichProse, type ProseValue } from "@/components/sanity/RichProse";
import { Reveal } from "@/components/ui/Reveal";

type ProseBandProps = {
  eyebrow?: string;
  heading: string;
  /** Which tag this band's heading is written as. The size never changes —
   * see HeadingLevel. Editors set it per section in the CMS. */
  headingAs?: HeadingLevel;
  /** Rich text from the CMS, or the `string[]` src/data still holds. A
   * paragraph may contain the token `{email}`, which becomes a mailto link
   * to `email` below — see RichProse. */
  paragraphs: ProseValue;
  /** The property's own address. It is passed in rather than written into the
   * copy for the reason every other component here derives it: the footer, the
   * contact page and this band must never be able to disagree about where a
   * guest writes to. */
  email?: string;
  tone?: "sand" | "sand-deep";
  anchor?: string;
};

/**
 * A band of plain prose under a heading — the Explore Bali page's "You are in
 * the Right Hands . . .".
 *
 * It exists as a component because that band was written inline in the route
 * and a CMS-authored version has to produce the *same* markup, not a second
 * approximation of it. `richTextSection` was the near-miss that made this
 * necessary: it renders portable text at the `read` width (760px), while this
 * runs the page's normal `wide` container with the paragraphs capped at 62rem —
 * a visibly different measure.
 *
 * The `{email}` token is what keeps the one linked address out of the CMS copy.
 * An editor writes "…report it immediately to {email} and we will…"; the
 * address and its styling come from the property document.
 */
export function ProseBand({
  eyebrow,
  heading,
  headingAs = "h2",
  paragraphs,
  email,
  tone = "sand",
  anchor,
}: ProseBandProps) {
  return (
    <Section tone={tone} id={anchor}>
      <SectionHeading eyebrow={eyebrow} title={heading} as={headingAs} />
      <Reveal delay={80}>
        {/* The gap lives on this wrapper, so each paragraph is a bare
            sibling with no margin of its own — which is what lets rich text
            produce exactly the markup a plain string produced here. */}
        <div className="mt-8 flex max-w-[62rem] flex-col gap-4">
          <RichProse
            value={paragraphs}
            paragraphClassName="text-[17px] leading-[1.7] font-light text-text"
            email={email}
          />
        </div>
      </Reveal>
    </Section>
  );
}
