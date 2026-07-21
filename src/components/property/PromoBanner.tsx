import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type PromoBannerProps = {
  promoCode: string;
  perks: string[];
  contactEmail: string;
};

/**
 * The "Best Price Guaranteed" offer.
 *
 * This is now the page's first dark band, and it is dark on purpose: it is the
 * only section whose job is to close a booking, so it gets to interrupt the
 * warm sand rhythm rather than blend into it. Gold on `ink` also measures
 * 6.93:1 — the promo code can finally be set large in full-strength brand gold
 * without the contrast problem it has on a light surface.
 *
 * Structurally it went from six centred lines of near-identical size — where
 * the promo code, the one thing a guest needs to take away, carried no more
 * weight than the sentence around it — to a two-column split: the pitch on the
 * left, the code and what it buys you on the right. Every word is unchanged.
 */
export function PromoBanner({ promoCode, perks, contactEmail }: PromoBannerProps) {
  return (
    <Section tone="ink" space="loose">
      <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-14">
        <div>
          <SectionHeading title="Best Price Guaranteed" surface="dark" />
          <Reveal delay={120}>
            <p className="mt-6 text-[17px] leading-relaxed font-light text-white/70">
              Exclusive privileges for booking on our website.
            </p>
            <p className="mt-4 text-[15px] text-white/70">
              Screenshot the deal and{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary underline decoration-primary/40 underline-offset-[6px] transition-colors duration-300 hover:decoration-primary"
              >
                click here
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          {/* A bordered plate, not a card: a single gold hairline around the
              offer is enough to set it apart on a dark ground, and it keeps
              the section flat in the way the rest of the design is. */}
          <div className="border border-primary/35 p-6 md:p-8">
            <span className="text-eyebrow font-body block text-primary uppercase">
              Promo code
            </span>
            <p className="font-heading mt-3 text-[38px] leading-none font-light tracking-[0.12em] text-primary md:text-[48px]">
              &ldquo;{promoCode}&rdquo;
            </p>

            <ul className="mt-7 flex flex-col divide-y divide-white/10 border-t border-white/10">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="py-3 text-[15px] leading-relaxed font-light text-white/75"
                >
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
