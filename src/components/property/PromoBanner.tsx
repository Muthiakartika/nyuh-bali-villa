import { Container } from "@/components/ui/Container";

type PromoBannerProps = {
  promoCode: string;
  perks: string[];
  contactEmail: string;
};

/**
 * The "Best Price Guaranteed" section — same structure on every property
 * page (heading, promo code, a bulleted perks list, a "screenshot the deal"
 * mailto CTA), but the perks themselves differ per property (Seminyak
 * offers a BBQ credit; Ubud offers a SPA discount), so `perks` is a prop
 * rather than hard-coded here.
 *
 * Redesign note: this was previously four centred paragraphs of near-identical
 * size, so the promo code — the one thing a guest actually needs to take away
 * — carried no more weight than the sentence around it. The copy is unchanged,
 * but it's now arranged as a bordered card with a clear hierarchy: a small
 * label, the code itself set large in gold, then the perks separated by a
 * rule. Nothing here invents new wording; "Promo code" and the code are just
 * put on their own lines so the code can be the focal point.
 */
export function PromoBanner({ promoCode, perks, contactEmail }: PromoBannerProps) {
  return (
    // Sits on the warm `ink/5` tint so the offer reads as its own band
    // between the white narrative above and the dark grid below — the
    // section rhythm replaces the hairline box this used to have.
    <section className="bg-ink/5 px-5 py-24 text-center md:py-32">
      <Container className="flex flex-col items-center">
        <h2 className="font-heading text-[40px] font-normal text-ink">
          Best Price Guaranteed
        </h2>
        <span aria-hidden className="mt-6 block h-px w-16 bg-primary/70" />

        {/* No border, no box. The offer used to sit inside a hairline frame,
            which read as a coupon; letting it breathe on the open page — with
            the code itself as the one large gold statement — is both simpler
            and more expensive-looking. Spacing does the grouping that the
            border used to do. */}
        <p className="mt-14 text-xs tracking-[3px] text-text uppercase">Promo code</p>
        <p className="font-heading mt-4 text-[40px] leading-none font-light tracking-[4px] text-primary">
          &ldquo;{promoCode}&rdquo;
        </p>
        <p className="mt-6 text-lg font-light text-text">
          Exclusive privileges for booking on our website.
        </p>

        <ul className="mt-12 flex max-w-[600px] flex-col gap-4 text-lg font-light text-text">
          {perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>

        <p className="mt-12 text-lg font-light text-text">
          Screenshot the deal and{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-primary underline underline-offset-4 transition-opacity duration-300 hover:opacity-70"
          >
            click here
          </a>
        </p>
      </Container>
    </section>
  );
}
