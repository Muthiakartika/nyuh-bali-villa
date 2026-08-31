import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronIcon } from "@/components/ui/icons";
import type { ExperienceProgram } from "@/data/experiences";

type ProgramListProps = {
  heading: string;
  tiers: ExperienceProgram[];
  tone?: "sand" | "sand-deep";
};

/**
 * The live retreat pages' "Available Programs" block: one row per
 * length-of-stay tier ("5 Nights", "7 Nights", …), each opening to the
 * treatments that tier includes plus the two blocks every tier repeats.
 *
 * **This section is the whole point of a retreat page and it was missing.**
 * The six programmes' tiers had been flattened into one undifferentiated
 * `inclusions` list, so a page said "here are 30 things" instead of "here is
 * what three, five, seven, ten or fourteen nights buys you" — which is the
 * decision a visitor is actually on the page to make, and the thing the client
 * flagged.
 *
 * Native `<details>/<summary>`, the same mechanism as `FaqAccordion` and
 * `TreatmentList`, for the same reasons: opens without JavaScript, keyboard-
 * and screen-reader-accessible for free, and every tier's contents ship in the
 * server HTML so the copy stays indexable whether or not a row is ever opened.
 * The summary treatment is `TreatmentList`'s — heading face, gold chevron that
 * flips on open — because this is the same interaction and a treatment this
 * specific drifts the moment it exists twice.
 *
 * The first tier is `open` by default. A stack of closed rows gives no clue
 * what is inside, and the shortest stay is the safe thing to show first.
 */
export function ProgramList({ heading, tiers, tone = "sand" }: ProgramListProps) {
  return (
    <Section tone={tone}>
      <SectionHeading title={heading} />

      <div className="mt-8 flex flex-col border-t border-ink/10 md:mt-10">
        {tiers.map((tier, tierIndex) => (
          <Reveal key={tier.name} delay={tierIndex * 60}>
            <details
              className="group/tier border-b border-ink/10"
              open={tierIndex === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="font-heading text-[19px] leading-tight font-light text-ink md:text-[24px]">
                  {tier.name}
                </h3>

                <ChevronIcon
                  aria-hidden
                  className="h-3 w-3 shrink-0 rotate-90 text-primary transition-transform duration-300 group-open/tier:-rotate-90"
                />
              </summary>

              {/* Three columns at `lg`, because a tier is three short lists
                  side by side — what the tier adds, then the two blocks every
                  tier shares. Stacked below that: the shared blocks run seven
                  items each and a 768px tablet cut three ways gives none of
                  them a readable measure (the site's every-split-at-`lg`
                  rule). */}
              <div className="grid gap-x-10 gap-y-8 pb-9 lg:grid-cols-3">
                {tier.groups.map((group, groupIndex) => (
                  <div key={group.heading ?? groupIndex}>
                    {group.heading ? (
                      <h4 className="text-eyebrow font-body text-primary-deep uppercase">
                        {group.heading}
                      </h4>
                    ) : null}

                    <ul
                      className={`flex flex-col gap-2 ${group.heading ? "mt-4" : ""}`}
                    >
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-[15px] leading-relaxed font-light break-words text-text"
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
                ))}
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
