import { Container } from "@/components/ui/Container";

type InstagramTeaserProps = {
  heading: string;
  /** Seminyak and Ubud run separate Instagram accounts
   * (@nyuhbalivillas vs. @nyuhbaliubud) — confirmed by checking the actual
   * follow link on each property's page rather than assuming they share
   * one account. */
  instagramHref: string;
};

/**
 * "What's happening @nyuhbalivillas" / "@nyuhbaliubud" — on the live site
 * this is a Smash Balloon Instagram feed widget showing a live grid of
 * recent posts. That requires an authenticated, ongoing connection to
 * Instagram's API (and even a scraped snapshot would be a grid of expiring,
 * signed image URLs that would break within days) — out of reach for a
 * static clone, so this reproduces the heading and "Follow on Instagram"
 * CTA without attempting to fake a live photo grid.
 */
export function InstagramTeaser({ heading, instagramHref }: InstagramTeaserProps) {
  return (
    // Background full-bleed, content bound to the shared 1080px Container.
    <section className="bg-ink px-5 py-24 text-center md:py-28">
      <Container className="flex flex-col items-center gap-4">
        <h2 className="font-heading text-[40px] font-extralight text-primary">{heading}</h2>
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-white uppercase transition-opacity duration-200 hover:opacity-70"
        >
          Follow on Instagram
        </a>
      </Container>
    </section>
  );
}
