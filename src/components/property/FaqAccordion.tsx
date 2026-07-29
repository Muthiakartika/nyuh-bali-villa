import { Reveal } from "@/components/ui/Reveal";
import { ChevronIcon } from "@/components/ui/icons";

export type FaqEntry = { question: string; answer: string };

type FaqAccordionProps = {
  faqs: FaqEntry[];
  /** Stagger the rows in. Off inside an article, where the FAQ is one block in
   * a page that is already revealing section by section. */
  animate?: boolean;
};

/**
 * The FAQ rows themselves, without a section around them.
 *
 * Extracted because there are now two callers — `FaqList` (a full band on the
 * wellness/retreat detail pages) and `PostBody` (a block inside an article,
 * recovered from nine posts that publish their FAQ as flat paragraphs). They
 * have to look identical, and a treatment this specific drifts the moment it
 * exists twice.
 *
 * Native `<details>/<summary>`: opens without JavaScript, keyboard- and
 * screen-reader-accessible for free, and keeps both callers Server Components.
 * Answers ship in the DOM whether or not the row is open, so the copy stays
 * indexable — the same reasoning behind `Reveal` never hiding content
 * permanently.
 *
 * The marker is the header's own gold chevron rather than a `+`: the site
 * already has one affordance that means "there is more under this", and
 * reusing it is what makes the block read as a dropdown at a glance.
 *
 * **The question is the one heading on this site that isn't `ink`.** The rule
 * is dark headings with gold as accent only — but a closed accordion is a
 * stack of near-identical rows, and colour is what ranks the question above an
 * answer set in the body face without spending height on an element that has
 * to stay compact. `primary-deep` is the brand's brown at a strength that
 * clears AA (4.92:1 measured); full gold is 2.39:1 and cannot carry text here.
 */
export function FaqAccordion({ faqs, animate = true }: FaqAccordionProps) {
  return (
    <div className="flex flex-col border-t border-ink/10">
      {faqs.map((faq, index) => {
        const row = (
          <details className="group/faq border-b border-ink/10">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-3 [&::-webkit-details-marker]:hidden">
              {/* Heading face, brand brown, a touch of tracking — three things
                  the answer beneath it has none of, which separates the two
                  without spending height on either. */}
              <span className="font-heading text-[17px] leading-[1.35] font-normal tracking-[0.005em] text-primary-deep transition-colors duration-300 group-hover/faq:text-ink md:text-[18px]">
                {faq.question}
              </span>

              <ChevronIcon
                aria-hidden
                className="mt-[0.42em] h-3 w-3 shrink-0 rotate-90 text-primary transition-transform duration-300 group-open/faq:-rotate-90"
              />
            </summary>

            <p className="max-w-[62rem] pb-4 text-[15px] leading-[1.7] font-light text-text md:text-[16px]">
              {faq.answer}
            </p>
          </details>
        );

        return animate ? (
          <Reveal key={faq.question} delay={index * 60}>
            {row}
          </Reveal>
        ) : (
          <div key={faq.question}>{row}</div>
        );
      })}
    </div>
  );
}
