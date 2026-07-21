import Image from "next/image";
import Link from "next/link";
import type { ElementType } from "react";

type PropertyPanelProps = {
  name: string;
  description: string;
  imageSrc: string;
  href: string;
  /** Which heading tag to render (see the note below on why this is a prop
   * instead of always being the same tag). */
  headingLevel: "h1" | "h2";
};

/**
 * One half of the homepage's Seminyak/Ubud picker.
 *
 * The original stacked three separate blocks — heading, then paragraph, then
 * photo underneath — which read as a plain document rather than a choice
 * between two properties. This version composes them into a single image
 * card: the photo fills the card, a dark scrim sits over it for legibility,
 * and the name + description are centred on top. Same content and same brand
 * (Source Sans heading, gold `primary`, dark `ink`) — only the composition
 * and motion changed.
 *
 * `headingLevel` exists because the live site uses an `<h1>` for the first
 * panel and an `<h2>` for the second (there should only be one `<h1>` per
 * page). Since this component is reused for both, the caller decides which
 * tag applies rather than the component guessing.
 */
export function PropertyPanel({
  name,
  description,
  imageSrc,
  href,
  headingLevel,
}: PropertyPanelProps) {
  const Heading: ElementType = headingLevel;

  return (
    // `group` lets everything inside react to hovering anywhere on the card.
    // `overflow-hidden` is what clips the image's zoom to the card edges.
    <Link
      href={href}
      className="group relative block overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* A squarer crop on desktop than the original 3/2 landscape — taller
          cards give the two properties more presence side by side. The photos
          are landscape, so `object-cover` crops the sides rather than
          squashing them. */}
      <div className="relative aspect-[4/3] w-full md:aspect-square">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(min-width: 768px) 540px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          priority
        />

        {/* Scrim: a flat wash of the brand's dark `ink` rather than a
            decorative gradient. It exists purely so white text stays legible
            over a photo, and it lifts on hover so the image reads brighter as
            you point at it. */}
        <div className="absolute inset-0 bg-ink/55 transition-colors duration-500 group-hover:bg-ink/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <Heading className="font-heading text-[40px] leading-none font-light tracking-[2px] text-primary">
            {name}
          </Heading>

          {/* A short gold rule instead of a "read more" label — it gives the
              card a hover affordance by widening, without inventing any new
              copy that isn't on the original site. */}
          <span
            aria-hidden
            className="mt-5 block h-px w-10 bg-primary/80 transition-all duration-500 ease-out group-hover:w-20"
          />

          <p className="mt-6 max-w-[460px] text-lg leading-[1.7] font-extralight text-white/85">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
