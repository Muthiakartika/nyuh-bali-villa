import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type ProseBandProps = {
  eyebrow?: string;
  heading: string;
  /** One entry per paragraph. A paragraph may contain the token `{email}`,
   * which is replaced by a mailto link to `email` below. */
  paragraphs: string[];
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
  paragraphs,
  email,
  tone = "sand",
  anchor,
}: ProseBandProps) {
  return (
    <Section tone={tone} id={anchor}>
      <SectionHeading eyebrow={eyebrow} title={heading} />
      <Reveal delay={80}>
        <div className="mt-8 flex max-w-[62rem] flex-col gap-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[17px] leading-[1.7] font-light text-text">
              {email
                ? paragraph.split("{email}").map((part, i, all) => (
                    <Fragment key={i}>
                      {part}
                      {i < all.length - 1 ? (
                        <a
                          href={`mailto:${email}`}
                          className="text-primary-deep underline decoration-primary/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-primary"
                        >
                          {email}
                        </a>
                      ) : null}
                    </Fragment>
                  ))
                : paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
