import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type PromoBannerProps = {
  promoCode: string;
  perks: string[];
  contactEmail: string;
};

/**
 * The "Best Price Guaranteed" offer — the page's dark band.
 *
 * This is the reference composition's closing CTA treatment applied to the one
 * section whose job is to convert: heading and the takeaway on the left, what
 * it buys you and the action on the right, on a near-black ground so it
 * interrupts the white canvas rather than blending into it.
 *
 * The promo code is set in brand gold on the brand brown — 6.93:1, so the one
 * thing a guest needs to take away is also the most legible thing in the band.
 * Every word is unchanged.
 */
export function PromoBanner({ promoCode, perks, contactEmail }: PromoBannerProps) {
  return (
    <Section tone="dark" space="loose">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <SectionHeading title="Best Price Guaranteed" surface="dark" />
          <Reveal delay={120}>
            <p className="mt-7 text-body text-on-dark-muted">
              Exclusive privileges for booking on our website.
            </p>
            <p className="mt-8 text-caption text-on-dark-muted">Promo code</p>
            <p className="mt-2 text-display font-medium text-accent">
              &ldquo;{promoCode}&rdquo;
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          {/* Feature panel geometry from DESIGN.md: 28px corners, flat, held
              off the background by a hairline rather than a shadow. */}
          <div className="rounded-[28px] border border-white/10 p-7 md:p-8">
            <ul className="flex flex-col divide-y divide-white/10">
              {perks.map((perk) => (
                <li key={perk} className="py-4 text-body text-on-dark-muted first:pt-0">
                  {perk}
                </li>
              ))}
            </ul>

            {/* Wording is verbatim from the original page — "click here" stays
                an inline link inside the sentence rather than being promoted to
                a button, because turning it into one would have meant rewriting
                the sentence around it. */}
            <p className="mt-7 text-body-sm text-on-dark-muted">
              Screenshot the deal and{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-accent underline decoration-accent/40 underline-offset-4"
              >
                click here
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
