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
 * One half of the homepage's Seminyak/Ubud picker: a heading, a short
 * description, and a photo, all linking to that property's site.
 *
 * On the live site this is built from three separate `<a>` tags — one
 * around the heading, one around the paragraph, one around the image, all
 * pointing at the same URL — because HTML doesn't allow nesting an `<a>`
 * inside another `<a>`, so a page builder wanting "click anywhere in this
 * block" has to duplicate the link instead. A single Next.js `<Link>`
 * wrapping all three pieces produces the identical clickable result with a
 * third of the markup, so that's the one intentional structural
 * simplification in this component versus the source DOM.
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
    // `group` lets the image inside react to hovering anywhere in this link
    // (heading, paragraph, or photo) via Tailwind's `group-hover:` variant,
    // rather than only when the cursor is directly over the image itself.
    <Link
      href={href}
      className="group flex w-full flex-col items-center py-5 text-center md:w-1/2"
    >
      <Heading className="font-heading text-[40px] font-light text-primary">
        {name}
      </Heading>
      <p className="mt-[15px] max-w-[500px] text-lg leading-[1.6] font-extralight text-ink">
        {description}
      </p>
      {/* overflow-hidden clips the image's hover zoom to this box instead of
          letting it spill over the surrounding text. */}
      <div className="relative mt-[15px] aspect-[3/2] w-full max-w-[500px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-fill transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
