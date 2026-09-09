import Image from "next/image";
import { InstagramFeedGrid } from "@/components/property/InstagramFeedGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import type { InstagramPost } from "@/components/property/instagramFeed";

type InstagramTeaserProps = {
  heading: string;
  /** Seminyak and Ubud run separate Instagram accounts
   * (@nyuhbalivillas vs. @nyuhbaliubud) — confirmed by checking the actual
   * follow link on each property's page rather than assuming they share
   * one account. */
  instagramHref: string;
  /** The grid. Either the live feed fetched on the server by
   * `fetchInstagramPosts`, or the hand-picked stills a page falls back to
   * while no feed is connected — this component doesn't distinguish, which is
   * what lets a page swap one for the other without touching this file.
   *
   * Omit it entirely and the section renders as heading + Follow button alone,
   * which is what every property looked like before any grid existed. */
  posts?: InstagramPost[];
  /** Live feed path. When set, `posts` becomes the loading/failure fallback. */
  feedEndpoint?: string;
  feedLimit?: number;
  feedColumns?: 3 | 4 | 6;
};

/**
 * "What's happening @nyuhbalivillas" / "@nyuhbaliubud" / "@mahamayaspa.ubud".
 *
 * The live WordPress site runs a Smash Balloon widget here, which is a plugin
 * and doesn't transfer. The replacement is Behold: it holds the authenticated
 * Instagram connection and republishes the account as public JSON, which
 * `instagramFeed.ts` reads on the server. The grid below is therefore ours —
 * real posts, but rendered with this site's own tiles and in the server HTML,
 * rather than drawn into the page by a vendor script.
 *
 * Only Seminyak carries a grid. Until its Behold feed exists it shows six
 * hand-picked photographs of the resort in place of live posts — the page
 * decides which, so nothing in here changes when the feed is connected. Ubud
 * and the spa still render the heading-and-button form.
 *
 * The old version rendered a full dark band containing one heading and one
 * small text link floating in the middle of it: an almost-empty section that
 * read as unfinished. Making it a compact two-column row — heading left, CTA
 * right — turns the same content into a deliberate closing note; the photo
 * grid beneath it is what actually answers "what's happening".
 *
 * White is the lightest surface on the page and this is the only band that uses
 * it. That's the point: it lands as a clean break between the `sand-deep`
 * testimonial above and the `ink` awards base below, so the page closes on a
 * light-to-dark step rather than on two warm bands running together. The
 * outline CTA and the `ink` heading both already read on white unchanged.
 */
export function InstagramTeaser({
  heading,
  instagramHref,
  posts,
  feedEndpoint,
  feedLimit,
  feedColumns,
}: InstagramTeaserProps) {
  // The stills (or Behold posts) this band already had, kept as the fallback
  // the live grid shows while it loads and if the feed is unreachable.
  const staticGrid = posts?.length ? (
    <div className="mt-8 grid grid-cols-3 gap-1.5 sm:grid-cols-6 md:mt-10 md:gap-2">
      {posts.map((post, index) => (
        <Reveal key={post.id} delay={index * 60}>
          <a
            // Stills carry no permalink (see `InstagramPost`), so they open
            // the profile — the same destination as the button above, and the
            // only honest one for a photograph that isn't a post.
            href={post.permalink ?? instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group/insta relative block aspect-square overflow-hidden"
          >
            <Image
              src={post.imageUrl}
              alt={post.alt}
              fill
              sizes="(min-width: 640px) 16vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/insta:scale-110"
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover/insta:bg-ink/50 group-hover/insta:opacity-100"
            >
              <InstagramIcon className="h-6 w-6 text-white" />
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  ) : null;
  return (
    // `space="none"` with explicit padding rather than the standard rhythm:
    // this band is the lead-in to the awards row below it, so it is
    // deliberately shallower than a full section. It still carries the
    // rhythm's exact top/bottom split so its visible gaps match every other
    // band — keep these two values in step with `DESKTOP_SPACE` in Section.tsx.
    <Section
      tone="white"
      space="none"
      className="pt-6 pb-9 md:pt-[45px] md:pb-[51px]"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title={heading} />
        <Reveal delay={120} className="shrink-0">
          <Button href={instagramHref} external variant="outline">
            Follow on Instagram
          </Button>
        </Reveal>
      </div>

      {feedEndpoint ? (
        <InstagramFeedGrid
          endpoint={feedEndpoint}
          instagramHref={instagramHref}
          limit={feedLimit}
          columns={feedColumns}
          fallback={staticGrid}
        />
      ) : (
        staticGrid
      )}
    </Section>
  );
}
