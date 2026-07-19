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
    <section className="flex flex-col items-center gap-4 px-5 py-16 text-center md:px-[92px]">
      <h2 className="text-[40px] font-normal text-ink">Best Price Guaranteed</h2>

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
    </section>
  );
}
