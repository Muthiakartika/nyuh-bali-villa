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
    <section className="px-5 py-20 text-center md:py-24">
      <Container className="flex flex-col items-center">
        <h2 className="font-heading text-[40px] font-normal text-ink">
          Best Price Guaranteed
        </h2>
        <span aria-hidden className="mt-5 block h-px w-16 bg-primary/70" />

        {/* A hairline gold border turns the offer into a distinct object on
            the white page without needing a background colour or shadow. */}
        <div className="mt-12 w-full max-w-[680px] border border-primary/30 px-6 py-10 md:px-12">
          <p className="text-xs tracking-[3px] text-text uppercase">Promo code</p>
          <p className="font-heading mt-3 text-[34px] leading-none font-light tracking-[3px] text-primary">
            &ldquo;{promoCode}&rdquo;
          </p>
          <p className="mt-5 text-lg font-light text-text">
            Exclusive privileges for booking on our website.
          </p>

          <ul className="mt-9 flex flex-col gap-3 border-t border-primary/20 pt-9 text-lg font-light text-text">
            {perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-lg font-light text-text">
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
