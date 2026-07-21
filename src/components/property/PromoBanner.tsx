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
 */
export function PromoBanner({ promoCode, perks, contactEmail }: PromoBannerProps) {
  return (
    // Container replaces the old `md:px-[92px]`, so this section shares the
    // same 1080px content bound as the rest of the page. The copy itself is
    // centred and narrower than that, so nothing moves visually — it just
    // stops this being a second, competing way of setting content width.
    <section className="px-5 py-16 text-center">
      <Container className="flex flex-col items-center gap-4">
        {/* font-heading (Source Sans) — the live heading uses the heading
            font like every other heading on the site; this one was missing
            the class and so fell back to the Open Sans body font, rendering
            noticeably wider than the original. */}
        <h2 className="font-heading text-[40px] font-normal text-ink">
          Best Price Guaranteed
        </h2>

        <p className="text-xl text-text">
          Promo code &ldquo;{promoCode}&rdquo;
          <br />
          Exclusive privileges for booking on our website.
        </p>

        <ul className="flex flex-col gap-2 text-xl font-light text-text">
          {perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>

        <p className="text-xl text-text">
          Screenshot the deal and{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            click here
          </a>
        </p>
      </Container>
    </section>
  );
}
