import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type InstagramTeaserProps = {
  heading: string;
  /** Seminyak and Ubud run separate Instagram accounts
   * (@nyuhbalivillas vs. @nyuhbaliubud) — confirmed by checking the actual
   * follow link on each property's page rather than assuming they share
   * one account. */
  instagramHref: string;
};

/**
 * "What's happening @nyuhbalivillas" / "@nyuhbaliubud".
 *
 * On the live site this is a Smash Balloon feed widget showing recent posts.
 * That needs an authenticated, ongoing connection to Instagram's API — and a
 * scraped snapshot would be a grid of expiring signed URLs that breaks within
 * days — so this stays a heading and a follow CTA rather than faking a photo
 * grid that would rot.
 *
 * The old version rendered that as a full dark band containing one heading and
 * one small text link floating in the middle of it: an almost-empty section
 * that read as unfinished. Making it a compact two-column row — heading left,
 * CTA right — turns the same content into a deliberate closing note instead.
 */
export function InstagramTeaser({ heading, instagramHref }: InstagramTeaserProps) {
  return (
    // `space="none"` with explicit padding rather than the standard rhythm:
    // this band is the lead-in to the awards row below it, so it is
    // deliberately shallower than a full section.
    <Section tone="sand-deep" space="none" className="pt-12 pb-12 md:pt-16 md:pb-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title={heading} />
        <Reveal delay={120} className="shrink-0">
          <Button href={instagramHref} external variant="outline">
            Follow on Instagram
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
