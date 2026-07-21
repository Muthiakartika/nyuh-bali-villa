import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

type InstagramTeaserProps = {
  heading: string;
  /** Seminyak and Ubud run separate accounts (@nyuhbalivillas vs
   * @nyuhbaliubud) — confirmed from each property's own follow link. */
  instagramHref: string;
};

/**
 * "What's happening @nyuhbalivillas" / "@nyuhbaliubud".
 *
 * On the live site this is a Smash Balloon feed widget. That needs an
 * authenticated, ongoing Instagram API connection — and a scraped snapshot
 * would be a grid of expiring signed URLs that breaks within days — so this
 * stays a heading and a follow action rather than faking a photo grid that
 * would rot.
 */
export function InstagramTeaser({ heading, instagramHref }: InstagramTeaserProps) {
  return (
    <Section tone="canvas" space="normal">
      <SectionHeading
        title={heading}
        trailing={
          <div className="md:flex md:justify-end">
            <Button href={instagramHref} external variant="secondary">
              Follow on Instagram
            </Button>
          </div>
        }
      />
    </Section>
  );
}
