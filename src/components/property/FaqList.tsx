import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export type FaqEntry = { question: string; answer: string };

type FaqListProps = {
  heading?: string;
  eyebrow?: string;
  faqs: FaqEntry[];
  tone?: "sand" | "sand-deep";
};

/**
 * The FAQ block carried by several of the wellness and retreat detail pages.
 *
 * Native `<details>/<summary>`, not a React accordion: it opens without
 * JavaScript, it is keyboard- and screen-reader-accessible for free, and it
 * keeps these pages Server Components. The marker is suppressed and replaced
 * with the site's own gold rule, which rotates into a cross when open — the
 * same "gold hairline as the affordance" language the nav and cards use.
 *
 * Answers ship in the DOM whether or not the item is open, so the copy is
 * always indexable — the same reasoning behind `Reveal` never hiding content
 * permanently.
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

      <div className="mt-8 flex flex-col border-t border-ink/10 md:mt-10">
        {faqs.map((faq, index) => (
          <Reveal key={faq.question} delay={index * 60}>
            <details className="group/faq border-b border-ink/10">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-heading text-[18px] leading-snug font-light text-ink md:text-[20px]">
                  {faq.question}
                </span>
                {/* Two crossed rules: the vertical one collapses when the
                    item opens, turning a "+" into a "–". */}
                <span
                  aria-hidden
                  className="relative mt-2 block h-3 w-3 shrink-0"
                >
                  <span className="absolute top-1/2 left-0 block h-px w-3 -translate-y-1/2 bg-primary" />
                  <span className="absolute top-0 left-1/2 block h-3 w-px -translate-x-1/2 bg-primary transition-transform duration-300 group-open/faq:scale-y-0" />
                </span>
              </summary>

              <p className="max-w-[62rem] pb-5 text-[16px] leading-[1.7] font-light text-text">
                {faq.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
