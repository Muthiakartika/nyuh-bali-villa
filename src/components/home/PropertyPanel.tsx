import Image from "next/image";
import Link from "next/link";
import type { ElementType } from "react";
import { ArrowIcon } from "@/components/ui/icons";

type PropertyPanelProps = {
  name: string;
  description: string;
  imageSrc: string;
  href: string;
  /** There should only be one `<h1>` per page and this renders twice, so the
   * caller decides which tag applies rather than the component guessing. */
  headingLevel: "h1" | "h2";
};

/**
 * One half of the homepage's Seminyak/Ubud picker.
 *
 * The landing page is the choice itself: two full-height photographs meeting at
 * a seam, each carrying its name, its description, and an explicit action.
 * Per DESIGN.md's no-hover policy the action is always visible rather than
 * revealed on hover — on a phone there is no hover to reveal it with.
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
    <Link
      href={href}
      className="group relative flex min-h-[62vh] items-end overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent md:min-h-screen"
    >
      <Image
        src={imageSrc}
        alt={name}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        priority
      />

      {/* Two gradients rather than one flat wash: the top one exists only so
          the overlaying header stays legible, the bottom one carries the text.
          Between them the middle of the photograph is left at full strength,
          which is the entire point — the photography is what's being chosen. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/60 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"
      />

      {/* Bottom padding has to clear HomeFooter, which floats over the panels
          rather than sitting below them. Don't reduce it without re-measuring
          that footer. */}
      <div className="relative w-full px-7 pb-28 sm:px-10 md:px-14 md:pb-32">
        <Heading className="text-h1 font-medium text-on-dark">{name}</Heading>

        <p className="mt-5 max-w-[460px] text-body-sm text-on-dark-muted">
          {description}
        </p>

        {/* Icon-only on purpose. The no-hover policy says the affordance has to
            be permanently visible, but the original site has no call-to-action
            wording on these panels and inventing one ("Explore Seminyak") would
            be writing copy. An arrow says "this goes somewhere" without any. */}
        <span
          aria-hidden
          className="mt-7 flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-primary"
        >
          <ArrowIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
