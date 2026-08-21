import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";

type InstagramTeaserProps = {
  heading: string;
  /** Seminyak and Ubud run separate Instagram accounts
   * (@nyuhbalivillas vs. @nyuhbaliubud) — confirmed by checking the actual
   * follow link on each property's page rather than assuming they share
   * one account. */
  instagramHref: string;
  /** A handful of photos already in use elsewhere on this property's pages,
   * shown as a static Instagram-style grid. Deliberately a snapshot rather
   * than a live feed — see the note below — so this is updated by hand and
   * isn't expected to track the real account automatically. */
  images?: string[];
};

/**
 * "What's happening @nyuhbalivillas" / "@nyuhbaliubud" / "@mahamayaspa.ubud".
 *
 * On the live site this is a Smash Balloon feed widget showing recent posts.
 * That needs an authenticated, ongoing connection to Instagram's API, which
 * this project doesn't have — so rather than faking a "live" feed, `images`
 * is an explicit, hand-picked snapshot (photos already used elsewhere on the
 * same property's pages, so no new assets are sourced for it). The client
 * plans to wire up a real feed later via Behold; this grid is a placeholder
 * with the same footprint, not a permanent scraping solution, so swapping it
 * out later is a one-line change at each call site rather than a rebuild of
 * this component.
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
  images,
}: InstagramTeaserProps) {
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

      {images?.length ? (
        <div className="mt-8 grid grid-cols-3 gap-1.5 sm:grid-cols-6 md:mt-10 md:gap-2">
          {images.map((src, index) => (
            <Reveal key={src} delay={index * 60}>
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group/insta relative block aspect-square overflow-hidden"
              >
                <Image
                  src={src}
                  alt=""
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
      ) : null}
    </Section>
  );
}
